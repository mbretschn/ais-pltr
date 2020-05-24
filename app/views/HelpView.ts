import { AbstractView } from '../lib'
import { CloseIconButtonView } from '../buttons'

export class HelpView extends AbstractView {
    public name: string = 'HelpView'
    public selector: string = '.dialog.help'
    private presentations: string[] = [
        'https://docs.google.com/presentation/d/e/2PACX-1vTvjf7zjghay-K6lWfSazIewxhZcLYGdy4qU-Y2HUdvJtSvQyXsw3zcPcMReHmacuN6wrX7loEg4NCw/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vRbO1PU2a-fzAenxPsH9eG8sCzevo_ubX39yiIwmBbpR8SjWOaYUmM0xobbzraBq-uwrpl9YVpFBFj1/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vQL17eQze-N9sKs-8YP--P5d6voeVk1E4ga4ZqP-1sjEDaQImbkfWtdDm4yIAbjQabf4IBkDOGM8L6X/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vTHSNClA0SEYFeVIsu5UvCFAxJ8irznJY-Qrr7tXnkmWrjQLBsN3oKp07mWYPHi_Aq-sOnockImiB62/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vTapn9WIzkBczRigpWkjGQAWFUZCkhIb7wezd_j_eVMJflfbIvGDXQgl-MricpRao931wdZZjz_1LOo/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vRVAKVYaN0zolqX3lAhfx4hDQIBAWpKLOtVNe6AxzBL3U4Hoi3s2B0SUeyxk93F77SqwiQRDztiZSCA/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vQt_Dt4_YD81Y2lM-u3q3VEPXmeeHXhEa6hOo2lQqfVa9dzHiUuEziRS9Wul_mPfzOcZMEKAkvEJegN/embed?start=true&loop=true&rm=minimal',
        'https://docs.google.com/presentation/d/e/2PACX-1vToUy308GT61i8oHNfoZv85Ttug2VkMxi3D-HTG-SRsMlfQ5zMos7jXGGTSgmfXgarRvFHqFruuNqgI/embed?start=true&loop=true&rm=minimal'
    ]
    private timeouts: number[] = [
        10000, 18000, 23000, 20000, 20000, 18000, 22000, 22000
    ]
    private frame: number = 0
    private timeout: any
    private interrupt: boolean = false
    private clicked: boolean = false
    private slideSpeed: string = 'faster'

    constructor() {
        super()
        this.frame = 0
        this.add('close', new CloseIconButtonView(this.selector, this))
        this.register('change', '.dialog.help .help-links', this.selectedFrame)
    }

    private hideSlide = async (el: HTMLIFrameElement): Promise<void> => {
        return new Promise(resolve => {
            el.addEventListener('animationend', () => {
                el.style.display = 'none'
                el.classList.remove('animated', 'fadeOut', this.slideSpeed)
                el.src = el.src
                resolve()
            }, { once: true })

            el.classList.add('animated', 'fadeOut', this.slideSpeed)
        })
    }

    private showSlide = async (el: HTMLIFrameElement): Promise<void> => {
        return new Promise(resolve => {
            el.addEventListener('animationend', () => {
                el.classList.remove('animated', 'fadeIn', this.slideSpeed)
                resolve()
            }, { once: true })

            el.classList.add('animated', 'fadeIn', this.slideSpeed)
            el.style.display = 'block'
        })
    }

    private setFrame = async (frame: number): Promise<void> => {
        const cur = this.element(`#slide-${this.frame}`) as HTMLIFrameElement
        const nxt = this.element(`#slide-${frame}`) as HTMLIFrameElement

        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = undefined
        }

        await this.hideSlide(cur)
        await this.showSlide(nxt)

        if (!this.clicked) {
            this.timeout = setTimeout(this.next, this.timeouts[frame])
        }

        this.element(`#radio-${this.frame}`).removeAttribute('checked')
        this.element(`#radio-${frame}`).setAttribute('checked', 'checked')

        this.frame = frame
        this.interrupt = false
    }

    private selectedFrame = (ev: any): void => {
        this.clicked = true

        if (this.interrupt) {
            return
        }

        const frame = ev.target.dataset.frame

        if (frame !== this.frame) {
            this.setFrame(frame)
        }
    }

    private next = async (): Promise<void> => {
        let frame = this.frame
        if (frame < this.presentations.length - 1) {
            frame = frame + 1
        } else {
            frame = 0
        }
        this.interrupt = true
        this.setFrame(frame)
    }

    public show = async (): Promise<void> => {
        this.el.style.display = 'block'
        await this._show('zoomIn', this.element('.help-container'))
    }

    public hide = async (): Promise<void> => {
        await this._hide('zoomOut', this.element('.help-container'))
        this.el.style.display = 'none'
    }

    public close = async (): Promise<void> => {
        await this.remove()
        this.el.innerHTML = ''
    }

    public content = async (): Promise<void> => {
        this.el.prepend(await this.help())
    }

    private async help(): Promise<DocumentFragment> {
        let html: string[] = []

        html.push(`<div class="help-container">`)
        html.push(`<div class="presentation">`)
        for (let idx=0; idx < this.presentations.length; idx++) {
            // const display = this.frame !== idx ? ' style="display: none;"' : ''
            const display = ' style="display: none;"'
            html.push(`<iframe src="${this.presentations[idx]}" id="slide-${idx}" frameborder="0" width="750" height="570"${display}></iframe>`)
        }
        html.push(`</div>`)
        html.push(this.get('close').preRender())
        html.push(`<div class="help-links">`)
        for (let idx=0; idx < this.presentations.length; idx++) {
            const checked = this.frame === idx ? ' checked' : ''
            html.push(`<div class="mdc-form-field">
                <div class="mdc-radio">
                    <input class="mdc-radio__native-control" type="radio" id="radio-${idx}" data-frame="${idx}" name="radios"${checked}>
                    <div class="mdc-radio__background">
                    <div class="mdc-radio__outer-circle"></div>
                    <div class="mdc-radio__inner-circle"></div>
                    </div>
                    <div class="mdc-radio__ripple"></div>
                </div>
            </div>`)
        }
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }

    public attachEvents(): boolean {
        this.broadcast('view:showing')
        const cur = this.element(`#slide-${this.frame}`) as HTMLIFrameElement
        cur.addEventListener('load', async () => {
            this.broadcast('view:shown')
            await this.showSlide(cur)
            this.timeout = setTimeout(this.next, this.timeouts[this.frame])
        }, { once: true })
        return super.attachEvents()
    }

    public detachEvents(): boolean {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        return super.detachEvents()
    }
}
