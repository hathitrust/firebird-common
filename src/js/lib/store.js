import { writable } from 'svelte/store'

export const cookieConsentSeen = writable();
export const trackingConsent = writable('false');
export const marketingConsent = writable('false');
export const preferencesConsent = writable('false');
export const allowTracking = writable();
export const allowMarketing = writable();
export const allowPreferences = writable();