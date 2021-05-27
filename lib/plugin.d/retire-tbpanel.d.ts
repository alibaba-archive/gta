import { GTA, Plugin } from '../types';
export declare class RetireTBPanelPlugin implements Plugin {
    static pluginName: string;
    name: string;
    constructor(_gta: GTA);
    private sweepTBPanelCookies;
    private generateDomainList;
}
