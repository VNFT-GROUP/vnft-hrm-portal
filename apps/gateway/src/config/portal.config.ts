/**
 * Portal Domain Configuration
 * 
 * Maps all sub-applications to their domain URLs.
 * Uses Vite env vars with fallback to dev.local defaults.
 * 
 * Dev environment:
 *   portal.dev.local:3000  → Gateway (login + module selector)
 *   hrm.dev.local:3001     → HRM Portal
 *   crm.dev.local:3002     → CRM Portal
 *   api.dev.local:8080     → Backend API
 */
export const portalConfig = {
  gateway: import.meta.env.VITE_GATEWAY_URL || 'http://portal.dev.local:3000',
  hrm:     import.meta.env.VITE_HRM_URL     || 'http://hrm.dev.local:3001',
  crm:     import.meta.env.VITE_CRM_URL     || 'http://crm.dev.local:3002',
  api:     import.meta.env.VITE_BACKEND_BASE_URL || 'http://api.dev.local:8080',
} as const;

/**
 * Module URL map (keyed by module id from modules data)
 */
export const moduleUrlMap: Record<string, string> = {
  hrm:      portalConfig.hrm,
  crm:      portalConfig.crm,
  fms:      '#', // Not yet deployed
  finance:  '#', // Not yet deployed
  namecard: '#', // Not yet deployed
};

/**
 * Get the gateway login URL for redirects
 */
export function getGatewayLoginUrl(): string {
  return `${portalConfig.gateway}/login`;
}
