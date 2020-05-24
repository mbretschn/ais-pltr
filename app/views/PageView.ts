import { AbstractView } from '../lib'

export class PageView extends AbstractView {
    public name: string = 'Page'
    public selector: string = 'body'

    public async content(ev: any): Promise<void> {
        this.el.prepend(this.body())
    }

    private body = (): DocumentFragment => {
        const html: string[] = []

        html.push(`<aside class="mdc-drawer mdc-drawer--modal mdc-top-app-bar--fixed-adjust"></aside>
            <header class="mdc-top-app-bar app-bar"></header>
            <div class="mdc-drawer-scrim"></div>
            <main class="main-content">
                    <div class="map"></div>
                    <div class="data-table-container shipdata"></div>
                    <div class="data-table-container positions"></div>
                    <div class="dialog shipdata__details"></div>
                    <div class="dialog help"></div>
                    <div class="dialog alert"></div>
                    <!--div class="mdc-top-app-bar--fixed-adjust"></div-->
            </main>
            <div class="mdc-dialog exceed"></div>`)

        return this.toDocumentFragment(html)
    }
}