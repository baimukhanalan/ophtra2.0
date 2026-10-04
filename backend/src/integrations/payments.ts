import { randomUUID } from 'node:crypto';
import { env } from '../config/env.ts';
import { logger } from '../lib/logger.ts';

/**
 * Payment provider adapter.
 *
 * Supports the five operations the specification requires: service payment,
 * operation payment, prepayment, refund and electronic receipt.
 *
 * With `PAYMENTS_ENABLED=false` the adapter runs a demonstration loop: it
 * returns a successful, clearly-marked simulated charge and never contacts a
 * provider. No card data ever reaches this service in either mode — the
 * provider's hosted form owns the card fields, and we only ever see a token.
 */

export type PaymentKind = 'service' | 'operation' | 'prepayment';

export interface ChargeRequest {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency?: 'KZT';
  kind: PaymentKind;
  description: string;
  /** Opaque token issued by the provider's hosted form. */
  cardToken?: string;
}

export interface ChargeResult {
  status: 'paid' | 'simulated' | 'failed';
  providerRef: string;
  receiptUrl?: string;
  error?: string;
}

export interface RefundResult {
  status: 'refunded' | 'simulated' | 'failed';
  providerRef: string;
  error?: string;
}

const receiptUrlFor = (invoiceNumber: string) => `/receipts/${invoiceNumber}.pdf`;

export const payments = {
  get mode(): 'live' | 'demo' {
    return env.payments.enabled && env.payments.endpoint ? 'live' : 'demo';
  },

  async charge(request: ChargeRequest): Promise<ChargeResult> {
    if (this.mode === 'demo') {
      const providerRef = `demo-${randomUUID()}`;
      logger.info('payment.simulated', {
        invoice: request.invoiceNumber,
        amount: request.amount,
        kind: request.kind,
      });
      return {
        status: 'simulated',
        providerRef,
        receiptUrl: receiptUrlFor(request.invoiceNumber),
      };
    }

    try {
      const response = await fetch(`${env.payments.endpoint}/charges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.payments.apiKey}`,
          // Guards against a double charge if the request is retried.
          'Idempotency-Key': request.invoiceId,
        },
        body: JSON.stringify({
          merchant_id: env.payments.merchantId,
          amount: request.amount,
          currency: request.currency ?? 'KZT',
          order_id: request.invoiceNumber,
          description: request.description,
          card_token: request.cardToken,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const error = `Payment provider responded ${response.status}`;
        logger.warn('payment.failed', { error, invoice: request.invoiceNumber });
        return { status: 'failed', providerRef: '', error };
      }

      const body = (await response.json()) as { id: string; receipt_url?: string };
      logger.info('payment.paid', { invoice: request.invoiceNumber, providerRef: body.id });
      return {
        status: 'paid',
        providerRef: body.id,
        receiptUrl: body.receipt_url ?? receiptUrlFor(request.invoiceNumber),
      };
    } catch (error) {
      logger.error('payment.error', { error: String(error) });
      return { status: 'failed', providerRef: '', error: String(error) };
    }
  },

  async refund(providerRef: string, amount: number): Promise<RefundResult> {
    if (this.mode === 'demo') {
      logger.info('refund.simulated', { providerRef, amount });
      return { status: 'simulated', providerRef };
    }

    try {
      const response = await fetch(`${env.payments.endpoint}/charges/${providerRef}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.payments.apiKey}`,
          'Idempotency-Key': `refund-${providerRef}`,
        },
        body: JSON.stringify({ amount }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        return { status: 'failed', providerRef, error: `Provider responded ${response.status}` };
      }

      logger.info('refund.completed', { providerRef, amount });
      return { status: 'refunded', providerRef };
    } catch (error) {
      logger.error('refund.error', { error: String(error) });
      return { status: 'failed', providerRef, error: String(error) };
    }
  },

  /**
   * Electronic receipt reference. In production the fiscal operator issues the
   * document and returns its URL; the demo loop derives a stable path so the
   * account page has something to link to.
   */
  receiptUrl: receiptUrlFor,
};
