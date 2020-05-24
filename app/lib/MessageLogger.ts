import { IMessageLogger, INmeaModel } from 'ais-tools'

export class MessageLogger implements IMessageLogger {
    level: number = 0

    constructor() {
        this.level = 1
    }

    public error(message: string, opt?: INmeaModel): void {
        if (opt) {
            console.log(message, opt.join('\n'))
        } else {
            console.log(message)
        }
    }
    public warn(message: string, opt?: INmeaModel): void {
        if (this.level > 0) {
            if (opt) {
                console.log(message, opt.join('\n'))
            } else {
                console.log(message)
            }
        }
    }
    public info(message: string, opt?: any): void {
        if (this.level === 2) {
            if (opt) {
                console.log(message, opt.join('\n'))
            } else {
                console.log(message)
            }
        }
    }
    public debug(message: string, opt?: any): void { }
    public verbose(message: string, opt?: any): void { }
    public silly(message: string, opt?: any): void { }
}