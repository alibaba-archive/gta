import { GTAEvent, Provider } from '../types';
declare global {
    interface Window {
        ga?: any;
        GoogleAnalyticsObject?: string;
    }
}
export declare type Params = {
    account: string;
    scriptUrl?: string;
};
export declare class GoogleAnalytics implements Provider {
    static providerName: string;
    name: string;
    constructor(params: Params);
    pageview(): void;
    event(eventDetails: GTAEvent): void;
}
