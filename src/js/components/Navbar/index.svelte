<!-- svelte-ignore a11y-invalid-attribute -->
<script>
  import { onMount } from 'svelte';
  import menuData from '../../../assets/menuData.json';
  import LoginFormModal from '../LoginFormModal';
  import FeedbackFormModal from '../FeedbackFormModal';
  import RoleSwitchModal from '../RoleSwitchModal';
  import NotificationsModal from '../NotificationsModal';

  import NotificationsManager from '../../lib/notifications';

  let HT = window.HT || {};
  let modal;
  let feedbackModal;
  let roleSwitchModal;
  let location = document.documentElement.dataset.app;
  let form = 'basic';

  let notificationsModal;
  let notificationsManager = new NotificationsManager({
    cookieJar: HT.cookieJar,
  });

  // export let loggedIn = $loginStatus.logged_in;
  export let hasNotification = false;
  export let searchOpen = true;
  export let searchState;
  export let compact = false;
  export let userNavigation = true;

  const switchableRoles = ['enhancedTextProxy', 'totalAccess', 'resourceSharing'];
  const switchableRolesLabels = {};
  switchableRolesLabels['enhancedTextProxy'] = 'Accessible Text Request Service';
  switchableRolesLabels['totalAccess'] = 'Collection Administration Access';
  switchableRolesLabels['resourceSharing'] = 'Resource Sharing';

  function toggleSearch() {
    searchOpen = !searchOpen;
    console.log('AHOY searchOpen', searchOpen);
  }

  function openLogin() {
    //check viewport size to see if LoginFormModal will fit
    if (window.innerHeight <= 670 || $loginStatus.idp_list.length == 0) {
      //if not, redirect user
      //calculate login target
      let target = window.location.href;
      if (target.indexOf('babel.hathitrust') < 0) {
        // not a babel app, need to route through ping/pong
        target = HT.get_pong_target(target);
      }
      window.location.assign(`//${HT.service_domain}/cgi/wayf?target=${encodeURIComponent(target)}`);
    } else {
      //else, open LoginFormModal
      modal.show();
    }
  }

  function openFeedback(formLocation) {
    if (document.activeElement !== document.getElementById('get-help')) document.getElementById('get-help').focus();
    if (formLocation === 'catalog') {
      form = 'catalog';
    } else if (formLocation === 'pt') {
      form = 'content';
    } else if (formLocation === 'questions') {
      form = 'basic';
    } else {
      form = 'basic';
    }
    feedbackModal.show();
  }

  function checkSwitchableRoles(isLoggedIn) {
    if ($loginStatus.r) {
      for (const i in switchableRoles) {
        let role = switchableRoles[i];
        if ($loginStatus.r.hasOwnProperty(role)) {
          return {
            status: true,
            label: switchableRolesLabels[role],
            activated: $loginStatus.r[role],
          };
        }
      }
    }
    return { status: false };
  }

  $: loginStatus = HT.loginStatus;
  $: loggedIn = $loginStatus.logged_in;
  $: hasSwitchableRoles = checkSwitchableRoles(loggedIn).status;
  $: hasActivatedRole = checkSwitchableRoles(loggedIn).activated;
  $: role = checkSwitchableRoles(loggedIn).label;
  $: if ($loginStatus && $loginStatus.notificationData) {
    notificationsManager.update($loginStatus.notificationData);
    hasNotification = notificationsManager.hasNotifications();
  }
</script>

<FeedbackFormModal {form} bind:this={feedbackModal} />
{#if hasSwitchableRoles}
  <RoleSwitchModal bind:this={roleSwitchModal} />
{/if}
<nav class="navbar navbar-expand-xl bg-white">
  <div class="container-fluid">
    <div class="ht-logo" class:compact>
      <!-- <img src="../assets/HT-logo-mobile-nav.svg" alt="HathiTrust" class="" /> -->
      <a href="//{HT.www_domain}/" class="d-block">
        <svg
          aria-labelledby="ht-logo-title"
          role="img"
          width="180"
          height="47"
          viewBox="0 0 180 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="ht-logo-title">HathiTrust Home</title>
          <g clip-path="url(#clip0_410_7968)">
            <path
              d="M0 27.8623V26.4217H3.075V11.2123H0V9.7998H8.11875V11.2123H5.40313V17.8623H14.1844V11.2123H11.4969V9.7998H19.6156V11.2123H16.5406V26.4217H19.6156V27.8623H11.4969V26.4217H14.1844V19.1623H5.40313V26.4217H8.11875V27.8623H0V27.8623Z"
              fill="#242828"
            />
            <path
              d="M24.547 28.0562C23.4188 28.0562 22.5438 27.7625 21.9157 27.1688C21.2876 26.5781 20.9751 25.7938 20.9751 24.8125C20.9751 23.925 21.2626 23.1875 21.8345 22.5969C22.297 22.1344 22.872 21.7844 23.5657 21.5438C24.2595 21.3031 25.2595 21.0812 26.572 20.8781C27.4595 20.7312 28.0063 20.6156 28.2188 20.5312C28.4313 20.4469 28.5376 20.2969 28.5376 20.075V18.8562C28.5376 17.9687 28.3251 17.3312 27.9001 16.9437C27.4751 16.5562 26.8282 16.3625 25.9595 16.3625C24.9626 16.3625 24.1688 16.6031 23.5782 17.0844C24.0782 17.3437 24.3251 17.7687 24.3251 18.3594C24.3251 18.7656 24.197 19.1031 23.9376 19.3719C23.6782 19.6406 23.3282 19.775 22.8845 19.775C22.4407 19.775 22.0845 19.6375 21.8188 19.3594C21.5501 19.0812 21.4157 18.7219 21.4157 18.2781C21.4157 17.3906 21.9001 16.6562 22.8688 16.075C23.8376 15.4937 24.9876 15.2031 26.3188 15.2031C29.2376 15.2031 30.697 16.45 30.697 18.9437V25.4531C30.697 25.8594 30.7626 26.1469 30.8907 26.3125C31.0188 26.4781 31.2313 26.5625 31.5282 26.5625C31.9532 26.5625 32.322 26.1937 32.6376 25.4531L33.4688 25.925C33.1376 26.6469 32.7751 27.1719 32.3876 27.5031C32.0001 27.8344 31.5001 28.0031 30.8907 28.0031C30.2813 28.0031 29.7813 27.8125 29.3938 27.4344C29.0063 27.0562 28.8032 26.4781 28.7845 25.7031H28.7001C28.2751 26.4062 27.6876 26.9719 26.9407 27.4062C26.1938 27.8406 25.3938 28.0562 24.5438 28.0562H24.547ZM25.4876 26.5875C26.2438 26.5875 26.9407 26.3188 27.5782 25.7844C28.2157 25.25 28.5345 24.6312 28.5345 23.9281V21.4625C28.3313 21.5375 27.8782 21.6281 27.1782 21.7406C25.7376 21.9625 24.7345 22.2625 24.172 22.6406C23.6095 23.0187 23.3282 23.6156 23.3282 24.4281C23.3282 25.8687 24.0501 26.5875 25.4907 26.5875H25.4876Z"
              fill="#242828"
            />
            <path
              d="M35.3219 12.1531L37.4813 11.875V15.4781H41.5531V16.8344H37.4813V24.675C37.4813 25.9687 37.9969 26.6156 39.0313 26.6156C39.9 26.6156 40.5906 25.8781 41.1094 24.4L42.1063 24.7875C41.4781 27.0031 40.2687 28.1125 38.4781 28.1125C37.4437 28.1125 36.6594 27.8188 36.1219 27.225C35.5875 26.6344 35.3187 25.8031 35.3187 24.7312V16.8344H32.7969V15.4781H35.3187V12.1531H35.3219Z"
              fill="#242828"
            />
            <path
              d="M43.2471 27.8625V26.4219H45.3252V10.325H43.2471V8.82812H47.4846V18.5531C48.7596 16.3188 50.3096 15.2 52.1377 15.2C53.2096 15.2 54.0408 15.5406 54.6314 16.225C55.2221 16.9094 55.5189 17.8781 55.5189 19.1344V26.4219H57.5971V27.8625H51.4752V26.4219H53.3877V20.1062C53.3877 18.8687 53.1471 18.0094 52.6658 17.5313C52.2971 17.1438 51.7689 16.95 51.0877 16.95C50.1814 16.95 49.3564 17.3688 48.6064 18.2094C47.8596 19.05 47.4846 19.9781 47.4846 20.9938V26.425H49.3689V27.8656H43.2471V27.8625Z"
              fill="#242828"
            />
            <path
              d="M59.0373 27.8626V26.422H61.3904V16.8345H59.0373V15.3938H63.5248V26.4188H65.8779V27.8595H59.0342L59.0373 27.8626ZM62.3061 12.5688C61.8436 12.5688 61.4654 12.4313 61.1717 12.1532C60.8748 11.8751 60.7279 11.497 60.7279 11.0188C60.7279 10.5407 60.8748 10.1751 61.1717 9.86885C61.4654 9.56572 61.8467 9.4126 62.3061 9.4126C62.7654 9.4126 63.1123 9.55947 63.3998 9.85635C63.6873 10.1532 63.8279 10.5313 63.8279 10.9938C63.8279 11.4563 63.6842 11.8345 63.3998 12.1282C63.1123 12.4251 62.7498 12.572 62.3061 12.572V12.5688Z"
              fill="#242828"
            />
            <path
              d="M70.5344 27.8623V26.4217H73.7187V11.0998H71.2531C70.2375 11.0998 69.5531 11.3811 69.2031 11.9436C68.8531 12.5061 68.4281 13.8779 67.9281 16.0561H66.875V9.7998H82.8875V16.0623H81.8344C81.3344 13.8842 80.9094 12.5123 80.5594 11.9498C80.2094 11.3873 79.5156 11.1061 78.4812 11.1061H76.0437V26.4279H79.2281V27.8686H70.5281L70.5344 27.8623Z"
              fill="#242828"
            />
            <path
              d="M84.4688 27.8624V26.4218H86.5469V16.8343H84.4688V15.3937H88.6531V18.3312C89.0406 17.3155 89.575 16.5437 90.2594 16.0187C90.9437 15.4937 91.6625 15.228 92.4219 15.228C93.0312 15.228 93.5188 15.4124 93.8906 15.7812C94.2594 16.1499 94.4437 16.603 94.4437 17.1374C94.4437 17.5812 94.3 17.9593 94.0156 18.2718C93.7281 18.5874 93.3719 18.7437 92.95 18.7437C92.5281 18.7437 92.1687 18.6093 91.8844 18.3405C91.5969 18.0718 91.4563 17.728 91.4563 17.303C91.4563 17.0999 91.4938 16.9249 91.5656 16.778C90.9375 16.7218 90.3563 17.003 89.8188 17.6218C89.2844 18.2405 88.9125 18.928 88.7094 19.6843V26.4155H91.1469V27.8562H84.4688V27.8624Z"
              fill="#242828"
            />
            <path
              d="M101.203 28.0844C100.15 28.0844 99.3344 27.7437 98.75 27.0594C98.1688 26.375 97.8781 25.3969 97.8781 24.1219V16.8344H95.8281V15.3937H100.013V23.15C100.013 24.425 100.253 25.2938 100.734 25.7531C101.047 26.1219 101.556 26.3063 102.259 26.3063C103.166 26.3063 103.987 25.8875 104.725 25.0469C105.462 24.2063 105.834 23.2875 105.834 22.2906V16.8313H103.7V15.3906H107.994V26.4156H110.044V27.8562H105.887V24.6719C104.556 26.9437 102.997 28.0781 101.206 28.0781L101.203 28.0844Z"
              fill="#242828"
            />
            <path
              d="M111.841 28.1126V23.4032H113.116C113.447 24.5126 113.975 25.3845 114.694 26.022C115.413 26.6595 116.263 26.9782 117.244 26.9782C118 26.9782 118.597 26.8032 119.031 26.4532C119.466 26.1032 119.681 25.6313 119.681 25.0407C119.681 24.4501 119.438 23.9501 118.947 23.6001C118.456 23.2501 117.575 22.897 116.3 22.547C114.766 22.122 113.678 21.6251 113.031 21.0501C112.385 20.4782 112.063 19.722 112.063 18.7782C112.063 17.8345 112.453 16.9532 113.241 16.2438C114.025 15.5345 115.028 15.1782 116.247 15.1782C117.763 15.1782 118.841 15.6782 119.488 16.6751L119.791 15.1782H121.01V19.4438H119.791C119.328 18.3532 118.841 17.5595 118.322 17.0626C117.806 16.5626 117.103 16.3157 116.216 16.3157C115.606 16.3157 115.085 16.4782 114.65 16.8001C114.216 17.1251 114 17.5626 114 18.1157C114 18.6688 114.253 19.1532 114.763 19.5157C115.272 19.8751 116.106 20.222 117.269 20.5532C118.838 20.9782 119.947 21.4595 120.594 21.9938C121.241 22.5313 121.563 23.3063 121.563 24.322C121.563 25.3376 121.16 26.2001 120.356 26.9688C119.553 27.7345 118.513 28.1188 117.241 28.1188C115.578 28.1188 114.285 27.5376 113.363 26.372L113.06 28.1188H111.841V28.1126Z"
              fill="#242828"
            />
            <path
              d="M125.306 12.1531L127.466 11.875V15.4781H131.538V16.8344H127.466V24.675C127.466 25.9687 127.981 26.6156 129.016 26.6156C129.884 26.6156 130.575 25.8781 131.094 24.4L132.091 24.7875C131.463 27.0031 130.253 28.1125 128.463 28.1125C127.428 28.1125 126.644 27.8188 126.106 27.225C125.572 26.6344 125.303 25.8031 125.303 24.7312V16.8344H122.781V15.4781H125.303V12.1531H125.306Z"
              fill="#242828"
            />
            <path
              d="M171.95 3.49043L171.591 3.04043L171.016 3.06855C170.944 3.07168 163.934 3.37481 161.116 0.556055L160.562 0.00292969L150.9 4.45606C146.338 6.55918 143.391 11.1623 143.391 16.1873V31.0623C143.313 31.0623 143.234 31.0654 143.159 31.0654C141.594 31.0654 140.075 30.7592 138.644 30.1529L137.609 29.7154L136.734 31.7811L137.769 32.2186C139.475 32.9404 141.288 33.3061 143.156 33.3061C143.234 33.3061 143.313 33.3061 143.388 33.3029V40.7186C143.388 43.9404 145.938 46.6061 149.072 46.6623C149.109 46.6623 149.144 46.6623 149.181 46.6623C150.709 46.6623 152.144 46.0748 153.237 45.0029C154.356 43.9061 154.972 42.4373 154.972 40.8717H152.728C152.728 41.8311 152.35 42.7311 151.666 43.4029C150.981 44.0748 150.078 44.4342 149.113 44.4186C147.194 44.3842 145.631 42.7217 145.631 40.7154V33.0811C147.006 32.8311 148.322 32.3779 149.547 31.7436C148.581 34.2623 148.081 36.9186 148.081 39.6373V40.8842H150.325V39.6373C150.325 35.3592 151.628 31.3873 154.203 27.8029C154.284 27.6967 154.362 27.5873 154.441 27.4811C154.791 27.0092 155.163 26.5467 155.556 26.0904C157.688 23.6248 159.85 22.1248 160.6 21.6404C161.625 22.3561 162.903 22.9654 164.491 23.2936L165.225 23.4436L165.647 22.8248C165.663 22.8029 167.219 20.5248 169.541 18.2561C171.6 16.2436 174.703 13.8186 177.781 13.7061L179.997 13.6248L171.947 3.4873L171.95 3.49043ZM164.25 20.9248C160.284 19.7654 159.094 16.3404 159.044 16.1936L156.909 16.8873C156.947 17.0029 157.466 18.5342 158.869 20.1029C157.781 20.8529 155.853 22.3342 153.916 24.5623C153.441 25.1092 152.994 25.6686 152.572 26.2404C150.881 28.5873 148.406 30.1936 145.634 30.7967V16.1842C145.634 12.0342 148.069 8.22793 151.841 6.49043L160.128 2.66855C163.281 5.16543 168.734 5.33731 170.537 5.31856L175.662 11.7748C170.325 13.1936 165.694 18.9623 164.247 20.9217L164.25 20.9248Z"
              fill="#EC7217"
            />
            <path d="M151.984 14.8467H149.741V17.3998H151.984V14.8467Z" fill="#EC7217" />
          </g>
          <defs>
            <clipPath id="clip0_410_7968">
              <rect width="180" height="46.6656" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
    </div>
    <div class=" d-flex d-xl-none mobile-collapse-buttons">
      <button
        class="navbar-toggler border-0 m-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span><i class:hasNotification class="fa-solid fa-bars fa-fw" /></span>
      </button>
      {#if searchState != 'none'}
        <button
          class="navbar-toggler border-0 m-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteSearchDropdown"
          aria-controls="siteSearchDropdown"
          aria-expanded="true"
          aria-label="Toggle search bar"
          on:click|stopPropagation={toggleSearch}
        >
          <span><i class="fa-solid fa-magnifying-glass fa-fw" /></span>
        </button>
      {/if}
    </div>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <div class="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
      <ul class="navbar-nav menu-links">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex flex-row justify-content-between align-items-center"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>About</span>
            <!-- <i class="fa-solid fa-caret-down" /> -->
          </a>
          <div>
            <ul class="dropdown-menu">
              <div class="d-flex flex-column gap-4">
                {#each menuData.about as menuItem}
                  <li class="px-3">
                    <a class="dropdown-item px-0" href="//{HT.www_domain}/{menuItem.link}">{menuItem.title}</a>
                  </li>
                {/each}
              </div>
            </ul>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex flex-row justify-content-between align-items-center"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>The Collection</span>
            <!-- <i
              class="fa-solid {dropdownOpen.collection
                ? 'fa-caret-down open'
                : 'fa-caret-down'}"
            /> -->
          </a>
          <ul class="dropdown-menu">
            <div class="d-flex flex-column gap-4">
              {#each menuData.collection as menuItem}
                <li class="px-3">
                  {#if menuItem.title === 'Featured Collections'}
                    <a class="dropdown-item px-0" href="//{HT.service_domain}/cgi/mb?colltype=featured"
                      >{menuItem.title}</a
                    >
                  {:else}
                    <a class="dropdown-item px-0" href="//{HT.www_domain}/{menuItem.link}">{menuItem.title}</a>
                  {/if}
                </li>
              {/each}
            </div>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex flex-row justify-content-between align-items-center"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>Member Libraries</span>
            <!-- <i
              class="fa-solid {dropdownOpen.libraries
                ? 'fa-caret-down open'
                : 'fa-caret-down'}"
            /> -->
          </a>
          <ul class="dropdown-menu">
            <div class="d-flex flex-column gap-4">
              {#each menuData.memberLibraries as menuItem}
                <li class="px-3">
                  <a class="dropdown-item px-0" href="//{HT.www_domain}/{menuItem.link}">{menuItem.title}</a>
                </li>
              {/each}
            </div>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="//{HT.www_domain}/join/">Join</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle d-flex flex-row justify-content-between align-items-center"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span>News &amp; Events</span>
            <!-- <i
              class="fa-solid {dropdownOpen.news
                ? 'fa-caret-down open'
                : 'fa-caret-down'}"
            />-->
          </a>
          <ul class="dropdown-menu">
            <div class="d-flex flex-column gap-4">
              {#each menuData.newsEvents as menuItem}
                <li class="px-3">
                  <a class="dropdown-item px-0" href="//{HT.www_domain}/{menuItem.link}">{menuItem.title}</a>
                </li>
              {/each}
            </div>
          </ul>
        </li>
      </ul>
      <ul class="navbar-nav action-links">
        {#if searchState != 'none'}
          <li class="nav-item d-none d-xl-block">
            <a
              class="nav-link text-uppercase d-flex flex-row justify-content-between align-items-center"
              class:search-active={searchOpen}
              href="#"
              role="button"
              aria-expanded={searchOpen}
              on:click|preventDefault|stopPropagation={toggleSearch}
              >Search <i class="fa-solid fa-magnifying-glass fa-fw" /></a
            >
          </li>
        {/if}
        <li class="nav-item dropdown">
          <a
            href="#"
            role="button"
            id="get-help"
            aria-expanded="false"
            class="nav-link dropdown-toggle text-uppercase d-flex flex-row justify-content-between align-items-center gap-2"
            data-bs-toggle="dropdown"
            ><span>Get Help</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end p-0">
            <div class="d-flex flex-column gap-1 p-2">
              <li>
                <a
                  href="https://hathitrust.atlassian.net/servicedesk/customer/portals"
                  class="dropdown-item d-flex flex-row align-items-center gap-2"
                >
                  <i class="fa-solid fa-square-arrow-up-right fa-fw text-neutral-500" aria-hidden="true" /><span
                    >Find Help</span
                  >
                </a>
              </li>
              <li>
                <a
                  href="#"
                  id="ask-a-question"
                  class="dropdown-item d-flex flex-row align-items-center gap-2"
                  on:click|preventDefault={() => openFeedback('questions')}
                >
                  <i class="fa-solid fa-circle-question fa-fw text-neutral-500" aria-hidden="true" /><span
                    >Ask a Question</span
                  >
                </a>
              </li>
              <li>
                <a
                  href="#"
                  id="report-a-problem"
                  class="dropdown-item d-flex flex-row align-items-center gap-2"
                  on:click|preventDefault={() => openFeedback(location)}
                >
                  <i class="fa-solid fa-bug fa-fw text-neutral-500" aria-hidden="true" /><span>Report a Problem</span>
                </a>
              </li>
            </div>
          </ul>
        </li>
        {#if userNavigation}
          {#if loggedIn}
            <li id="my-account" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-flex flex-row justify-content-between align-items-center text-black-hover text-black-focus"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-labelledby="my-account-label role-heading role-active"
              >
                <div class="d-flex justify-content-center align-items-center">
                  <span
                    class:accountHasNotification={hasNotification}
                    class="account-icon me-n1 d-flex align-items-center justify-content-center border border-neutral-300 rounded-circle bg-neutral-100"
                  >
                    {#if hasActivatedRole}
                      <i class="fa-solid fa-user-plus text-primary-600" />
                    {:else}
                      <i class="fa-solid fa-user text-neutral-800" />
                    {/if}
                  </span>
                  <span id="my-account-label"
                    ><span class="ms-3 d-xl-none">My Account</span><span class="visually-hidden d-none d-xl-block"
                      >My Account</span
                    ></span
                  >
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-0" class:accountDropdown={!hasSwitchableRoles}>
                <div class="d-flex flex-column">
                  {#if hasSwitchableRoles}
                    <li class="d-flex p-3 current-role align-items-center border-bottom border-neutral-300">
                      <span
                        class="account-icon d-flex align-items-center justify-content-center border border-neutral-300 rounded-circle bg-neutral-100"
                      >
                        {#if hasActivatedRole}
                          <i class="fa-solid fa-user-plus text-primary-600" aria-hidden="true" />
                        {:else}
                          <i class="fa-solid fa-user text-neutral-800" aria-hidden="true" />
                        {/if}
                      </span>
                      <div class="role d-flex flex-column align-items-start">
                        <span id="role-heading" class="role-heading"> Current Role </span>
                        <span id="role-active" class="role-active">{hasActivatedRole ? role : 'Member'}</span>
                      </div>
                    </li>
                  {/if}
                  <div class="d-flex flex-column p-2 gap-1 border-bottom border-neutral-300">
                    <li>
                      <button
                        class="dropdown-item d-flex flex-row gap-2 align-items-center"
                        data-disabled={!hasNotification}
                        disabled={!hasNotification ? true : null}
                        on:click={notificationsModal.show()}
                        ><i
                          class="fa-solid fa-bell fa-fw"
                          aria-hidden="true"
                          class:opacity-25={!hasNotification}
                        /><span class="needs-hover-state"
                          >Notifications {#if hasNotification}({notificationsManager.count()}){/if}</span
                        >
                      </button>
                    </li>
                    <li>
                      <a
                        class="dropdown-item d-flex flex-row gap-2 align-items-center"
                        href="//{`${HT.service_domain}/cgi/mb?a=listcs&colltype=my-collections`}"
                        role="button"
                        ><i class="fa-solid fa-list fa-fw" aria-hidden="true" /><span class="needs-hover-state"
                          >My Collections</span
                        ></a
                      >
                    </li>
                  </div>
                  <div class="p-2 gap-1 d-flex flex-column">
                    {#if hasSwitchableRoles}
                      <li>
                        <a
                          class="dropdown-item d-flex flex-row gap-2 align-items-center switch-roles"
                          href="#"
                          role="button"
                          id="switch"
                          on:click={roleSwitchModal.show()}
                          ><i class="fa-solid fa-user-group fa-fw" aria-hidden="true" /><span class="needs-hover-state">
                            Switch Role
                          </span></a
                        >
                      </li>
                    {/if}
                    <li>
                      <a
                        class="dropdown-item d-flex flex-row gap-2 align-items-center"
                        href="//{`${HT.service_domain}/cgi/logout?${encodeURIComponent(window.location.href)}`}"
                        role="button"
                        ><i class="fa-solid fa-arrow-right-from-bracket fa-fw" aria-hidden="true" /><span
                          class="needs-hover-state">Log Out</span
                        ></a
                      >
                    </li>
                  </div>
                </div>
              </ul>
            </li>
          {:else}
            <LoginFormModal bind:this={modal} />
            <li class="nav-item">
              <a
                id="log-in"
                class="nav-link text-uppercase d-flex align-items-center gap-2"
                href="#"
                role="button"
                data-testid="login-button"
                on:click|preventDefault={openLogin}><i class="fa-solid fa-user fa-fw" aria-hidden="true" /> Log In</a
              >
            </li>
          {/if}
        {/if}
      </ul>
    </div>
  </div>
</nav>
{#if hasNotification}
  <NotificationsModal manager={notificationsManager} bind:this={notificationsModal} />
{/if}

<style lang="scss">
  .container-fluid {
    padding: 0;
  }
  .navbar {
    --bs-navbar-padding-y: 0;
    --bs-navbar-padding-x: 0;
    --bs-navbar-color: var(--color-neutral-800);
    --bs-navbar-brand-color: var(--color-neutral-800);

    --bs-navbar-active-color: var(--color-primary-600);
    --bs-navbar-toggler-padding-y: 3px;
    --bs-navbar-toggler-padding-x: 3px;
    --bs-navbar-toggler-focus-width: 3px;
  }
  .navbar-nav {
    font-size: var(--ht-text-sm);
    --bs-nav-link-color: var(--color-neutral-900);
    --bs-nav-link-hover-color: var(--color-primary-600);
    --bs-nav-link-font-weight: var(--headings-font-weight);
    --bs-nav-link-padding-x: 16px;
    --bs-nav-link-padding-y: 16px;
    @media (min-width: 1200px) {
      --bs-nav-link-padding-x: 0;
      --bs-nav-link-padding-y: 0;
      --bs-navbar-nav-link-padding-x: 0;
      --bs-navbar-nav-link-padding-y: 0;
      gap: 24px;
    }
  }
  .navbar .ht-logo,
  .navbar .mobile-collapse-buttons {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .navbar .ht-logo {
    padding-left: 1rem;

    &.compact {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    @media (min-width: 1200px) {
      padding-right: 2.5rem;
    }
  }
  .navbar .mobile-collapse-buttons {
    padding-right: 1rem;
    gap: 1.5rem;
  }
  .navbar-nav.menu-links .nav-item a {
    @media (min-width: 1200px) {
      gap: 0.5rem;
    }
  }
  .navbar-nav.action-links {
    @media (min-width: 1200px) {
      padding-right: 1rem;
      align-items: center;
    }
    .nav-item {
      background: var(--color-neutral-50);
      border-top: solid 1px var(--color-neutral-200);
      @media (min-width: 1200px) {
        background: white;
        border-top: none;
      }
      #log-in {
        flex-direction: row;
        @media (min-width: 1200px) {
          flex-direction: row-reverse;
        }
      }

      a {
        @media (min-width: 1200px) {
          gap: 0.75rem;
        }
      }
      ul.dropdown-menu {
        background: var(--color-shades-0);
        a:hover,
        a:active {
          background: var(--color-shades-0);
        }
      }
    }
    .nav-item:last-of-type {
      border-bottom: solid 1px var(--color-neutral-200);
      border-radius: 0 0 8px 8px;
      @media (min-width: 1200px) {
        border-bottom: none;
        border-radius: 0;
      }
    }
    a.nav-link {
      font-weight: 800;
      &.search-active {
        color: var(--color-primary-600);
      }
    }
    a:hover {
      text-decoration: none;
    }
    i {
      color: var(--color-primary-600);
    }
    #my-account ul.dropdown-menu li:not(.current-role) i {
      color: var(--color-neutral-500);
    }
    .needs-hover-state:hover {
      text-decoration: underline;
    }
  }
  .nav-link {
    &:hover,
    &:focus {
      color: var(--color-primary-600);
    }
  }
  .current-role {
    gap: 0.75rem;
  }
  .role-heading {
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.125rem;
    letter-spacing: -0.0075rem;
  }
  .role-active {
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.3125rem;
    letter-spacing: -0.01rem;
  }
  .account-icon {
    min-width: 2.5rem;
    height: 2.5rem;
  }
  .role {
    gap: 0.125rem;
  }
  #my-account a.nav-link div {
    text-decoration: none;
  }
  #my-account a.switch-roles {
    max-width: 13rem;
    white-space: pre-wrap;
  }
  .hasNotification {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      background: var(--color-primary-600);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: -2.5px;
      left: 17px;
    }
  }
  .accountHasNotification {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      background: var(--color-primary-600);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      top: -1.5px;
      left: 27px;
    }
  }
  .dropdown-toggle::after {
    font-size: 1.1em;
  }

  @media (min-width: 1200px) {
    #my-account .dropdown-menu {
      width: 14rem;
    }
    #my-account ul.accountDropdown {
      width: 11rem;
    }
  }
  .dropdown-menu {
    --bs-dropdown-padding-y: 1rem;
    --bs-dropdown-font-size: var(--ht-text-sm);
    --bs-dropdown-color: var(--color-neutral-800);
    --bs-dropdown-bg: var(--color-neutral-50);
    --bs-dropdown-border-radius: 0;
    --bs-dropdown-border-width: 0;
    --bs-dropdown-border-color: transparent;
    --bs-dropdown-box-shadow: none;
    --bs-dropdown-item-padding-y: 0.5rem;
    --bs-dropdown-item-padding-x: 0.5rem;
    --bs-dropdown-link-color: var(--color-neutral-800);
    --bs-dropdown-link-hover-color: var(--color-netural-800);
    --bs-dropdown-link-hover-bg: var(--color-neutral-50);

    div {
      @media (min-width: 1200px) {
        padding-top: 0;
      }
    }
    a {
      line-height: 1.125rem;
      letter-spacing: -0.00875rem;
      &:hover {
        text-decoration: underline;
      }
    }
    a.dropdown-item span {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    a.dropdown-item:active,
    button.dropdown-item:active {
      color: var(--color-netural-800);
      background-color: var(--color-neutral-50);
      span {
        text-decoration: underline;
      }
      @media (min-width: 1200px) {
        background-color: var(--color-shades-0);
      }
    }
    button.dropdown-item:focus-visible {
      border-radius: 6px;
      position: relative;
    }

    @media (min-width: 1200px) {
      --bs-dropdown-padding-y: 1.5rem;
      --bs-dropdown-item-padding-y: 0.5rem;
      --bs-dropdown-item-padding-x: 0.5rem;
      --bs-dropdown-bg: #fff;
      --bs-dropdown-border-radius: 8px;
      --bs-dropdown-border-width: 1px;
      --bs-dropdown-border-color: var(--color-neutral-300);
      --bs-dropdown-box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.1);
      --bs-dropdown-link-hover-bg: #fff;
      margin-top: 1rem;

      a.dropdown-item {
        display: inline;
      }
    }
    &.dropdown-menu-end {
      padding-top: 0;
      @media (min-width: 1200px) {
        padding-top: 1.5rem;
      }
    }
  }
</style>
