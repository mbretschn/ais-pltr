import { default as Dropzone } from 'dropzone'
import { v4 as uuidv4 } from 'uuid'
import { Ship } from 'ais-tools'
import { AbstractView, auth } from '../lib'
import { default as Swal } from 'sweetalert2/src/sweetalert2.js'

export class ShipImageView extends AbstractView {
    public name: string = 'ShipImageView'
    public selector: string

    private replace: string
    private class: string
    private uuid: string
    private ship: Ship
    private dropzone?: Dropzone

    constructor(selector: string, ship: Ship) {
        super()
        this.ship = ship
        this.selector = selector
        this.uuid = uuidv4()
        this.class = `dropzone-${this.uuid}`
        this.replace = `.${this.class}`

        this.subscribe('ship:image:success', this.render)
        this.subscribe(`response:login`, this.render)
    }

    public preRender(): string {
        return `<form class="${this.class}"></form>`
    }

    private update = () => {
        this.broadcast('ship:image:success')
    }

    private error = (file, message) => {
        auth.logout()

        Swal.fire({
            icon: 'error',
            title: 'Not successful',
            text: message
        })

        this.render()
    }

    public attachEvents(): boolean {
        if (auth.isLogin) {
            this.dropzone = new Dropzone(this.element(this.replace, true), {
                url: '/api/image',
                clickable: false,
                headers: auth.header
            })
            this.dropzone.on('success', this.update)
            this.dropzone.on('error', this.error)
        }

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        if (this.dropzone) {
            this.dropzone.off('success', this.update)
            this.dropzone.off('error', this.error)
            this.dropzone.destroy()
        }

        return super.detachEvents()
    }

    async image(): Promise<string[]> {
        let html: string[] = []

        const res = await fetch('/api/image/' + this.ship.MMSI)

        if (res.ok) {
            const image = await res.json()
            html.push(`<div class="mdc-card__media mdc-card__media--16-9 mdc-card__${this.ship.MMSI}" style="background-image: url(&quot;${image.url}&quot;);">`)
            const p = image.query.pages
            const k = Object.keys(p)
            const d = p[k[0]].imageinfo[0].extmetadata
            const f = image.query.normalized[0].from
            const a = d.Artist.value.replace(/<\/?[^>]+(>|$)/g, "")
            const artist = a.length < 30 && d.Artist.value || `<a href="https://de.wikipedia.org/wiki/${f}">wikipedia</a>`
            const url = d.LicenseUrl && `<a href="${d.LicenseUrl.value}">${d.LicenseShortName.value}</a>` || d.LicenseShortName.value
            html.push(`<div class="leaflet-control-attribution leaflet-control unselectable">© ${artist}, ${url}</div>`)
            html.push(`</div>`)
        } else {
            throw new Error('Ship Image not found')
        }

        return html
    }

    async content(): Promise<DocumentFragment> {
        let html: string[] = []
        html.push(`<form class="dropzone ${this.class}">`)
        html.push(`<input type="hidden" name="mmsi" value="${this.ship.MMSI}">`)
        try {
            html = html.concat(await this.image())
            html.push(`<div class="dz-default dz-message"></div>`)
        } catch (ex) {
            html.push(`<div class="dz-default dz-message">`)
            if (auth.isLogin) {
                html.push(`<button class="dz-button" type="button">Drop files here to upload</button>`)
            } else {
                html.push(`<button class="dz-button" type="button">You need privileges to add a new picture</button>`)
            }
            html.push(`</div>`)
        }
        html.push(`</form>`)

        return this.toDocumentFragment(html)
    }

    public render = async (): Promise<void> => {
        await this.beforeRender()

        this.element(this.replace).replaceWith(await this.content())
        try {
            this.element('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
        } catch (ex) {
            if (!this.isDestoryed && !this.isDestroying) {
                console.error(ex)
            }
        }

        await this.afterRender()
    }
}