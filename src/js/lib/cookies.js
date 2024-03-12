import { get } from 'svelte/store'
import { cookieConsentSeen, trackingConsent, marketingConsent, preferencesConsent, allowTracking, allowMarketing, allowPreferences } from './store'
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
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
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

let expires = new Date();
expires.setMonth(expires.getMonth() + 12);

let mainContent;
let skiplinks;
if (document.body.classList.contains('apps') ) {
  //apps
  mainContent = document.querySelector('#root');
  skiplinks = document.querySelector('#skiplinks');
} else {
  //wordpress
  mainContent = document.querySelector('#maindocument');
}

export function setCookieConsentSeen() {
  docCookies.setItem('HT-cookie-banner-seen', 'true', expires, '/', HT.cookies_domain, true);
  cookieConsentSeen.set('true');
 if (mainContent) mainContent.inert = false;
  if (skiplinks) skiplinks.inert = false;
}
export function setTrackingAllowedCookie() {
  docCookies.setItem('HT-tracking-cookie-consent', 'true', expires, '/', HT.cookies_domain, true);
  trackingConsent.set('true');
}

export function setTrackingDisallowedCookie() {
  docCookies.setItem('HT-tracking-cookie-consent', 'false', expires, '/', HT.cookies_domain, true);
  trackingConsent.set('false');
}

export function setMarketingAllowedCookie() {
  docCookies.setItem('HT-marketing-cookie-consent', 'true', expires, '/', HT.cookies_domain, true);
  marketingConsent.set('true');
}

export function setMarketingDisallowedCookie() {
  docCookies.setItem('HT-marketing-cookie-consent', 'false', expires, '/', HT.cookies_domain, true);
  marketingConsent.set('false');
}

export function setPreferencesAllowedCookie() {
  docCookies.setItem('HT-preferences-cookie-consent', 'true', expires, '/', HT.cookies_domain, true);
  preferencesConsent.set('true');
}

export function setPreferencesDisallowedCookie() {
  docCookies.setItem('HT-preferences-cookie-consent', 'false', expires, '/', HT.cookies_domain, true);
  preferencesConsent.set('false');
}

export function setSelectedConsent() {
  const track = get(allowTracking);
  const mark = get(allowMarketing);
  const pref = get(allowPreferences);
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
  cookieConsentSeen.set('false');
  trackingConsent.set('false');
  marketingConsent.set('false');
  preferencesConsent.set('false');
}


export default docCookies;
