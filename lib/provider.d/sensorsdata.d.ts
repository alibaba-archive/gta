import { GTAEvent, Provider } from '../types';
declare global {
    interface Window {
        sa?: any;
    }
}
export declare type Params = {
    account: string;
    script?: string;
    heatmap?: boolean;
    showlog?: boolean;
    isspa?: boolean;
};
export declare class Sensorsdata implements Provider {
    static providerName: string;
    name: string;
    constructor(params: Params);
    setUser(id: string, user: object): void;
    event(event: GTAEvent): void;
    login(userId: string): void;
    logout(): void;
}
