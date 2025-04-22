
interface ImportMetaEnv {
  readonly VITE_MPESA_PAYBILL_NUMBER: string
  readonly VITE_MPESA_CALLBACK_URL: string
  readonly VITE_MPESA_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
