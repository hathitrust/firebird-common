import { trackingConsent } from './store'
export class AnalyticsManager {
  constructor({ analyticsSettings, is_dev = false }) {
    if (analyticsSettings) {
      this.service = is_dev ? analyticsSettings.dev : analyticsSettings.service;
      this.container = analyticsSettings.container;
    }
  }

  configure(addMatomoScript = this.addMatomoScript) {
    if (!this.service) {
      return;
    }
    if (!document.body.classList.contains('apps')) {
      // www does something else
      return;
    }

    const _mtm = (window._mtm = window._mtm || []);
    const _paq = (window._paq = window._paq || []);

    trackingConsent.subscribe((value) => {
      if (value !== 'true') {
        _paq.push(['requireCookieConsent']);
        } else {
        _paq.push(['setCookieConsentGiven']);
      }
    })

    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    let customUrl;
    if ((customUrl = document.documentElement.dataset.analyticsReportUrl)) {
      // application has provided an analytics url
      _paq.push(['setCustomUrl', customUrl]);
    }

    let customPageTitle;
    if ((customPageTitle = document.documentElement.dataset.originalTitle)) {
      // pt has provided an original title
      _paq.push(['setDocumentTitle', customPageTitle]);
    }
    addMatomoScript()
    
  }

  //need the arrow function syntax for 'this' to be defined
  addMatomoScript = () => {
      var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = `https://${this.service}/js/container_${this.container}.js`;
      s.parentNode.insertBefore(g, s);
    }
}


export default AnalyticsManager;
