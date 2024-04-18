import { afterEach, describe, it, expect, test, vi } from 'vitest'
import { TestCookieJar, docCookies, setCookieConsentSeen } from './cookies'
import { cookieConsentSeen, marketingConsent } from './store'
import { get } from 'svelte/store';

let expires = new Date();
expires.setMonth(expires.getMonth() + 12);
const HT = (window.HT = window.HT || {});
HT.cookies_domain = '.hathitrust.org'

//need to set these in order to set cookies in this "browser"
window.location.host = "www.hathitrust.org"
window.location.protocol = "https:"


// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

const getItemSpy = vi.spyOn(docCookies, 'getItem')
const setItemSpy = vi.spyOn(docCookies, 'setItem')

describe('Document is available', () => {
it('should not be undefined', () => {
           expect(document).not.toBeUndefined() 
        })
})
describe('TestCookieJar', () => {
    const mockCookie = {'COOKIE': 'true'}
    const cookieJar = new TestCookieJar(mockCookie) 

    describe('getItem', () => {
        it('should return the value of the cookie', () => {
            const trueCookie = cookieJar.getItem('COOKIE')
            expect(trueCookie).toBe('true')
            expect(trueCookie).not.toBe(true)
        })
    })
    describe('setItem', () => { 
        it('should set the cookie value', () => {
            cookieJar.setItem('COOKIE', 'false')            
            expect(cookieJar.data.COOKIE).toBe('false')
            expect(cookieJar.data.COOKIE).not.toBe(false)
        })
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
            // expect(docCookies.setItem('COOKIE', 'cookie')).toBe(true)
            expect(docCookies.setItem('COOKIE', 'cookie', '', '', '')).toBe(true)
            expect(document.cookie).toBeTruthy()
            expect(document.cookie).toContain("COOKIE=cookie")
            expect(setItemSpy).toHaveBeenCalled()
        })
    })
})
describe('setCookieConsentSeen', () => {
    test('cookieConsentSeen should be undefined', () => {
        expect(get(cookieConsentSeen)).toBeUndefined()
    })

    it('sets HT-cookie-banner-seen cookie', () => {
    
        setCookieConsentSeen()
        expect(setItemSpy).toHaveBeenCalled()
        expect(document.cookie).not.toEqual('')
        expect(document.cookie).toContain("HT-cookie-banner-seen=true")

    })
    it('sets cookieConsentSeen store variable to true', () => {
        expect(get(cookieConsentSeen)).toBe('true')
    })
    
})