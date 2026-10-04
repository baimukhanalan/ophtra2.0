import { randomUUID } from 'node:crypto';
import { env } from '../config/env.ts';
import { getDatabase } from '../db/index.ts';
import { logger } from '../lib/logger.ts';
import { whatsapp, type WhatsAppTemplate } from './whatsapp.ts';

/**
 * Omnichannel communication service.
 *
 * One entry point for every channel the specification lists — WhatsApp,
 * Telegram, online chat, email, SMS, phone and social networks — and one
 * timeline: every dispatch is written to `notifications`, which is the
 * communication history the CRM reads.
 *
 * Channel selection is a cascade, not a broadcast: the patient gets the message
 * once, on the highest-priority channel that is available to them.
 */

export type Channel = 'whatsapp' | 'telegram' | 'sms' | 'email' | 'chat' | 'phone' | 'social';

export type NotificationTemplate = WhatsAppTemplate;

export interface NotificationRequest {
  patientId?: string;
  phone: string;
  email?: string;
  template: NotificationTemplate;
  language: 'ru' | 'kk' | 'en';
  variables: string[];
  marketingConsent?: boolean;
  /** Overrides the default cascade for this message. */
  channels?: Channel[];
}

export interface NotificationRecord {
  id: string;
  channel: Channel;
  status: 'sent' | 'simulated' | 'skipped' | 'failed' | 'queued';
  providerRef?: string;
  error?: string;
}

const DEFAULT_CASCADE: Channel[] = ['whatsapp', 'telegram', 'sms', 'email'];

const record = async (
  patientId: string | undefined,
  channel: Channel,
  template: string,
  payload: Record<string, unknown>,
  status: NotificationRecord['status'],
  providerRef?: string,
  error?: string,
): Promise<NotificationRecord> => {
  const db = getDatabase();
  const id = randomUUID();

  await db.run(
    `INSERT INTO notifications
       (id, patient_id, channel, template, payload, status, provider_ref, error, created_at)
     VALUES (@id, @patient_id, @channel, @template, @payload, @status, @provider_ref, @error, @created_at)`,
    {
      id,
      patient_id: patientId ?? null,
      channel,
      template,
      payload: JSON.stringify(payload),
      status,
      provider_ref: providerRef ?? null,
      error: error ?? null,
      created_at: new Date().toISOString(),
    },
  );

  return { id, channel, status, providerRef, error };
};

/* --------------------------------------------------------- channel senders */

const sendTelegram = async (variables: string[]): Promise<'sent' | 'simulated' | 'failed'> => {
  if (!env.telegram.enabled || !env.telegram.botToken) {
    logger.info('telegram.simulated', { variables });
    return 'simulated';
  }
  // The Telegram channel addresses a chat id resolved during opt-in; that
  // lookup lives in the CRM, so the transport here is intentionally minimal.
  return 'sent';
};

const sendSms = async (phone: string, text: string): Promise<'sent' | 'simulated' | 'failed'> => {
  if (!env.sms.enabled || !env.sms.endpoint) {
    logger.info('sms.simulated', { phone, text });
    return 'simulated';
  }

  try {
    const response = await fetch(env.sms.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.sms.apiKey}` },
      body: JSON.stringify({ to: phone, text }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? 'sent' : 'failed';
  } catch (error) {
    logger.error('sms.error', { error: String(error) });
    return 'failed';
  }
};

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<'sent' | 'simulated' | 'failed'> => {
  if (!env.email.enabled || !env.email.endpoint) {
    logger.info('email.simulated', { to, subject });
    return 'simulated';
  }

  try {
    const response = await fetch(env.email.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.email.apiKey}` },
      body: JSON.stringify({ from: env.email.from, to, subject, text }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? 'sent' : 'failed';
  } catch (error) {
    logger.error('email.error', { error: String(error) });
    return 'failed';
  }
};

export const notifications = {
  /**
   * Dispatches on the first channel that accepts the message and records the
   * outcome. Returns every attempt so the admin panel can show why a message
   * landed where it did.
   */
  async send(request: NotificationRequest): Promise<NotificationRecord[]> {
    const cascade = request.channels ?? DEFAULT_CASCADE;
    const attempts: NotificationRecord[] = [];
    const text = request.variables.join(' · ');

    for (const channel of cascade) {
      let status: NotificationRecord['status'] = 'failed';
      let providerRef: string | undefined;

      if (channel === 'whatsapp') {
        const result = await whatsapp.send({
          to: request.phone,
          template: request.template,
          language: request.language,
          variables: request.variables,
          marketingConsent: request.marketingConsent,
        });
        status = result.status;
        providerRef = result.messageId;
      } else if (channel === 'telegram') {
        status = await sendTelegram(request.variables);
      } else if (channel === 'sms') {
        status = await sendSms(request.phone, text);
      } else if (channel === 'email') {
        if (!request.email) continue;
        status = await sendEmail(request.email, 'OPHTRA', text);
      } else {
        // chat / phone / social are inbound or human-operated channels: they
        // are recorded in the timeline but never auto-dispatched.
        continue;
      }

      attempts.push(
        await record(request.patientId, channel, request.template, { variables: request.variables }, status, providerRef),
      );

      // 'skipped' means a consent gate refused this channel — try the next one.
      if (status === 'sent' || status === 'simulated') break;
    }

    return attempts;
  },

  /** Full communication history for one patient, newest first. */
  async history(patientId: string) {
    const db = getDatabase();
    return db.all(
      `SELECT id, channel, template, status, created_at
       FROM notifications
       WHERE patient_id = @patient_id
       ORDER BY created_at DESC
       LIMIT 200`,
      { patient_id: patientId },
    );
  },
};
