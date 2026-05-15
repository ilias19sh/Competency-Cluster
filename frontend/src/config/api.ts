const localApiUrl = 'http://localhost:3001';
const productionApiUrl = 'https://cda-back-434930508478.europe-west9.run.app';
const defaultApiUrl =
  typeof window !== 'undefined' && window.location.hostname.includes('competency-cluster.fr')
    ? productionApiUrl
    : localApiUrl;
const apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

export const VITE_API_BASE_URL = apiUrl.replace(/\/$/, '');
