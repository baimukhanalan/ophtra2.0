import { Router } from 'express';
import { asyncHandler, HttpError, optionalString } from '../lib/http.ts';
import { authenticate } from '../lib/auth.ts';
import { getDatabase } from '../db/index.ts';
import type { InvoiceRow, PatientRow } from '../db/types.ts';
import { payments } from '../integrations/payments.ts';
import { notifications } from '../integrations/notifications.ts';

/**
 * Payments.
 *
 * Service payment, operation payment, prepayment, refund and electronic
 * receipt. The service never receives card data: the client exchanges card
 * details with the provider's hosted form and sends only the resulting token.
 */
export const paymentsRouter = Router();

const toApi = (row: InvoiceRow) => ({
  id: row.id,
  number: row.number,
  patientId: row.patient_id,
  appointmentId: row.appointment_id,
  amount: row.amount,
  status: row.status,
  kind: row.kind,
  issuedAt: row.issued_at,
  receiptUrl: row.receipt_url ?? undefined,
});

const loadOwnInvoice = async (invoiceId: string, patientId: string): Promise<InvoiceRow> => {
  const db = getDatabase();
  const invoice = await db.get<InvoiceRow>(
    'SELECT * FROM invoices WHERE id = @id AND patient_id = @patient_id',
    { id: invoiceId, patient_id: patientId },
  );
  if (!invoice) throw HttpError.notFound('Invoice not found');
  return invoice;
};

paymentsRouter.post(
  '/:id/pay',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    const invoice = await loadOwnInvoice(String(req.params.id), session.subject);

    if (invoice.status === 'paid') throw HttpError.conflict('Invoice already paid', 'already_paid');
    if (invoice.status === 'refunded') {
      throw HttpError.conflict('Invoice was refunded', 'already_refunded');
    }

    const result = await payments.charge({
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      amount: invoice.amount,
      kind: invoice.kind as 'service' | 'operation' | 'prepayment',
      description: `OPHTRA ${invoice.number}`,
      cardToken: optionalString(req.body, 'cardToken'),
    });

    if (result.status === 'failed') {
      throw HttpError.badRequest(result.error ?? 'Payment failed', 'payment_failed');
    }

    const db = getDatabase();
    const paidAt = new Date().toISOString();

    await db.run(
      `UPDATE invoices
       SET status = 'paid', paid_at = @paid_at, provider_ref = @provider_ref, receipt_url = @receipt_url
       WHERE id = @id`,
      {
        id: invoice.id,
        paid_at: paidAt,
        provider_ref: result.providerRef,
        receipt_url: result.receiptUrl ?? payments.receiptUrl(invoice.number),
      },
    );

    const patient = await db.get<PatientRow>('SELECT * FROM patients WHERE id = @id', {
      id: session.subject,
    });

    // The electronic receipt is delivered on the same omnichannel cascade as
    // every other patient message, so it lands in the CRM timeline too.
    if (patient) {
      await notifications.send({
        patientId: patient.id,
        phone: patient.phone,
        email: patient.email,
        template: 'notification',
        language: 'ru',
        variables: [invoice.number, String(invoice.amount)],
      });
    }

    res.json({
      ...toApi(invoice),
      status: 'paid',
      receiptUrl: result.receiptUrl ?? payments.receiptUrl(invoice.number),
    });
  }),
);

paymentsRouter.post(
  '/:id/refund',
  asyncHandler(async (req, res) => {
    const session = authenticate(req, 'patient');
    const invoice = await loadOwnInvoice(String(req.params.id), session.subject);

    if (invoice.status !== 'paid') {
      throw HttpError.conflict('Only a paid invoice can be refunded', 'not_refundable');
    }

    const result = await payments.refund(invoice.provider_ref ?? invoice.id, invoice.amount);
    if (result.status === 'failed') {
      throw HttpError.badRequest(result.error ?? 'Refund failed', 'refund_failed');
    }

    const db = getDatabase();
    await db.run(
      "UPDATE invoices SET status = 'refunded', refunded_at = @refunded_at WHERE id = @id",
      { id: invoice.id, refunded_at: new Date().toISOString() },
    );

    res.json({ ...toApi(invoice), status: 'refunded' });
  }),
);
