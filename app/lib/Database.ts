import { default as io } from 'socket.io-client'
import { default as moment } from 'moment'
import { default as Noty } from 'noty'
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import { AbstractDatabase, TColNames, IQuery, INmeaFetchConfig, INmeaModel, INmeaShipdata, INmeaPosition, IDatabase } from 'ais-tools'

export class Emitter extends EventEmitter {
    filter: any[] = []
    type: string

    constructor(filter: IQuery) {
        super()

        filter = filter
        this.type = filter.Type

        delete filter.TimeStamp
        delete filter.Type

        const keys = Object.keys(filter)
        for (let i = 0; i < keys.length; i++) {
            this.filter.push({ k: keys[i], v: filter[keys[i]] })
        }
    }

    off(eventName, listener): this {
        super.off(eventName, listener)
        this.emit('listeners', this.listenerCount('data'))
        return this
    }

    add(type: string, data: any): void {
        if (this.type === type && this.filter.every(filter => data[filter.k] === filter.v)) {
            data.TimeStamp = moment.utc(data.TimeStamp).toDate()
            data.CreatedAt = moment.utc(data.CreatedAt).toDate()

            const result = {
                Type: type,
                Data: data,
                TimeStamp: Date.now()
            }

            this.emit('data', result)
        }
    }
}

export class Database extends AbstractDatabase implements IDatabase {
    config: any

    sender: string = 'frontend'
    socket: any
    uuid: any
    emitters: Emitter[] = []
    connected: boolean = false
    timer: any = undefined

    constructor(config: any) {
        super()

        this.sender = 'frontend'
        this.config = config
        this.uuid = uuidv4()

        window.addEventListener("beforeunload", this.disconnect, false)
    }

    private reconnect = (ev:any) => {
        this.socket.emit('subscribe', { uuid: this.uuid })
    }

    private unsubscribe(): void {
        this.socket.emit('unsubscribe', { uuid: this.uuid })

        this.socket.off('positions', this.onPositions)
        this.socket.off('ships', this.onShips)
        this.socket.off('reconnect', this.reconnect)
    }

    private subscribe(): void {
        this.socket.on('positions', this.onPositions)
        this.socket.on('ships', this.onShips)
        this.socket.on('reconnect', this.reconnect)

        this.socket.emit('subscribe', { uuid: this.uuid })
    }

    async connect(): Promise<undefined> {
        if (this.connected) return
        this.connected = true

        this.socket = io()
        this.subscribe()

        return
    }

    async disconnect(): Promise<undefined> {
        if (!this.connected) return
        this.connected = false

        this.unsubscribe()
        this.socket = undefined
        return
    }

    private onPositions = (data: INmeaPosition) => {
        for (let i = 0; i < this.emitters.length; i++) {
            this.emitters[i].add('NmeaPosition', data)
        }
    }

    private onShips = (data: INmeaShipdata) => {
        for (let i = 0; i < this.emitters.length; i++) {
            this.emitters[i].add('NmeaShipdata', data)
        }
    }

    public tail(colName: TColNames, filter?: any): any {
        const emitter = new Emitter(filter)

        emitter.on('listeners', (cnt: number) => {
            if (cnt < 1) {
                emitter.removeAllListeners()
                const idx = this.emitters.indexOf(emitter)
                this.emitters.splice(idx, 1)
            }
        })

        this.emitters.push(emitter)

        return emitter
    }

    public async findAll(colName: TColNames, filter?: any, limit?: number, options?: INmeaFetchConfig): Promise<any> {
        let query: string[] = []
        if (Object.keys(filter).length > 0) {
            query.push(`filter=${JSON.stringify(filter)}`)
        }
        if (limit) {
            query.push(`limit=${limit}`)
        }
        if (options) {
            query.push(`options=${JSON.stringify(options)}`)
        }

        let request = `${this.config.host}/${colName}`
        if (query.length > 0) {
            request += '?' + query.join('&')
        }

        const response = await fetch(request)
        const json = await response.json()

        return json.map((item: INmeaModel) => {
            item.TimeStamp = moment.utc(item.TimeStamp).toDate()
            item.CreatedAt = moment.utc(item.CreatedAt).toDate()
            return item
        })
    }

    public async findOne(colName: TColNames, filter: any): Promise<any> {
        const response = await fetch(`${this.config.host}/${colName.substr(0, colName.length - 1)}?filter=${JSON.stringify(filter)}`)
        return await response.json()
    }
}