import { AbstractView } from '../lib'
import { ShowDrawerButtonView, MapZoomInButtonView, MapZoomOutButtonView, HelpIconButtonView, UnlockIconButtonView, BookmarksButtonView, LoginIconButtonView } from '../buttons'

export class HeaderView extends AbstractView {
    public name: string = 'Header'
    public selector: string = 'header'
    public el: HTMLDivElement = document.createElement('div')

    private waitState: number = 0

    constructor() {
        super()

        this.add('menu', new ShowDrawerButtonView(this.selector))
        this.add('zoomIn', new MapZoomInButtonView(this.selector))
        this.add('zoomOut', new MapZoomOutButtonView(this.selector))
        this.add('lock', new UnlockIconButtonView(this.selector))
        this.add('bookmarks', new BookmarksButtonView(this.selector))
        this.add('help', new HelpIconButtonView(this.selector))
        this.add('login', new LoginIconButtonView(this.selector))

        this.subscribe('view:showing', this.setWaitState)
        this.subscribe('view:hiding', this.setWaitState)
        this.subscribe('view:shown', this.unsetWaitState)
        this.subscribe('view:hidden', this.unsetWaitState)

        this.subscribe('set:waitstate', this.setWaitState)
        this.subscribe('unset:waitstate', this.unsetWaitState)
    }

    private unsetWaitState = () => {
        this.waitState--
        if (this.waitState === 0) {
            this.element('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
        }
    }

    private setWaitState = () => {
        if (this.waitState === 0) {
            this.element('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
        }
        this.waitState++
    }

    public async render(): Promise<void> {
        this.waitState = 0

        this.el = document.querySelector(this.selector) as HTMLDivElement

        this.beforeRender()

        await this.content()

        await this.afterRender()
    }

    public async content(): Promise<void> {
        this.el.prepend(this.header())
    }

    private header = (): DocumentFragment => {
        const html: string[] = []

        html.push(`<div class="mdc-top-app-bar__row">
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">`)

        html.push(this.get('menu').preRender())

        html.push(`<span class="mdc-top-app-bar__title">AIS PLTR</span>
            </section>
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">`)

        html.push(this.get('zoomIn').preRender())
        html.push(this.get('zoomOut').preRender())
        html.push(this.get('lock').preRender())
        html.push(this.get('bookmarks').preRender())
        html.push(this.get('help').preRender())
        html.push(this.get('login').preRender())

        html.push(`</section>
            </div>
            <div role="progressbar" class="mdc-linear-progress" aria-valuemin="0"
                aria-valuemax="1" aria-valuenow="0">
                <div class="mdc-linear-progress__buffer"></div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
            </div>`)

        return this.toDocumentFragment(html)
    }
}