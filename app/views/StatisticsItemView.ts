import { default as moment } from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { AbstractView } from '../lib'
import { default as EasyPieChart } from '../lib/EasyPieChart'

export class StatisticsItemView extends AbstractView {
    public name: string = 'StatisticsItemView'
    public selector: string

    private replace: string
    private class: string
    private uuid: string
    private sender: string
    private filter: string[]

    private all: number = 0
    private unique: number = 0
    private chartAll?: any
    private chartUnique?: any

    constructor(selector: string, sender: string, filter: string[]) {
        super()

        this.selector = selector
        this.uuid = uuidv4()
        this.class = `statistic-item__${this.uuid}`
        this.replace = `.${this.class}`

        this.sender = sender
        this.filter = filter
    }

    async fetch (request: string): Promise<number> {
        try {
            const response = await fetch(request)
            const json = await response.json()
            return json.cnt
        } catch (ex) {
            throw ex
        }
    }

    async fetchAll (e: moment.Moment): Promise<number> {
        const request = `/api/positions/cnt?options={"unique":true}&filter={"Sender":{"$elemMatch":{"Name":"${this.sender}"}},"TimeStamp":{"$gt":"${e.utc().format()}"}}`
        return this.fetch(request)
    }

    async fetchUnique (e: moment.Moment): Promise<number> {
        const request =`/api/positions/cnt?options={"unique":true}&filter={"Sender":{"$not":{"$elemMatch":{"Name":{"$in":["${this.filter.join('","')}"]}}}},"TimeStamp":{"$gt":"${e.utc().format()}"}}` 
        return this.fetch(request)
    }

    public preRender(): string {
        return `<div class="statistic-item ${this.class}"></div>`
    }

    async content(): Promise<DocumentFragment> {
        let html: string[] = []
        html.push(`<div class="statistic-item ${this.class}">`)

        html.push(`<h3>${this.sender}</h3>`)
        html.push(`<p class="statistic-item__chart-all"><span class="percent unselectable"></span></p>`)
        html.push(`<p class="statistic-item__chart-unique"><span class="percent unselectable"></span></p>`)

        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public async afterRender(autoshow: boolean = true): Promise<void> {
        super.afterRender(autoshow)

        this.chartAll = new EasyPieChart(this.element(`.${this.class} .statistic-item__chart-all`))
        this.chartUnique = new EasyPieChart(this.element(`.${this.class} .statistic-item__chart-unique`), { size: 70 })

        const max: number = await new Promise(result => {
            document.addEventListener('response:ships', (ev: any) => result(ev.detail.cnt), { once: true })
            this.broadcast('request:ships')
        })

        const e = moment()
        e.subtract(5, 'minutes')

        const all = await this.fetchAll(e)
        const unique = await this.fetchUnique(e)
        
        this.chartAll.update((100 / max) * all)
        this.chartUnique.update((100 / max) * unique)

        this.element(`.${this.class} .statistic-item__chart-all .percent`).innerHTML = String(all)
        this.element(`.${this.class} .statistic-item__chart-unique .percent`).innerHTML = String(unique)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()

        this.broadcast('view:showing')

        this.element(this.replace).replaceWith(await this.content())
        
        this.broadcast('view:shown')

        await this.afterRender()
    }
}