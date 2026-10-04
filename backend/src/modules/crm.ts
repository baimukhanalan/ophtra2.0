import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { asyncHandler, optionalString, requirePhone, requireString } from '../lib/http.ts';
import { getDatabase } from '../db/index.ts';
import { crm } from '../integrations/crm.ts';

/**
 * CRM endpoints.
 *
 * Every lead is written to our database first and pushed to the CRM second, so
 * a vendor outage degrades to a delayed sync rather than a lost enquiry.
 */
export const crmRouter = Router();

crmRouter.post(
  '/leads',
  asyncHandler(async (req, res) => {
    const body = req.body as Record<string, unknown>;

    const fullName = requireString(body, 'fullName');
    const phone = requirePhone(body);
    const email = optionalString(body, 'email');
    const serviceId = optionalString(body, 'serviceId');
    const source = optionalString(body, 'source') || 'website';
    const comment = optionalString(body, 'comment');
    const utm = (body.utm as Record<string, string | undefined>) ?? {};
    const now = new Date().toISOString();

    const db = getDatabase();
    const id = randomUUID();

    await db.run(
      `INSERT INTO leads
         (id, full_name, phone, email, service_id, source, comment, utm, crm_status, created_at)
       VALUES (@id, @full_name, @phone, @email, @service_id, @source, @comment, @utm, 'pending', @created_at)`,
      {
        id,
        full_name: fullName,
        phone,
        email,
        service_id: serviceId,
        source,
        comment,
        utm: JSON.stringify(utm),
        created_at: now,
      },
    );

    const result = await crm.pushLead({
      fullName,
      phone,
      email,
      serviceId,
      source,
      date: now,
      utm,
      comment,
    });

    await db.run(
      'UPDATE leads SET crm_id = @crm_id, crm_status = @crm_status WHERE id = @id',
      { crm_id: result.crmId ?? null, crm_status: result.status, id },
    );

    res.status(201).json({ id });
  }),
);
