const defaultApiUrl = 'http://localhost:3001';
const apiUrl = import.meta.env.VITE_API_URL ?? defaultApiUrl;

export const VITE_API_BASE_URL = apiUrl.replace(/\/$/, '');
