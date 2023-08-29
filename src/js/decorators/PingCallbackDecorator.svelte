<script>
  import { writable } from 'svelte/store';
  import { getContext } from 'svelte';

  function fakeIdpUrl(sdrinst) {
    return `https://hathi/Login?entityID=urn:institution:${sdrinst}&target=___TARGET___`;
  }

  class CookieJar {
    constructor() {
      this.data = {};
    }

    getItem(key) {
      return this.data[key];
    }

    setItem(key, value) {
      this.data[key] = value;
    }
  }

  export let loggedIn = false;
  export let prefs = null;
  export let notificationData = null;

  globalThis.HT = {};
  globalThis.HT.get_pong_target = function(href ) { return href; }
  globalThis.HT.login_status = {};
  globalThis.HT.login_status.logged_in = false;
  globalThis.HT.prefs = { 
    set: function() {},
    get: function() { 
      console.log("WUT IS HAPPENING", prefs);
      return prefs || {};
    }
  };

  globalThis.HT.login_status = {
    logged_in: loggedIn,
    idp_list: [],
  };

  globalThis.HT.login_status.notificationData = notificationData || [];

  if ( ! globalThis.HT.login_status.logged_in ) {

    globalThis.HT.login_status.idp_list = [
      { name: 'University of Moosylvania', sdrinst: 'moos', idp_url: fakeIdpUrl('moos') },
      { name: 'Moosylvania State', sdrinst: 'state', idp_url: fakeIdpUrl('state') },
      { name: 'Central Moosylvania University', sdrinst: 'central', idp_url: fakeIdpUrl('central') },
      { name: 'Eastern Moosylvania University', sdrinst: 'eastern', idp_url: fakeIdpUrl('eastern') },
    ]

  } else {
    globalThis.HT.login_status.institutionName = 'Moosylvania State';
  }

  // globalThis.HT.cookieJar = new CookieJar();
  HT.loginStatus = writable(HT.login_status);

  $: console.log("LoginStatusDecorator", loggedIn, prefs, notificationData);
</script>

<slot></slot>
