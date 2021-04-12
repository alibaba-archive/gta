import { GTA, Plugin } from '../types';
declare module '../index' {
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
    /**
     * 埋点计时开始
     * @param key 埋点存储字段
     */
    durationStart: (key: string) => void;
    /**
     * 埋点结束
     * @param key 埋点取值字段
     * @param newFlag 是否取最后的值，false默认取值第一个，取值后删除Map
     * @param index 是否根据索引取值，取值后保留Map
     */
    durationEnd: (key: string, newFlag?: boolean | undefined, index?: number | undefined) => void;
}
