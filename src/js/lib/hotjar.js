export class HotjarManager {
  constructor({ hotjarSettings }) {
    this.enabled = false;
    if ( hotjarSettings ) {
      this.enabled = hotjarSettings.enabled;
      this.hjid = hotjarSettings.hjid;
      this.hjsv = hotjarSettings.hjsv;
    }
  }

  configure() {
    if ( ! this.enabled ) { return ; }

    const snippet = `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${this.hjid},hjsv:${this.hjsv}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    const script = document.createElement('script');
    script.innerText = snippet;
    document.head.appendChild(script);
  }
}

export default HotjarManager;
