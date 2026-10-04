import { env } from '../config/env.ts';
import { logger } from '../lib/logger.ts';

/**
 * WhatsApp Business integration.
 *
 * Covers the four service scenarios plus consented marketing:
 * appointment confirmation, reminders, rescheduling and general notifications
 * are transactional templates; marketing templates are sent only when the
 * patient has ticked the separate marketing consent box.
 */

export type WhatsAppTemplate =
  | 'appointment_confirmation'
  | 'appointment_reminder_24h'
  | 'appointment_reminder_2h'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'notification'
  | 'marketing_promotion';

/** Templates that require explicit marketing consent before sending. */
const MARKETING_TEMPLATES: WhatsAppTemplate[] = ['marketing_promotion'];

export interface WhatsAppMessage {
  to: string;
  template: WhatsAppTemplate;
  language: 'ru' | 'kk' | 'en';
  /** Ordered template variables. */
  variables: string[];
  /** Whether the recipient has consented to marketing messages. */
  marketingConsent?: boolean;
}

export interface WhatsAppResult {
  status: 'sent' | 'simulated' | 'skipped' | 'failed';
  messageId?: string;
  error?: string;
}

const normalisePhone = (phone: string): string => phone.replace(/[^\d]/g, '');

export const whatsapp = {
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    // Consent gate comes before anything else: a marketing template must never
    // reach a patient who has not opted in, configured provider or not.
    if (MARKETING_TEMPLATES.includes(message.template) && !message.marketingConsent) {
      logger.info('whatsapp.skipped.no_consent', { template: message.template });
      return { status: 'skipped' };
    }

    if (!env.whatsapp.enabled || !env.whatsapp.token) {
      logger.info('whatsapp.simulated', {
        to: normalisePhone(message.to),
        template: message.template,
        variables: message.variables,
      });
      return { status: 'simulated' };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/${env.whatsapp.apiVersion}/${env.whatsapp.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.whatsapp.token}`,
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: normalisePhone(message.to),
            type: 'template',
            template: {
              name: message.template,
              language: { code: message.language },
              components: [
                {
                  type: 'body',
                  parameters: message.variables.map((text) => ({ type: 'text', text })),
                },
              ],
            },
          }),
          signal: AbortSignal.timeout(8000),
        },
      );

      if (!response.ok) {
        const error = `WhatsApp responded ${response.status}`;
        logger.warn('whatsapp.failed', { error, template: message.template });
        return { status: 'failed', error };
      }

      const body = (await response.json()) as { messages?: Array<{ id: string }> };
      return { status: 'sent', messageId: body.messages?.[0]?.id };
    } catch (error) {
      logger.error('whatsapp.error', { error: String(error) });
      return { status: 'failed', error: String(error) };
    }
  },
};
