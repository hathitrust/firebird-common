
export class AnalyticsManager {
  constructor({ analyticsSettings, is_dev=false }) {
    if ( analyticsSettings ) {
      this.service = is_dev ? analyticsSettings.dev : analyticsSettings.service;
      this.container = analyticsSettings.container;
    }
  }

  configure() {
    if ( ! this.service ) { return ; }
    if ( ! document.body.classList.contains('apps') ) {
      // www does something else
      return;
    }

    const _mtm = window._mtm = window._mtm || [];
    const _paq = window._paq = window._paq || [];
    _mtm.push({ 'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start' });

    let customUrl;
    if ( customUrl = document.documentElement.dataset.analyticsReportUrl ) {
      // application has provided an analytics url
      _paq.push(['setCustomUrl', customUrl]);
    }

    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = `https://${this.service}/js/container_${this.container}.js`; s.parentNode.insertBefore(g, s);   
  }
}

export default AnalyticsManager;
