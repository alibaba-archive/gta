import { GTA, Plugin } from 'types';
declare module 'index' {
    interface GTA {
        getUTM?: UTMDaemon['get'];
        sweepUTM?: UTMDaemon['sweep'];
    }
}
export declare class UTMDaemon implements Plugin {
    private gta;
    static pluginName: string;
    name: string;
    constructor(gta: GTA);
    get: () => any;
    sweep: () => void;
}
