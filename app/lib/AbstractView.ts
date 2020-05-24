import { EventEmitter } from 'events'

export abstract class AbstractView extends EventEmitter {
    abstract name: string
    abstract selector: string
    abstract async content(ev?: any): Promise<DocumentFragment | void>

    public el: HTMLElement = document.createElement('div')
    public isDestroying: boolean = false
    public isDestoryed: boolean = true
    public isRendered: boolean = false
    public isAttached: boolean = false
    public isShown: boolean = false

    public elements: any[] = []
    public events: any[] = []
    public subscriptions: any[] = []
    public subViews: any[] = []

    private animationSpeed: string = 'faster'

    public close = async (): Promise<void> => { }

    public add(name: string, view: any) {
        this.subViews.push({ name, view })
    }

    public get(name: string) {
        try {
            return this.subViews.find(item => item.name === name).view
        } catch (ex) {
            console.log(name, this.subViews)
            console.trace(ex)
        }
    }

    public async hide(): Promise<void> {
        await this._hide()
    }

    public async show(): Promise<void> {
        await this._show()
    }

    public _show = async (animationName?: string, _el?: HTMLElement): Promise<void> => {
        const el = _el || this.el
        if (!el) throw new Error('No Element')

        this.broadcast('view:showing')

        if (typeof(animationName) === 'undefined') {
            el.style.display = 'block'
            this.broadcast('view:shown')
            this.isShown = true
            return
        }

        return new Promise(resolve => {
            el.addEventListener('animationend', () => {
                el.classList.remove('animated', animationName, this.animationSpeed)
                resolve()
                this.broadcast('view:shown')
                this.isShown = true
            }, { once: true })

            el.classList.add('animated', animationName, this.animationSpeed)
            el.style.display = 'block'
        })
    }

    public _hide = async (animationName?: string, _el?: HTMLElement): Promise<void> => {
        const el = _el || this.el
        if (!el) throw new Error('No Element')

        this.broadcast('view:hiding')

        if (typeof(animationName) === 'undefined') {
            el.style.display = 'none'
            this.broadcast('view:hidden')
            this.isShown = false
            return
        }

        return new Promise(resolve => {
            el.addEventListener('animationend', () => {
                el.style.display = 'none'
                el.classList.remove('animated', animationName, this.animationSpeed)
                resolve()
                this.broadcast('view:hidden')
                this.isShown = false
            }, { once: true })

            el.classList.add('animated', animationName, this.animationSpeed)
        })
    }

    public register(event: string, selector?: string|Function, callback?: Function): void {
        if (typeof(selector) === 'string') {
            this.events.push({
                selector: selector,
                event: event,
                callback: callback
            })
        } else {
            this.events.push({
                event: event,
                callback: selector
            })
        }
    }

    public unsubscribe(event: any): void {
        const idx = this.subscriptions.findIndex(subscription => subscription.event === event)
        if (idx > -1) {
            this.subscriptions.splice(idx, 1)
        }
    }

    public subscribe(event: any, callback: any): void {
        this.subscriptions.push({ event, callback })
    }

    public broadcast(name: string, data: any = {}): void {
        const eventData = Object.assign(data, {
            name: this.name,
            view: this
        })
        //console.log(name, eventData)
        document.dispatchEvent(new CustomEvent(name, { detail: eventData }))
    }

    public async delay(delay: number = 1000): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, delay)
        })
    }

    public element(selector: string, force: boolean = false): HTMLElement {
        if (this.isDestroying) {
            throw new Error('View is isDestroying')
        }

        const el = document.querySelector(this.selector)

        if (el) {
            if (force) {
                const idx = this.elements.findIndex(element => element.selector === selector)
                if (idx > -1) {
                    this.elements.splice(idx, 1);
                }
            }
            let res = this.elements.find(element => element.selector === selector)
            if (!res) {
                const _el = el.querySelector(selector)
                if (_el) {
                    res = {
                        selector,
                        el: _el
                    }
                    this.elements.push(res)
                } else {
                    // if (this.name !== 'ShipTableView') {
                    //     console.log('-----------------------')
                    //     console.log(this.name)
                    //     console.log('isDestroying', this.isDestroying)
                    //     console.log('isDestoryed', this.isDestoryed)
                    //     console.log('isRendered', this.isRendered)
                    //     console.log('isAttached', this.isAttached)
                    //     console.log('isShown', this.isShown)
                    // }
                    // if (this.name !== 'ShipImageView' && this.name !== 'ShipTableView') console.log(this)
                    throw new Error('No Element found ' + this.selector + ' ' + selector)
                }
            }
            return res.el
        } else {
            // console.log('-----------------------')
            // console.log(this.name)
            // console.log('isDestroying', this.isDestroying)
            // console.log('isDestoryed', this.isDestoryed)
            // console.log('isRendered', this.isRendered)
            // console.log('isAttached', this.isAttached)
            // console.log('isShown', this.isShown)

            throw new Error('No Main Element ' + this.selector)
        }
    }

    public attachEvents(): boolean {
        if (!this.isAttached) {
            for (const event of this.events) {
                if (event.selector) {
                    event.el = this.element(event.selector, true)
                } else {
                    event.el = this.el
                }
                event.el.addEventListener(event.event, event.callback, false)
            }
            for (const subscription of this.subscriptions) {
                document.addEventListener(subscription.event, subscription.callback, false)
            }
            this.isAttached = true
        }

        return this.isAttached
    }

    public detachEvents(): boolean {
        if (this.isAttached) {
            for (const event of this.events) {
                event.el.removeEventListener(event.event, event.callback, false)
            }
            for (const subscription of this.subscriptions) {
                document.removeEventListener(subscription.event, subscription.callback, false)
            }
            this.isAttached = false
        }

        return this.isAttached
    }

    public async remove(): Promise<void> {
        if (this.isDestoryed) {
            return
        }

        await this.hide()

        this.isDestroying = true

        this.detachEvents()

        this.events = []
        this.subscriptions = []

        this.isDestroying = false
        this.isDestoryed = true
        this.isRendered = false

        for (const subView of this.subViews) {
            subView.view.remove()
        }

        this.broadcast('view:remove')
    }

    public async beforeRender(): Promise<void> {
        this.broadcast('view:render:before')
        this.detachEvents()

        this.elements = []
        this.el = document.querySelector(this.selector) as HTMLElement
    }

    public async afterRender(autoshow: boolean = true): Promise<void> {
        try {
            for (const subView of this.subViews) {
                subView.view.render()
            }
            this.attachEvents()
        } catch (ex) {
            console.log(ex.message)
        }

        this.isDestoryed = false
        this.isRendered = true

        if (autoshow) {
            await this.show()
        }

        this.broadcast('view:render:after')
    }

    public async render(ev?: any): Promise<any> {
        await this.beforeRender()
        await this.content(ev)
        await this.afterRender()
    }

    public toDocumentFragment(html: string | string[]): DocumentFragment {
        if (Array.isArray(html)) {
            html = html.join('')
        }

        const template = document.createElement('template')
        template.innerHTML = html
        return template.content as DocumentFragment
    }
}