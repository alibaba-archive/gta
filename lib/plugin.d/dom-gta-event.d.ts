import { GTA } from '../types';
export declare class DOMGTAEventPlugin {
    private gta;
    static pluginName: string;
    name: string;
    constructor(gta: GTA);
    onClick: (evt: MouseEvent) => void;
    handleEvent: (evt: MouseEvent) => void;
}
