import type { GTAOptions, Provider } from './types';
export declare const removeNode: (el: HTMLElement) => void;
export declare const createScript: (src: string, id?: string | undefined) => HTMLScriptElement;
export declare const loadScript: (script: HTMLScriptElement, key?: string | undefined, removeAfterLoad?: boolean) => void;
export declare const GTA_CHECK_REGEX: RegExp;
export declare const GTA_PARSE_REGEX: RegExp;
export declare const parseGTA: (raw: string) => {} | null;
export declare const formatUserFor: (provider: Provider, user: object) => {};
export declare const parseConfigElement: ($el: HTMLElement | null) => GTAOptions | null;
export declare const xhrGET: (url: string) => XMLHttpRequest;
export declare const imageGET: (url: string) => HTMLImageElement;
export declare const kUUIDRandPrefix = "72616e64";
export declare const UUID: () => string;
export declare const isRandomID: (id: string) => boolean;
export declare const find: <T>(arr: T[], predictor: (i: T) => boolean) => T | null;
export declare const deleteCookie: (name: string, domain?: string | undefined) => void;
export declare let DEBUG_FLAG: boolean;
export declare const setDebugFlag: (flag: boolean) => void;
export declare const DBGCALL: (...args: any[]) => void;
export declare enum CookieAbbr {
    userKey = "uk",
    userProperty = "up",
    preference = "pf",
    dryRun = "dr",
    cookieDomain = "cd",
    referral = "r",
    utm = "utm"
}
declare global {
    const DEBUG: typeof DBGCALL;
    interface Window {
        _gta_debug: boolean;
    }
}
