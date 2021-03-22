import { GTA, Plugin } from 'types';
declare module 'index' {
    interface GTA {
        getReferral?: ReferralDaemon['get'];
        sweepReferral?: ReferralDaemon['sweep'];
    }
}
export declare class ReferralDaemon implements Plugin {
    private gta;
    static pluginName: string;
    name: string;
    constructor(gta: GTA);
    get: () => any;
    sweep: () => void;
}
