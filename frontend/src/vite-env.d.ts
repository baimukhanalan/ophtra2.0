/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_YANDEX_METRICA_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_TIKTOK_PIXEL_ID?: string;
  readonly VITE_CALL_TRACKING_MAP?: string;
  readonly VITE_CLARITY_ID?: string;
  readonly VITE_GSC_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
