import { writable } from 'svelte/store';

export const consent = $state({
  cookieConsentSeen: '',
  trackingConsent: 'false',
  marketingConsent: 'false',
  preferencesConsent: 'false',
  allowTracking: '',
  allowMarketing: '',
  allowPreferences: '',
});
// export const cookieConsentSeen = writable();
// export const trackingConsent = writable('false');
// export const marketingConsent = writable('false');
// export const preferencesConsent = writable('false');
// export const allowTracking = writable();
// export const allowMarketing = writable();
// export const allowPreferences = writable();
