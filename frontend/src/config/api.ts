const defaultApiUrl = 'http://localhost:3001';

export const apiBaseUrl = (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '');
