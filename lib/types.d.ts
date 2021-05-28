import type { GTA } from './index';
export type { GTA } from './index';
export declare type Dict<T = string> = {
    [key: string]: T;
};
export declare type GTAOptions = {
    domain?: string;
    dryRun?: boolean;
    providerConfig?: {
        [providerName: string]: BaseProviderParams;
    };
    pluginConfig?: {
        [pluginName: string]: {
            disabled?: boolean;
        } & Dict;
    };
};
export declare type GTAEvent = {
    [key: string]: string | number;
};
export interface Provider {
    name: string;
    pageview?: () => void;
    event?: (e: GTAEvent) => void;
    setUser?: (userId: string, user: object) => void;
    login?: (userId: string, user: object, options: {
        prevId: string;
    }) => void;
    logout?: (userId: string) => void;
}
export declare type BaseProviderParams = {
    account: string;
};
export interface ProviderConstructor<T extends BaseProviderParams = BaseProviderParams> {
    providerName: string;
    new (params: T): Provider;
}
export interface Plugin {
    name: string;
    onGTAEvent?: (eventDetails: GTAEvent) => GTAEvent | null;
}
export interface PluginConstructor<T = any> {
    pluginName: string;
    new (gtaInstance: GTA, params?: T): Plugin;
}
