import { beforeEach, afterEach, afterAll, describe, it, expect, test, vi } from 'vitest';
import { docCookies, setSelectedConsent } from './cookies.svelte.js';
import { consent } from './store.svelte.js';

// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

let expires = new Date();
expires.setMonth(expires.getMonth() + 12);
const HT = (window.HT = window.HT || {});
HT.cookies_domain = '.hathitrust.org';

//need to set these in order to set cookies in this "browser"
window.location.host = 'www.hathitrust.org';
window.location.protocol = 'https:';

const getItemSpy = vi.spyOn(docCookies, 'getItem');
const setItemSpy = vi.spyOn(docCookies, 'setItem');
const remoteItemSpy = vi.spyOn(docCookies, 'removeItem');

describe('Document is available', () => {
  it('should not be undefined', () => {
    expect(document).not.toBeUndefined();
  });
});
describe('docCookies', () => {
  beforeEach(() => {
    document.cookie = 'COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });
  describe('getItem', () => {
    test('gets value of cookie from document.cookie', () => {
      document.cookie = 'COOKIE=true; path=/';
      expect(docCookies.getItem('COOKIE')).toStrictEqual('true');
      expect(getItemSpy).toHaveBeenCalled();
    });
    test('returns null if cookie key does not exist', () => {
      expect(docCookies.getItem('NOCOOKIE')).toBe(null);
      expect(getItemSpy).toHaveBeenCalled();
    });
  });
  describe('setItem', () => {
    test('sets cookie with key and value', () => {
      expect(docCookies.setItem('COOKIE', 'cookie')).toBe(true);
      expect(document.cookie).toBeTruthy();
      expect(document.cookie).toContain('COOKIE=cookie');
      expect(setItemSpy).toHaveBeenCalled();
    });
  });
  describe('removeItem', () => {
    test('removes cookie with given name/key', () => {
      //set up a cookie
      expect(document.cookie).toEqual('');
      document.cookie = 'COOKIE=cookie; path=/';
      expect(document.cookie).toContain('COOKIE=cookie');

      //now test removeItem
      expect(docCookies.removeItem('COOKIE')).toBe(true);
      expect(document.cookie).toEqual('');
      expect(remoteItemSpy).toHaveBeenCalled();
    });
  });
});
describe('setSelectedConsent', () => {
  afterAll(() => {
    docCookies.removeItem('HT-tracking-cookie-consent');
    docCookies.removeItem('HT-marketing-cookie-consent');
  });
  it('if allowTracking is true, it should set HT-tracking-consent to true', () => {
    consent.allowTracking = true;
    setSelectedConsent();

    expect(consent.allowTracking).toBe(true);
    expect(document.cookie).toContain('HT-tracking-cookie-consent=true');
  });
  it('should set HT-marketing-consent to false', () => {
    consent.allowMarketing = false;
    setSelectedConsent();

    expect(consent.allowMarketing).toBe(false);
    expect(document.cookie).toContain('HT-marketing-cookie-consent=false');
  });
});
