import { GTAEvent, Provider } from 'types';
export declare type Params = {
    account: string;
    track?: string;
};
export declare class TBPanelLite implements Provider {
    static providerName: string;
    name: string;
    private userKey;
    private trackUrl;
    constructor(params: Params);
    setUser(userKey: string): void;
    event(eventDetails: GTAEvent): void;
}
