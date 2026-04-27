/**
 * Portal Domain Configuration (HRM App)
 *
 * Dev environment:
 *   portal.dev.local:3000  → Gateway (login + module selector)
 *   hrm.dev.local:3001     → HRM Portal (this app)
 *   crm.dev.local:3002     → CRM Portal
 *   api.dev.local:8080     → Backend API
 */
export const portalConfig = {
  gateway: import.meta.env.VITE_GATEWAY_URL,
  hrm: import.meta.env.VITE_HRM_URL,
  crm: import.meta.env.VITE_CRM_URL,
  api: import.meta.env.VITE_BACKEND_BASE_URL,
} as const;

/**
 * Get the gateway login URL for redirects
 */
export function getGatewayLoginUrl(): string {
  return `${portalConfig.gateway}/login`;
}
