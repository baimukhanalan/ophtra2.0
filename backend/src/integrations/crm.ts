import { env } from '../config/env.ts';
import { logger } from '../lib/logger.ts';

/**
 * CRM integration layer.
 *
 * Transfers exactly the fields the specification lists: full name, phone,
 * email, selected service, source, date, UTM parameters and comments.
 *
 * The transport is deliberately thin — a single POST with a stable payload —
 * because the CRM vendor is the part most likely to change. Swapping Bitrix24
 * for amoCRM means changing `toVendorPayload` and the endpoint, nothing else.
 */

export interface CrmLead {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  source: string;
  date: string;
  utm: Record<string, string | undefined>;
  comment: string;
}

export interface CrmResult {
  status: 'sent' | 'simulated' | 'failed';
  crmId?: string;
  error?: string;
}

/** Canonical wire format. Documented in docs/INTEGRATIONS.md. */
const toVendorPayload = (lead: CrmLead) => ({
  fields: {
    TITLE: `OPHTRA — ${lead.fullName}`,
    NAME: lead.fullName,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'WORK' }],
    EMAIL: lead.email ? [{ VALUE: lead.email, VALUE_TYPE: 'WORK' }] : [],
    COMMENTS: lead.comment,
    SOURCE_ID: lead.source,
    UF_SERVICE: lead.serviceId,
    UF_UTM_SOURCE: lead.utm.source ?? '',
    UF_UTM_MEDIUM: lead.utm.medium ?? '',
    UF_UTM_CAMPAIGN: lead.utm.campaign ?? '',
    UF_UTM_CONTENT: lead.utm.content ?? '',
    UF_UTM_TERM: lead.utm.term ?? '',
    DATE_CREATE: lead.date,
  },
});

export const crm = {
  async pushLead(lead: CrmLead): Promise<CrmResult> {
    if (!env.crm.enabled || !env.crm.endpoint) {
      logger.info('crm.simulated', { phone: lead.phone, source: lead.source });
      return { status: 'simulated' };
    }

    try {
      const response = await fetch(env.crm.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.crm.apiKey}`,
        },
        body: JSON.stringify(toVendorPayload(lead)),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        const error = `CRM responded ${response.status}`;
        logger.warn('crm.failed', { error });
        return { status: 'failed', error };
      }

      const body = (await response.json().catch(() => ({}))) as { result?: string | number };
      logger.info('crm.sent', { crmId: body.result });
      return { status: 'sent', crmId: body.result ? String(body.result) : undefined };
    } catch (error) {
      // A CRM outage must never lose a lead: it stays in our database with
      // crm_status='failed' and is retried by the reconciliation job.
      logger.error('crm.error', { error: String(error) });
      return { status: 'failed', error: String(error) };
    }
  },
};
