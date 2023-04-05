/* global ResizeObserver, requestAnimationFrame */

'use strict'

const setHeight = function (details, open = false) {
  details.open = open;
  const rect = details.getBoundingClientRect();
  details.dataset.width = rect.width;
  if (open) { details.dataset.panelHeight = details.querySelector('.panel').offsetHeight; }
  details.style.setProperty(open ? '--expanded' : '--collapsed', `${rect.height}px`);
}

const __observer = new ResizeObserver(entries => {
  return entries.forEach(entry => {
    const el = entry.target;
    if (el.nodeName === 'DETAILS') {
      const width = parseInt(el.dataset.width, 10);
      const openState = el.open;
      if (width !== el.clientWidth) {
        el.removeAttribute('style')
        setHeight(el);
        setHeight(el, true);
        el.open = el.dataset.interactive === 'false' ? true : openState;
      }
    } else if (el.nodeName === 'DIV') {
      const details = el.closest('details');
      const summary = details.querySelector('summary');

      requestAnimationFrame(() => {
        // eslint-disable-next-line no-unused-expressions
        el.clientWidth // force a reflow
        const updatedExpanded = `${el.offsetHeight + summary.offsetHeight + 45}px`;
        const expanded = details.style.getPropertyValue('--expanded');
        if (updatedExpanded !== expanded) {
          details.style.setProperty('--expanded', updatedExpanded);
        }
      })
    }
  })
})

export class Accordion {
  constructor(el) {
    this.el = el;
    this.panel = el.querySelector('.panel');
    this.initialize();
  }

  initialize() {
    if (!window.ResizeObserver) {
      // not supported; punt
      return;
    }

    // observe the element and panel to update sizes
    __observer.observe(this.el);
    __observer.observe(this.el.querySelector('.panel'));

    this.el.addEventListener('toggle', (event) => {
      this.toggle(event);
    })

    this.container = this.el.closest('[data-role="accordion"]');
    this.isOpenCoordinated = ( this.container !== undefined );

    if ( this.isOpenCoordinated ) {
      this.el.addEventListener('transitionend', (event) => {
        if (this.el.open) {
          // ignoreScrollIntoView is used when we're changing the 
          // SSR open details on page load, but don't want to adjust 
          // the scroll
          if (this.el.dataset.ignoreScrollIntoView === 'true') {
            this.el.dataset.ignoreScrollIntoView = false;
            return;
          }
          this.el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
      })
    }
  }

  toggle(event) {
    if (event.target.open) {
      const target = event.target;
      if (this.container) {
        this.container.querySelectorAll('details').forEach((el) => {
          el.open = (target === el);
        })
      }
    }
  }
}

Accordion.configure = function (selector, wrapper = document) {
  wrapper.querySelectorAll(selector).forEach((el) => {
    // eslint-disable-next-line no-new;
    new Accordion(el);
  })
}
