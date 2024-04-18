import { afterEach, describe, it, expect, test, vi } from 'vitest'
import { TestCookieJar, docCookies } from './cookies'
import { cookieConsentSeen } from './store'

let expires = new Date();
expires.setMonth(expires.getMonth() + 12);
let HT = window.HT || {}
HT.cookies_domain = '.hathitrust.org'

// @vitest-environment happy-dom
// happy-dom gives us browser stuff like window and document functions

describe('Document is available', () => {
it('should not be undefined', () => {
           expect(document).not.toBeUndefined() 
        })
})
describe('TestCookieJar', () => {
    const mockCookie = {'COOKIE': 'true'}
    const mockCookieJar = new TestCookieJar(mockCookie) 

    describe('getItem', () => {
        it('should return the value of the cookie', () => {
            const trueCookie = mockCookieJar.getItem('COOKIE')
            expect(trueCookie).toBe('true')
            expect(trueCookie).not.toBe(true)
        })
    })
    describe('setItem', () => { 
        it('should set the cookie value', () => {
            mockCookieJar.setItem('COOKIE', 'false')            
            expect(mockCookieJar.data.COOKIE).toBe('false')
            expect(mockCookieJar.data.COOKIE).not.toBe(false)
        })
    })
})
describe('docCookies', () => {
    const mockCookieJar = docCookies; 
    const getItemSpy = vi.spyOn(mockCookieJar, 'getItem')
    const setItemSpy = vi.spyOn(mockCookieJar, 'setItem')
    afterEach(() => {
        document.cookie = "COOKIE=true;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "COOKIE=cookie;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }) 
    describe('getItem', () => {
        document.cookie="COOKIE=true"

        test('gets value of cookie from document.cookie', () => {
            expect(mockCookieJar.getItem('COOKIE')).toStrictEqual('true');
            expect(getItemSpy).toHaveBeenCalled()
        }) 
        test('returns null if cookie key does not exist', () => {
            expect(mockCookieJar.getItem('NOCOOKIE')).toBe(null);
            expect(getItemSpy).toHaveBeenCalled()
        })
    })
    describe('setItem', () => {
        test('sets cookie with key and value', () => {
            expect(mockCookieJar.setItem('COOKIE', 'cookie')).toBe(true)
            expect(document.cookie.split(";").some((item) => item.includes("COOKIE=cookie"))).toBe(true)
            expect(setItemSpy).toHaveBeenCalled()
        })
    })
})
describe('setCookieConsentSeen', () => {
    const mockCookieJar = docCookies; 
    const setItemSpy = vi.spyOn(mockCookieJar, 'setItem')

    it('should set HT-cookie-consent-seen to true', () => {
        expect(mockCookieJar.setItem('HT-cookie-banner-seen', 'true', expires, '/', HT.cookies_domain, 'true')).toBe(true)
        expect(setItemSpy).toHaveBeenCalled()
        // expect(document.cookie.split(";").some((item) => item.includes("HT-cookie-banner-seen=true"))).toBe(true)
    })
    it.todo('should set cookieConsentSeen store variable to true')
})