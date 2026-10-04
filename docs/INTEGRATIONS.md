# Integrations

Every external system sits behind an adapter in `backend/src/integrations/`.
Each adapter has two modes: **live** when its credentials are configured, and
**simulated** when they are not — in which case it logs the payload it would
have sent and returns a clearly-marked simulated result.

That means the demo deployment is self-contained and going live is a matter of
setting environment variables, not editing code. `GET /api/health` reports the
current mode of every integration.

## CRM — `integrations/crm.ts`

Transfers exactly the fields the specification lists: full name, phone, email,
selected service, source, date, UTM parameters, comments.

Leads are written to our own `leads` table **first** and pushed to the CRM
second, with the outcome recorded in `crm_status`. A CRM outage therefore
degrades to a delayed sync, never a lost enquiry.

The vendor wire format lives in one function, `toVendorPayload`. Swapping
Bitrix24 for amoCRM means changing that function and the endpoint.

```
CRM_ENABLED=true
CRM_ENDPOINT=https://…/crm.lead.add.json
CRM_API_KEY=…
```

## MIS — `integrations/mis.ts`

Supports doctor schedules, available slots, appointment creation, patient
creation, personal information transfer, medical service transfer and duplicate
booking prevention.

The MIS is the authority on availability. When it is unreachable or not
configured, the adapter falls back to the clinic's own scheduling rules from
`shared/booking/slots.ts` so the site keeps taking bookings; those are
reconciled by the contact centre from the CRM lead record.

Appointment creation sends `Idempotency-Key: <our appointment id>`, so a retry
after a network timeout cannot create a second appointment in the MIS.

```
MIS_ENABLED=true
MIS_ENDPOINT=https://mis.example.kz/api/v1
MIS_API_KEY=…
MIS_FACILITY_ID=…
```

## WhatsApp Business — `integrations/whatsapp.ts`

Templates: `appointment_confirmation`, `appointment_reminder_24h`,
`appointment_reminder_2h`, `appointment_rescheduled`, `appointment_cancelled`,
`notification`, `marketing_promotion`.

The consent gate runs **before** the provider check: a marketing template can
never reach a patient who has not ticked the separate marketing consent box,
configured provider or not.

```
WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER_ID=…
WHATSAPP_TOKEN=…
```

## Omnichannel notifications — `integrations/notifications.ts`

One entry point for WhatsApp, Telegram, SMS, email, chat, phone and social. It
is a **cascade, not a broadcast**: the patient receives the message once, on the
highest-priority channel that accepts it (`whatsapp → telegram → sms → email`).

Every dispatch — including simulated and skipped ones — is written to the
`notifications` table. That table is the communication history the CRM reads,
and `GET /api/account/communications` exposes it to the patient.

Chat, phone and social are inbound or human-operated: they are recorded in the
timeline but never auto-dispatched.

## Payments — `integrations/payments.ts`

Service payment, operation payment, prepayment, refund and electronic receipt.

**No card data ever reaches this service.** The client exchanges card details
with the provider's hosted form and sends only the resulting token. Charges and
refunds both send an idempotency key derived from the invoice, so a retry
cannot double-charge.

With `PAYMENTS_ENABLED=false` the adapter runs a demonstration loop that returns
a successful simulated charge and contacts no provider. The UI states this
plainly rather than implying a real transaction occurred.

```
PAYMENTS_ENABLED=true
PAYMENT_PROVIDER=…
PAYMENT_ENDPOINT=https://…
PAYMENT_MERCHANT_ID=…
PAYMENT_API_KEY=…
```

## Analytics — browser + server

The browser layer (`frontend/src/services/analytics.ts`) fans one logical event
out to GA4, Google Tag Manager, Yandex Metrica, Meta Pixel and TikTok Pixel.
**No vendor tag loads before consent is granted**, so a first visit makes zero
third-party requests.

The server layer (`POST /api/analytics/events`) always receives the event
because it is first-party and pseudonymous — and it strips any payload key that
looks like personal data (`phone`, `email`, `name`, `comment`, …) before
storing. The value is the join: the same session id is attached to the
appointment record, so a campaign is measured against clinic outcomes rather
than form submissions.

Call tracking uses dynamic number insertion driven by
`VITE_CALL_TRACKING_MAP="google:+7727…,yandex:+7727…,default:+7727…"`.
