import { v4 as uuidv4 } from 'uuid'
import { Ship } from 'ais-tools'
import { AbstractView } from './AbstractView'

export abstract class AbstractButtonView extends AbstractView {
    abstract name: string
    abstract textA?: string
    abstract textB?: string
    abstract classList: string

    public selector: string
    public replace: string
    public class: string
    public uuid: string

    public ship?: Ship
    private interrupted: boolean = false

    abstract async content(ev?: any): Promise<DocumentFragment>

    constructor(selector: string, ship?: Ship) {
        super()

        this.selector = selector

        this.ship = ship

        this.uuid = uuidv4()
        this.class = `btn-${this.uuid}`
        this.replace = `.${this.class}`
    }

    interrupt = async (): Promise<void> => {
        this.interrupted = true
        this.render()
    }

    continue = async (): Promise<void> => {
        this.interrupted = false
        this.render()
    }

    get disabled(): string {
        if (this.interrupted) {
            return ' disabled="disabled'
        }
        return ''
    }

    public preRender(textA?: string, textB?: string, classList?: string): string {
        this.textA = textA || this.textA
        this.textB = textB || this.textB
        this.classList = classList || this.classList

        return `<button class="${this.class}"></button>`
    }

    public render = async (ev?: any): Promise<void> => {
        await this.beforeRender()
        this.element(this.replace).replaceWith(await this.content(ev))
        await this.afterRender(false)
    }
}