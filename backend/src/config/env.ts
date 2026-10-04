import 'dotenv/config';

/**
 * Runtime configuration.
 *
 * Every integration is optional: without credentials the corresponding adapter
 * runs in `simulated` mode, logging the payload it would have sent instead of
 * calling the provider. That keeps the demo deployment self-contained while the
 * production wiring is a matter of setting variables, not changing code.
 */

const str = (key: string, fallback = ''): string => process.env[key]?.trim() || fallback;
const num = (key: string, fallback: number): number => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) ? value : fallback;
};
const bool = (key: string, fallback = false): boolean => {
  const value = process.env[key]?.trim().toLowerCase();
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1' || value === 'yes';
};

export const env = {
  nodeEnv: str('NODE_ENV', 'development'),
  port: num('PORT', 4000),
  siteUrl: str('SITE_URL', 'https://ophtra.kz'),
  corsOrigins: str('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  /** Database driver. `sqlite` is the demo default; `postgres` is production. */
  dbDriver: str('DB_DRIVER', 'sqlite') as 'sqlite' | 'postgres',
  dbFile: str('DB_FILE', 'data/ophtra.db'),
  dbUrl: str('DATABASE_URL'),

  /** Demo credentials — replaced by the identity provider in production. */
  adminLogin: str('ADMIN_LOGIN', 'admin'),
  adminPassword: str('ADMIN_PASSWORD', 'ophtra'),
  demoOtp: str('DEMO_OTP', '0000'),
  tokenSecret: str('TOKEN_SECRET', 'ophtra-demo-secret'),

  crm: {
    enabled: bool('CRM_ENABLED'),
    endpoint: str('CRM_ENDPOINT'),
    apiKey: str('CRM_API_KEY'),
  },

  mis: {
    enabled: bool('MIS_ENABLED'),
    endpoint: str('MIS_ENDPOINT'),
    apiKey: str('MIS_API_KEY'),
    /** Clinic identifier inside the MIS. */
    facilityId: str('MIS_FACILITY_ID'),
  },

  whatsapp: {
    enabled: bool('WHATSAPP_ENABLED'),
    phoneNumberId: str('WHATSAPP_PHONE_NUMBER_ID'),
    token: str('WHATSAPP_TOKEN'),
    apiVersion: str('WHATSAPP_API_VERSION', 'v21.0'),
  },

  telegram: {
    enabled: bool('TELEGRAM_ENABLED'),
    botToken: str('TELEGRAM_BOT_TOKEN'),
  },

  sms: {
    enabled: bool('SMS_ENABLED'),
    endpoint: str('SMS_ENDPOINT'),
    apiKey: str('SMS_API_KEY'),
  },

  email: {
    enabled: bool('EMAIL_ENABLED'),
    endpoint: str('EMAIL_ENDPOINT'),
    apiKey: str('EMAIL_API_KEY'),
    from: str('EMAIL_FROM', 'noreply@ophtra.kz'),
  },

  payments: {
    enabled: bool('PAYMENTS_ENABLED'),
    provider: str('PAYMENT_PROVIDER', 'demo'),
    endpoint: str('PAYMENT_ENDPOINT'),
    merchantId: str('PAYMENT_MERCHANT_ID'),
    apiKey: str('PAYMENT_API_KEY'),
  },
} as const;

export const isSimulated = (integration: { enabled: boolean }): boolean => !integration.enabled;
