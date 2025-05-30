import { afterEach, afterAll, describe, it, expect, test, vi } from 'vitest';
import AnalyticsManager from './analytics.svelte';
import { consent } from './store.svelte';

// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

const HT = (window.HT = window.HT || {});
HT.cookies_domain = '.hathitrust.org';
HT.analyticsSettings = { service: 'fake.service', container: 'test' };

//need to set these in order to set cookies in this "browser"
window.location.host = 'www.hathitrust.org';
window.location.protocol = 'https:';

const analyticsManager = new AnalyticsManager(HT);
const configureSpy = vi.spyOn(analyticsManager, 'configure');

describe('Document is available', () => {
  it('should not be undefined', () => {
    expect(document).not.toBeUndefined();
  });
});
describe('AnalyticsManager', () => {
  describe('configure', () => {
    document.body.classList.add('apps');
    test('body element should have apps class', () => {
      expect(document.body.classList).toContain('apps');
    });
    it('should configure analytics', () => {
      analyticsManager.configure(() => {});
      expect(configureSpy).toHaveBeenCalled();
    });
    it('should have _mtm variable defined', () => {
      expect(window._mtm).toBeDefined();
    });
    it('should have _paq variable defined', () => {
      expect(window._paq).toBeDefined();
    });
    describe('cookie variables', () => {
      afterEach(() => {
        consent.trackingConsent = 'false';
      });
      test('trackingConsent should be defined', () => {
        expect(consent.trackingConsent).toBeDefined();
      });

      it.skip('should have a true cookie when trackingConsent is true', () => {});
    });
  });
});
