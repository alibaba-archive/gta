import { GTA, GTAEvent, Plugin } from '../types';
declare module '../index' {
    interface GTA {
        setCurrentPage: SuperPropertyPlugin['setCurrentPage'];
        registerProperty: SuperPropertyPlugin['registerProperty'];
        unregisterProperty: SuperPropertyPlugin['unregisterProperty'];
        registerPersistentProperty: SuperPropertyPlugin['registerPersistentProperty'];
        unregisterPersistentProperty: SuperPropertyPlugin['unregisterPersistentProperty'];
    }
}
export declare class SuperPropertyPlugin implements Plugin {
    private gta;
    static pluginName: string;
    name: string;
    private runtimeProperties;
    private persistentProperties;
    constructor(gta: GTA);
    registerProperty: (key: string, value: any) => this;
    unregisterProperty: (key: string) => this;
    registerPersistentProperty: (key: string, value: any) => void;
    unregisterPersistentProperty: (key: string) => void;
    setCurrentPage: (page: string) => void;
    onGTAEvent(eventDetails: GTAEvent): {
        [x: string]: any;
    };
}
