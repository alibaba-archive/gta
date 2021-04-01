import { CookieStorage } from 'storage';
import { BaseProviderParams, GTAEvent, GTAOptions, PluginConstructor, Plugin, Provider, ProviderConstructor } from 'types';
import 'plugin.d/super-property';
import 'plugin.d/duration';
export declare const kVersion: string;
export declare class GTA {
    static version: string;
    version: string;
    get debug(): boolean;
    set debug(flag: boolean);
    private dryRun;
    private initialized;
    private plugins;
    private providers;
    options: GTAOptions | null;
    storage: CookieStorage;
    constructor();
    init(options?: GTAOptions): boolean;
    setUser(userId?: string, user?: object, options?: GTAOptions): boolean;
    registerProvider<T extends BaseProviderParams>(Ctor: ProviderConstructor<T>, params: T): Provider | null;
    registerPlugin<T>(Ctor: PluginConstructor<T>, params: T): Plugin;
    event(event: GTAEvent): this;
    pageview(): void;
    login(userId: string, user: object): void;
    logout(userId: string): void;
}
declare const _default: GTA;
export default _default;
