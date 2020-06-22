/// <reference types="node" />
import { EventEmitter } from 'events';
import { AbstractDatabase, TColNames, IQuery, INmeaFetchConfig, IDatabase } from 'ais-tools';
export declare class Emitter extends EventEmitter {
    filter: any[];
    type: string;
    constructor(filter: IQuery);
    off(eventName: any, listener: any): this;
    add(type: string, data: any): void;
}
export declare class Database extends AbstractDatabase implements IDatabase {
    config: any;
    sender: string;
    socket: any;
    uuid: any;
    emitters: Emitter[];
    connected: boolean;
    timer: any;
    constructor(config: any);
    private reconnect;
    private unsubscribe;
    private subscribe;
    connect(): Promise<undefined>;
    disconnect(): Promise<undefined>;
    private onPositions;
    private onShips;
    tail(colName: TColNames, filter?: any): any;
    findAll(colName: TColNames, filter?: any, limit?: number, options?: INmeaFetchConfig): Promise<any>;
    findOne(colName: TColNames, filter: any): Promise<any>;
}
