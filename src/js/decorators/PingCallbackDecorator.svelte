<script>
  import { getContext } from 'svelte';
  import { TestCookieJar } from '../lib/cookies.svelte.js';

  function fakeIdpUrl(sdrinst) {
    return `https://hathi/Login?entityID=urn:institution:${sdrinst}&target=___TARGET___`;
  }

  let {
    children,
    loggedIn = false,
    prefs = null,
    notificationData = null,
    cookieData = null,
    role,
    hasActivatedRole,
  } = $props();

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
    r: null,
  };

  HT.login_status.notificationData = notificationData || [];

  if (!loggedIn) {
    HT.login_status.idp_list = [
      { name: 'University of Moosylvania', sdrinst: 'moos', idp_url: fakeIdpUrl('moos') },
      { name: 'Moosylvania State', sdrinst: 'state', idp_url: fakeIdpUrl('state') },
      { name: 'Central Moosylvania University', sdrinst: 'central', idp_url: fakeIdpUrl('central') },
      { name: 'Eastern Moosylvania University', sdrinst: 'eastern', idp_url: fakeIdpUrl('eastern') },
    ];
  } else if (loggedIn && role) {
    HT.login_status.institutionName = 'Moosylvania State';
    HT.login_status.institutionCode = 'state';
    HT.login_status.r = { [role]: hasActivatedRole };
    if (!prefs) {
      prefs = {};
    }
    prefs.sdrinst = 'state';
  } else {
    HT.login_status.institutionName = 'Moosylvania State';
    HT.login_status.institutionCode = 'state';
    if (!prefs) {
      prefs = {};
    }
    prefs.sdrinst = 'state';
  }

  // Create the reactive state
  let loginStatusState = $state(HT.login_status);

  Object.defineProperty(HT, 'loginStatus', {
    get() {
      return loginStatusState;
    },
    set(value) {
      Object.assign(loginStatusState, value);
    },
  });

  //I think this is testing/making sure HT.login_status is set in the "store"
  //so I added the new getter/setter definiton from main.svelte.js here
  HT.loginStatus = HT.login_status;
  globalThis.HT = HT;

  $effect(() => {
    console.log('LoginStatusDecorator', loggedIn, prefs, notificationData);
  });
</script>

{@render children?.()}
