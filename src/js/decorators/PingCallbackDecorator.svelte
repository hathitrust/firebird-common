<script>
  import { writable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { TestCookieJar } from '../lib/cookies';

  function fakeIdpUrl(sdrinst) {
    return `https://hathi/Login?entityID=urn:institution:${sdrinst}&target=___TARGET___`;
  }

  export let loggedIn = false;
  export let prefs = null;
  export let notificationData = null;
  export let cookieData = null;

  const HT = {};
  HT.get_pong_target = function (href) {
    return href;
  };
  HT.login_status = {};
  HT.login_status.logged_in = false;
  HT.prefs = {
    set: function () {},
    get: function () {
      console.log('WUT IS HAPPENING', prefs);
      return prefs || {};
    },
  };

  HT.cookieJar = new TestCookieJar(cookieData);

  HT.login_status = {
    logged_in: loggedIn,
    idp_list: [],
  };

  HT.login_status.notificationData = notificationData || [];

  if (!loggedIn) {
    HT.login_status.idp_list = [
      { name: 'University of Moosylvania', sdrinst: 'moos', idp_url: fakeIdpUrl('moos') },
      { name: 'Moosylvania State', sdrinst: 'state', idp_url: fakeIdpUrl('state') },
      { name: 'Central Moosylvania University', sdrinst: 'central', idp_url: fakeIdpUrl('central') },
      { name: 'Eastern Moosylvania University', sdrinst: 'eastern', idp_url: fakeIdpUrl('eastern') },
    ];
  } else {
    HT.login_status.institutionName = 'Moosylvania State';
    HT.login_status.institutionCode = 'state';
    if (!prefs) {
      prefs = {};
    }
    prefs.sdrinst = 'state';
  }

  // HT.cookieJar = new CookieJar();
  HT.loginStatus = writable(HT.login_status);
  globalThis.HT = HT;

  $: console.log('LoginStatusDecorator', loggedIn, prefs, notificationData);
</script>

<slot />
