import { IMessageLogger, INmeaModel } from 'ais-tools';
export declare class MessageLogger implements IMessageLogger {
    level: number;
    constructor();
    error(message: string, opt?: INmeaModel): void;
    warn(message: string, opt?: INmeaModel): void;
    info(message: string, opt?: any): void;
    debug(message: string, opt?: any): void;
    verbose(message: string, opt?: any): void;
    silly(message: string, opt?: any): void;
}
