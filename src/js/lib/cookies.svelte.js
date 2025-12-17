import { consent } from './store.svelte.js';
export class TestCookieJar {
  constructor(data) {
    this.data = data || {};
  }

  getItem(key) {
    return this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
  }

  hasItem(key) {
    if (!key) {
      return false;
    }
    return key in this.data;
  }
}

// ported from unicorn days, waiting for https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/CookieStore
export const docCookies = {
  getItem: function (sKey) {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  },
  setItem: function (sKey, sValue, duration = 365) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var expires = new Date();
    expires.setDate(expires.getDate() + duration);

    const sExpires = duration !== 0 ? '; expires=' + expires.toUTCString() : '';
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (HT.cookies_domain ? '; domain=' + HT.cookies_domain : '') +
      '; path=/' +
      (HT.secure_cookies ? '; secure' : '') +
      '; SameSite=Lax';
    return true;
  },
  removeItem: function (sKey) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (HT.cookies_domain ? '; domain=' + HT.cookies_domain : '') +
      '; path=/';
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) {
      return false;
    }
    return new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(
      document.cookie
    );
  },
  keys: function () {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

function setCookieConsentSeen() {
  docCookies.setItem('HT-cookie-banner-seen', 'true');
  consent.cookieConsentSeen = 'true';
}
function setTrackingAllowedCookie() {
  docCookies.setItem('HT-tracking-cookie-consent', 'true');
  consent.trackingConsent = 'true';
}

function setTrackingDisallowedCookie() {
  docCookies.setItem('HT-tracking-cookie-consent', 'false');
  consent.trackingConsent = 'false';
}

function setMarketingAllowedCookie() {
  docCookies.setItem('HT-marketing-cookie-consent', 'true');
  consent.marketingConsent = 'true';
}

function setMarketingDisallowedCookie() {
  docCookies.setItem('HT-marketing-cookie-consent', 'false');
  consent.marketingConsent = 'false';
}

function setPreferencesAllowedCookie() {
  docCookies.setItem('HT-preferences-cookie-consent', 'true');
  consent.preferencesConsent = 'true';
}

function setPreferencesDisallowedCookie() {
  docCookies.setItem('HT-preferences-cookie-consent', 'false');
  consent.preferencesConsent = 'false';
}

export function setSelectedConsent() {
  const track = consent.allowTracking;
  const mark = consent.allowMarketing;
  const pref = consent.allowPreferences;
  if (track === false) {
    setTrackingDisallowedCookie();
  }
  if (track === true) {
    setTrackingAllowedCookie();
  }
  if (mark === false) {
    setMarketingDisallowedCookie();
  }
  if (mark === true) {
    setMarketingAllowedCookie();
  }
  if (pref === false) {
    setPreferencesDisallowedCookie();
  }
  if (pref === true) {
    setPreferencesAllowedCookie();
  }
}

export function allowAll() {
  setCookieConsentSeen();
  setTrackingAllowedCookie();
  setMarketingAllowedCookie();
  setPreferencesAllowedCookie();
}

export function allowSelected() {
  setSelectedConsent();
  setCookieConsentSeen();
}

export function denyAll() {
  setCookieConsentSeen();
  setTrackingDisallowedCookie();
  setMarketingDisallowedCookie();
  setPreferencesDisallowedCookie();
}

export function resetCookieBanner() {
  docCookies.removeItem('HT-cookie-banner-seen');
  docCookies.removeItem('HT-tracking-cookie-consent');
  docCookies.removeItem('HT-marketing-cookie-consent');
  docCookies.removeItem('HT-preferences-cookie-consent');
  consent.cookieConsentSeen = 'false';
  consent.trackingConsent = 'false';
  consent.marketingConsent = 'false';
  consent.preferencesConsent = 'false';
}

export default docCookies;
