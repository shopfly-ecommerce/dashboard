import * as _api from './api'
import * as _domain from './domain'

// Whether the current foreground is in development mode
let is_dev = process.env.NODE_ENV === 'development'

// Background providedAPImodel【dev|pro】
export const api_model = 'dev'
// APIAutomatic adaptation according to the foreground environment
export const api = is_dev ? _api.dev : _api.pro
// The domain name automatically ADAPTS to the foreground environment
export const domain = is_dev ? _domain.dev : _domain.pro
// In the development environmentAPI
export const api_dev = _api.dev
// In the production environmentAPI
export const api_pro = _api.pro
// Domain name in the development environment
export const domain_dev = _domain.dev
// Domain name in the production environment
export const domain_pro = _domain.pro
