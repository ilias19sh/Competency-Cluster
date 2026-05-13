const defaultApiUrl = 'http://localhost:3001';

export const VITE_API_BASE_URL = (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '');
