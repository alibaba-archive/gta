import { GTA, Plugin } from 'types';
declare module 'index' {
    interface GTA {
        durationStart?: DurationPlugin['durationStart'];
        durationEnd?: DurationPlugin['durationEnd'];
    }
}
export declare class DurationPlugin implements Plugin {
    private gta;
    static pluginName: string;
    name: string;
    private startTimeMap;
    constructor(gta: GTA);
    durationStart: (key: string) => void;
    durationEnd: (key: string) => void;
}
