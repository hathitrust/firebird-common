// Import our custom CSS
import '../scss/styles.scss';
import { setupHTEnv } from './lib/utils';
import { AnalyticsManager } from './lib/analytics';
import { HotjarManager } from './lib/hotjar';

// Import all of Bootstrap's JS
// these are made available globally
import * as bootstrap from 'bootstrap';

import { writable } from 'svelte/store';

import Quote from './components/Quote.svelte';
import LoginFormModal from './components/LoginFormModal';
import LoginForm from './components/LoginFormModal/LoginForm';
import Header from './components/Header';
import ResultsPagination from './components/ResultsPagination';
import ResultsToolbar from './components/ResultsToolbar';
import CollectionsToolbar from './components/CollectionsToolbar';
import Footer from './components/Footer';
import AdvancedSearchForm from './components/AdvancedSearchForm';
import AcceptableUseBanner from './components/AcceptableUseBanner';
import FeedbackFormModal from './components/FeedbackFormModal';

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const buildProps = (el) => {
  let propProperty = `data-prop-`;
  let props = {};
  for (const attr of el.attributes) {
    if (attr.name.startsWith(propProperty)) {
      let value = attr.value;
      try {
        value = JSON.parse(value);
      } catch (error) {}

      props[toCamel(attr.name.replace(propProperty, ''))] = value;
    }
  }
  return props;
};

const apps = {};
apps['hathi-quote'] = Quote;
apps['hathi-login-form-modal'] = LoginFormModal;
apps['hathi-login-form'] = LoginForm;
apps['hathi-website-header'] = Header;
apps['hathi-results-pagination'] = ResultsPagination;
apps['hathi-results-toolbar'] = ResultsToolbar;
apps['hathi-collections-toolbar'] = CollectionsToolbar;
apps['hathi-website-footer'] = Footer;
apps['hathi-advanced-search-form'] = AdvancedSearchForm;
apps['hathi-acceptable-use-banner'] = AcceptableUseBanner;
apps['hathi-feedback-form-modal'] = FeedbackFormModal;

// configure the HT global
setupHTEnv();

// // APPROACH: look for wrapper elements, e.g. <div data-hathi-use="website-header">
// document.querySelectorAll('[data-hathi-use]').forEach((el) => {
//   let slug = el.dataset.hathiUse;
//   let props = {};
//   let component = new apps[slug]({
//     target: el,
//     props: props,
//   })
// })

// an empty login status
let emptyLoginStatus = {
  logged_in: false,
  idp_list: [],
};

HT.loginStatus = writable(emptyLoginStatus);
HT.login_status = emptyLoginStatus;

HT.postPingCallback = function (login_status) {
  // APPROACH: look for custom elements and instantiate
  // the svelte component inside that element
  HT.loginStatus.set(login_status);

  Object.keys(apps).forEach((slug) => {
    document.querySelectorAll(slug).forEach((el) => {
      if ( el.component ) { return ; }
      let props = buildProps(el);
      el.component = new apps[slug]({
        target: el,
        props: props,
      });
    });
  });
  setTimeout(() => {
    document.body.dataset.initialized = true;
  });
  (new AnalyticsManager(HT)).configure();
  (new HotjarManager(HT)).configure();
};

let script = document.createElement('script');
script.async = true;
script.src = `//${
  HT.service_domain
}/cgi/ping?callback=HT.postPingCallback&_${new Date().getTime()}`;
script.onerror = function() { 
  HT.postPingCallback(emptyLoginStatus); 
}
document.head.appendChild(script);

setTimeout(() => {
  if ( document.body.dataset.initialized == 'true' ) { return ; }
  HT.postPingCallback(emptyLoginStatus)
}, 1000);

// look for buttons that trigger the appearance of
// svelte components

document.documentElement.dataset.suportsInert = document.body.inert !== undefined;

document.querySelectorAll('[data-hathi-trigger]').forEach((el) => {
  let slug = el.dataset.hathiTrigger;
  let props = buildProps(el);
  el.component = new apps[slug]({
    target: document.body,
    props: props,
    intro: true,
  });

  el.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    el.component.show();
  });
});

let btnToggleFilters = document.querySelector('#action-toggle-filters');
if (btnToggleFilters) {
  btnToggleFilters.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let isExpanded = !(
      btnToggleFilters.getAttribute('aria-expanded') == 'true'
    );
    btnToggleFilters.setAttribute('aria-expanded', isExpanded);
  });
}

document.querySelectorAll('[data-action="expand-filter"]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let isExpanded = !(button.getAttribute('aria-expanded') == 'true');
    button.setAttribute('aria-expanded', isExpanded);
    let container = button.closest('.accordion-body');
    container.querySelector('.filter-list').dataset.expanded = isExpanded;
    if (!isExpanded) {
      container.closest('.accordion-item').scrollIntoView({ behavior: 'auto' });
    }
  });
});

const operationAlertDiv = document.querySelector('.alert-operation');
if ( operationAlertDiv ) {
  setTimeout(() => {
    HT.live.assert(operationAlertDiv.textContent.trim());
  })
}

export default apps;
