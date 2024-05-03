import { afterEach, afterAll, describe, it, expect, test, vi } from 'vitest'
import { docCookies, setSelectedConsent} from './cookies'
import { cookieConsentSeen, trackingConsent, marketingConsent, preferencesConsent, allowTracking } from './store'
import { get } from 'svelte/store';

// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

let expires = new Date();
expires.setMonth(expires.getMonth() + 12);
const HT = (window.HT = window.HT || {});
HT.cookies_domain = '.hathitrust.org'

//need to set these in order to set cookies in this "browser"
window.location.host = "www.hathitrust.org"
window.location.protocol = "https:"


const getItemSpy = vi.spyOn(docCookies, 'getItem')
const setItemSpy = vi.spyOn(docCookies, 'setItem')
const remoteItemSpy = vi.spyOn(docCookies, 'removeItem')

describe('Document is available', () => {
it('should not be undefined', () => {
           expect(document).not.toBeUndefined() 
        })
})
describe('docCookies', () => {
    afterEach(() => {
        document.cookie = "COOKIE=true;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "COOKIE=cookie;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }) 
    describe('getItem', () => {
        document.cookie="COOKIE=true"

        test('gets value of cookie from document.cookie', () => {
            expect(docCookies.getItem('COOKIE')).toStrictEqual('true');
            expect(getItemSpy).toHaveBeenCalled()
        }) 
        test('returns null if cookie key does not exist', () => {
            expect(docCookies.getItem('NOCOOKIE')).toBe(null);
            expect(getItemSpy).toHaveBeenCalled()
        })
    })
    describe('setItem', () => {
        test('sets cookie with key and value', () => {
            expect(docCookies.setItem('COOKIE', 'cookie', '', '', '')).toBe(true)
            expect(document.cookie).toBeTruthy()
            expect(document.cookie).toContain("COOKIE=cookie")
            expect(setItemSpy).toHaveBeenCalled()
        })
    })
    describe('removeItem', () => {
        test('removes cookie with given name/key', () => {
            //set up a cookie
            expect(document.cookie).toEqual('')
            document.cookie = "COOKIE=cookie"
            expect(document.cookie).toContain("COOKIE=cookie")

            //now test removeItem
            expect(docCookies.removeItem('COOKIE')).toBe(true)
            expect(document.cookie).toEqual('')
            expect(remoteItemSpy).toHaveBeenCalled()
        })
    })
})
// describe('setCookieConsentSeen', () => {
//     afterAll(() => {
//         docCookies.removeItem('HT-cookie-banner-seen');
//     }) 
//     test('cookieConsentSeen should be undefined', () => {
//         expect(get(cookieConsentSeen)).toBeUndefined()
//     })

//     it('sets HT-cookie-banner-seen cookie', () => {
    
//         setCookieConsentSeen()
//         expect(setItemSpy).toHaveBeenCalled()
//         expect(document.cookie).not.toEqual('')
//         expect(document.cookie).toContain("HT-cookie-banner-seen=true")

//     })
//     it('sets cookieConsentSeen store variable to true', () => {
//         expect(get(cookieConsentSeen)).toBe('true')
//     })
    
// })
// describe('setTrackingAllowedCookie', () => {
//     afterAll(() => {
//         docCookies.removeItem('HT-tracking-cookie-consent');
//     }) 
//     test('trackingConsent should be false', () => {
//         expect(get(trackingConsent)).toBe('false')
//     })
//     it('sets trackingConsent to true', () => {
//         setTrackingAllowedCookie()
//         expect(get(trackingConsent)).toBe('true')
//     })
// })

// describe('setTrackingDisallowedCookie', () => {
//     it('sets trackingConsent to false', () => {
//         setTrackingDisallowedCookie()
//         expect(get(trackingConsent)).toBe('false')
//     })
// })

// describe('setMarketingAllowedCookie', () => {
//     test('marketingConsent should be false', () => {
//         expect(get(marketingConsent)).toBe('false')
//     })
//     it('sets marketingConsent to true', () => {
//         setMarketingAllowedCookie()
//         expect(get(marketingConsent)).toBe('true')
//     })
// })
// describe('setMarketingDisallowedCookie', () => {
//     it('sets marketingConsent to false', () => {
//         setMarketingDisallowedCookie()
//         expect(get(marketingConsent)).toBe('false')
//     })
// })
// describe('setPreferencesAllowedCookie', () => {
//     test('preferencesConsent should be false', () => {
//         expect(get(preferencesConsent)).toBe('false')
//     })
//     it('sets preferenecsConsent to true', () => {
//         setPreferencesAllowedCookie()
//         expect(get(preferencesConsent)).toBe('true')
//     })
// })
// describe('setPreferencesDisallowedCookie', () => {
//     it('sets preferenecsConsent to false', () => {
//         setPreferencesDisallowedCookie()
//         expect(get(preferencesConsent)).toBe('false')
//     })
// })
describe('setSelectedConsent', () => {
    afterAll(() => {
        docCookies.removeItem('HT-tracking-cookie-consent')
    })
    // it.skip('should use setTrackingAllowedCookie', () => {
        // const mockSetTrackingAllowedCookie = vi.fn().mockImplementation('setTrackingAllowedCookie')
        //not sure how to find out if it used this function
        // setSelectedConsent()

    // }) 
    it('should set HT-tracking-consent to true', () => {
        allowTracking.set(true);
        setSelectedConsent()

        expect(get(allowTracking)).toBe(true)
        expect(document.cookie).toContain('HT-tracking-cookie-consent=true')
    })

})