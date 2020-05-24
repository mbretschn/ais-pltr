import { INmeaShipdataDB, ShipCollection, INmeaModel, INmeaShipdata } from 'ais-tools'
import { AbstractView } from '../lib'
import { CloseIconButtonView, ShipTableBookmarksButtonView } from '../buttons'

export class ShipTableView extends AbstractView {
    public name: string = 'ShipTableView'
    public selector: string = '.shipdata.data-table-container'

    private collection: ShipCollection
    private format: string = 'HH:mm:ss'
    private idx: number = 0
    private f: string = ''

    private fields: any[keyof INmeaShipdataDB] = [
        'MMSI', 'Name', 'Destination', 'ETA', 'ShipType', 'TimeStamp', 'CreatedBy'
        // 'CreatedAt', 'CallSign', 'Sender', 'PositionType', 'DimA', 'DimB', 'DimC', 'IMOnumber', 'DimD', 'Draught', 'TimeStamp', 'AIS', 'AISversion', 'Channel', 'Revision', '_id'
    ]

    private asc: boolean = false

    public show = async (): Promise<void> => {
        return this._show('zoomIn')
    }

    public hide = async (): Promise<void> => {
        return this._hide('zoomOut')
    }

    constructor(collection: ShipCollection) {
        super()
        this.collection = collection

        this.register('keyup', 'input.field-search-input', this.filter)
        this.register('click', '.start-search', this.filter)
        this.register('click', '.clear-search', this.clearFilter)
        this.register('click', 'thead', this.order)
        this.register('click', 'tbody', this.selected)

        this.subscribe('ships:table', this.show)
        this.subscribe('ships:filter', this.setFilter)
        this.subscribe('map:clicked', this.close)

        this.add('close', new CloseIconButtonView(this.selector, this))
        this.add('bookmarks', new ShipTableBookmarksButtonView(this.selector))
    }

    public close = async (): Promise<void> => {
        if (this.isShown) {
            await this.hide()
        }
    }

    private compare(values: string[]): boolean {
        values.unshift('')

        const f = this.f.toUpperCase().split(',').filter(item => item.length > 0)

        return f.length === 0 || f.some(item => values.join(',').indexOf(item) > 0)
    }

    private clearFilter = () => {
        const input = this.element('input.field-search-input') as HTMLInputElement
        input.value = ''
        this.filter()
    }

    private setFilter = (ev: any) => {
        const input = this.element('input.field-search-input') as HTMLInputElement
        input.value = ev.detail.filter
        this.filter()
    }

    private filter = () => {
        const body = this.element('tbody')
        const input = this.element('input.field-search-input') as HTMLInputElement
        const filter = input.value.trim()

        if (filter.length < 1) {
            this.f = filter
            this.broadcast('ships:filtered', { filter: this.f })
            this.element('.start-search').classList.remove('hidden')
            this.element('.clear-search').classList.add('hidden')

            const tr = body.getElementsByTagName('tr')
            for (let i = 0; i < tr.length; i++) {
                tr[i].style.display = ''
            }

            return
        }

        this.f = filter
        this.broadcast('ships:filtered', { filter: this.f })
        this.element('.start-search').classList.add('hidden')
        this.element('.clear-search').classList.remove('hidden')

        const tr = body.getElementsByTagName('tr')
        for (let i = 0; i < tr.length; i++) {
            const cr = tr[i]

            const tds: HTMLCollectionOf<HTMLTableDataCellElement> = cr.getElementsByTagName('td') as HTMLCollectionOf<HTMLTableDataCellElement>

            const ins: string[] = []
            for (let j = 0; j < tds.length; j++) {
                ins.push(tds[j].innerHTML.toUpperCase())
            }

            cr.style.display = 'none'
            if (this.compare([ins[1],ins[2],ins[5]])) {
                cr.style.display = ''
            }
        }
    }

    private order = (ev: MouseEvent): void => {
        const target = ev.target as HTMLElement
        const th = target.closest('th')

        if (!th || !th.parentNode) {
            return
        }

        const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent

        const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx))


        const table: HTMLTableElement = th.closest('table') as HTMLTableElement
        const tbody: HTMLTableSectionElement = table.querySelector('tbody') as HTMLTableSectionElement

        Array.from(tbody.querySelectorAll('tr'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => tbody.appendChild(tr))
    }

    private selected = async (ev: MouseEvent): Promise<void> => {
        const target = ev.target as HTMLElement
        const tr = target.closest('tr[data-mmsi]') as HTMLElement

        const mmsi: number = Number(tr.dataset.mmsi)
        try {
            const ship = await this.collection.findByMMSI(mmsi, { cache: true, force: false })
            if (ship) {
                this.broadcast('position:selected', { position: ship.position })
                this.broadcast('ship:selected', { ship })
            }
        } catch (ex) { 
            alert('The Ship has not send a position, yet.')
        }
    }

    private animate = (data: INmeaModel) => {
        try {
            let tr = this.element(`tr[data-mmsi="${data.MMSI}"]`)
            tr.classList.add('animated', 'flash')
            tr.addEventListener('animationend', () => tr.classList.remove('animated', 'flash'), { once: true })
        } catch (ex) {
            // console.log('add position', ex.message)
        }
    }

    private addShip = async (data: INmeaShipdata) => {
        try {
            data.position

            try {
                const old = this.element(`tr[data-mmsi="${data.MMSI}"]`)
                old.replaceWith(this.row(data, Number(old.dataset.idx)))
            } catch (ex) {
                this.element('tbody').append(this.row(data, ++this.idx))
            }

            const replaced = this.element(`tr[data-mmsi="${data.MMSI}"]`, true)

            if (!this.compare([ data.Name, data.format('ShipType'), String(data.MMSI) ])) {
                replaced.style.display = 'none'
            } else {
                this.animate(data)
            }
        } catch (ex) {
            // console.log('add ship', ex.message)
        }
    }

    public attachEvents(): boolean {
        this.collection.on('ship', this.addShip)
        this.collection.on('position', this.animate)

        return super.attachEvents()
    }

    public detachEvents(): boolean {
        this.collection.off('ship', this.addShip)
        this.collection.off('position', this.animate)

        return super.detachEvents()
    }

    private table(): DocumentFragment {
        const html: string[] = []
        html.push(`<header class="mdc-top-app-bar">`)
        html.push(`<div class="mdc-top-app-bar__row">`)
        html.push(`<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">`)
        html.push(`<span class="mdc-top-app-bar__title">SHIP DATA</span>`)
        html.push(`</section>`)
        html.push(`<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">`)
        html.push(this.get('bookmarks').preRender())
        html.push(`<label class="mdc-text-field mdc-text-field mdc-text-field--filled mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--with-trailing-icon field-search">`)
        html.push(`<input class="mdc-text-field__input field-search-input" aria-label="Search Ship Data" type="text">`)
        html.push(`<i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing start-search" tabindex="0" role="button">search</i>`)
        html.push(`<i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing clear-search hidden" tabindex="0" role="button">clear</i>`)
        html.push(`<div class="mdc-line-ripple"></div>`)
        html.push(`</label>`)
        html.push(this.get('close').preRender())
        html.push(`</section>`)
        html.push(`</div>`)
        html.push(`</header>`)
        html.push(`<div class="mdc-data-table data-table">`)
        html.push(`<table class="mdc-data-table__table" aria-label="Nmea Shipdata">`)
        html.push(`<thead>`)
        html.push(`<tr class="mdc-data-table__header-row unselectable">`)
        html.push(`<th class="mdc-data-table__header-cell shipdata-Ind">#</th>`)
        for (const field of this.fields) {
            html.push(`<th class="mdc-data-table__header-cell shipdata-${field}" role="columnheader" scope="col">${field}</th>`)
        }
        html.push(`</tr>`)
        html.push(`</thead>`)
        html.push(`<tbody class="mdc-data-table__content"></tbody>`)
        html.push(`</table>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    private row(shipdata: INmeaShipdata, idx: number): DocumentFragment {
        const html: string[] = []
        html.push(`<tr data-idx="${idx}" data-row-id="${shipdata._id}" data-mmsi="${shipdata.MMSI}" class="mdc-data-table__row positions-data-row">`)
        html.push(`<td class="mdc-data-table__cell shipdata-Ind">${idx}</td>`)

        for (const field of this.fields) {
            if ('TimeStamp,CreatedAt,UpdatedAt'.indexOf(field) >= 0) {
                html.push(`<td class="mdc-data-table__cell shipdata-${field}">${shipdata.format(field, this.format)}</td>`)
            } else {
                html.push(`<td class="mdc-data-table__cell shipdata-${field}">${shipdata.format(field)}</td>`)
            }
        }

        html.push(`</tr>`)

        return this.toDocumentFragment(html)
    }

    public content = async (): Promise<void> => {
        this.el.innerHTML = ''
        this.el.prepend(this.table())

        const body = this.element('tbody')
        for (let item of this.collection) {
            this.idx++
            try {
                body.append(this.row(item, this.idx))
            } catch (ex) {
                console.log('init', ex.message)
            }
        }
    }

    public async render(): Promise<any> {
        await this.beforeRender()
        await this.content()
        await this.afterRender(false)
    }
}
