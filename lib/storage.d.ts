export declare class CookieStorage {
    key: string;
    expires: number;
    private domain;
    private cache;
    constructor(key: string, expires?: number, // 60 * 24 * 3600 * 1000
    domain?: string);
    set(key: string, value: any): void;
    get<T = any>(key: string): T | undefined;
    delete(key: string): void;
    getDomain(): string;
    setDomain(domain: string): void;
    private get savedDomain();
    private get defaultDomain();
    private get cookieDomain();
    commit(): void;
    destroy(options?: {
        flushCache?: boolean;
    }): void;
}
