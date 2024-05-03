
import { afterEach, afterAll, describe, it, expect, test, vi } from 'vitest'
import AnalyticsManager from './analytics'
import { config } from 'chai';
import { trackingConsent } from './store';
import { get } from 'svelte/store'

// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

const HT = (window.HT = window.HT || {});
HT.cookies_domain = '.hathitrust.org'
// HT.analyticsSettings = {service: 'testing.matomo.hathitrust.org', container:'SnfE6ZC0'}
HT.analyticsSettings = {service: 'fake.service', container:'test'}

//need to set these in order to set cookies in this "browser"
window.location.host = "www.hathitrust.org"
window.location.protocol = "https:"
// let s = document.createElement('script')
// document.head.appendChild(s)

const analyticsManager = new AnalyticsManager(HT)
const configureSpy = vi.spyOn(analyticsManager, 'configure')

describe('Document is available', () => {
    it('should not be undefined', () => {
           expect(document).not.toBeUndefined() 
        })
    it.skip('should have a script', () => {
        expect(document.getElementsByTagName('script')[0]).toBeDefined()
    }) 
})
describe('AnalyticsManager', () => {
    describe('configure', () => {
         
        document.body.classList.add('apps')
        test('body element should have apps class', () => {
            expect(document.body.classList).toContain('apps')
        })
        it('should configure analytics', () => {
            analyticsManager.configure(() => { })
            expect(configureSpy).toHaveBeenCalled()
        })
        it('should have _mtm variable defined', () => {
            expect(window._mtm).toBeDefined()
        })
        it('should have _paq variable defined', () => {
            expect(window._paq).toBeDefined()
        })
        describe('cookie variables', () => {
            afterEach(() => {
                trackingConsent.set('false')
            })
            test('trackingConsent should be defined', () => {
                expect(trackingConsent).toBeDefined()
            })


            // these tests are useless.
            // do I need to mock matomo cookie functions
            // in order to actually test the trackingConsent subscription?

            // it('should return true when tracking variable is true', () => {
            //     trackingConsent.set('true')
            //     expect(get(trackingConsent)).toBe('true')
            // })
            // it('should return false when tracking variable is false', () => {
            //     //default value to trackingConsent is false
            //     expect(get(trackingConsent)).toBe('false')
            // })
            const mockSetCookieConsentGiven = vi.fn().mockImplementation(() => document.cookie="HT-tracking-cookie-consent=true" )
            it('should have a true cookie when trackingConsent is true', () => {
                
            })
        })

    })
})