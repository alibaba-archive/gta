import { GTAEvent, Provider } from 'types';
export declare type Params = {
    account: string;
    host: string;
};
export declare class APlus implements Provider {
    static providerName: string;
    name: string;
    private host;
    private goldKey;
    private userKey;
    private user;
    constructor(params: Params);
    setUser(id: string, user: object): void;
    enrichEvent(event: GTAEvent): {
        gmkey: string;
        userKey: string;
        cache: string;
        mp_lib: string;
        platform: string;
        sys_current_url: string;
    };
    event(event: GTAEvent): void;
}
