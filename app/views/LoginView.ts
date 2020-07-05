import { AbstractView } from '../lib/index'
import { auth } from '../lib'
import { CloseButtonView, AcceptButtonView } from '../buttons'
import { MDCTextField } from '@material/textfield'
import { MDCLinearProgress } from '@material/linear-progress'

export class LoginView extends AbstractView {
    public name: string = 'Login'
    public selector: string = '.dialog.login'
    private usernameField?: MDCTextField
    private passwordField?: MDCTextField
    private progressBar?: MDCLinearProgress

    constructor() {
        super()

        this.add('close', new CloseButtonView(this.selector, this))
        this.add('accept', new AcceptButtonView(this.selector, 'Login', this))

        this.register('change', '#username', this.validate)
        this.register('change', '#password', this.validate)
        this.register('keyup', '#username', this.validate)
        this.register('keyup', '#password', this.validate)
    }

    public validate = (): void => {
        this.element('.message').classList.remove('error', 'success')

        if (this.usernameField?.valid && this.passwordField?.valid) {
            this.get('accept').disable = false
        } else {
            this.get('accept').disable = true
        }
    }

    public show = async (): Promise<void> => {
        this.el.style.display = 'block'
        await this._show('zoomIn', this.element('.login-container'))
    }

    public hide = async (): Promise<void> => {
        await this._hide('zoomOut', this.element('.login-container'))
        this.el.style.display = 'none'
    }

    public close = async (timed?: boolean): Promise<void> => {
        if (timed && this.progressBar) {
            const p = this.progressBar
            let h: NodeJS.Timeout
            let s = 0.1
            h = setInterval(() => {
                p.progress = s
                s += 0.1
            }, 100)
            await new Promise(resolve => setTimeout(resolve, 1000))
            clearInterval(h)
        }
        await this.remove()
        this.el.innerHTML = ''
    }

    public accept = async (): Promise<void> => {
        this.element('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
        this.element('.mdc-text-field__input').setAttribute('disabled', 'disabled')
        this.get('close').disable = true
        this.get('accept').disable = true
        this.element('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')

        const res = await auth.login(this.usernameField?.value, this.passwordField?.value)

        if (res.ok) {
            this.element('.message').innerHTML = 'Login successful'
            this.element('.message').classList.add('success')
            this.close(true)
        } else {
            const message = await res.text()
            this.element('.message').innerHTML = message
            this.element('.message').classList.add('error')
            this.element('.mdc-text-field__input').removeAttribute('disabled')
            this.get('close').disable = false
        }
    }

    public async render(ev?: any): Promise<any> {
        await this.beforeRender()
        await this.content()

        this.usernameField = new MDCTextField(this.element('.username-field'))
        this.usernameField.useNativeValidation = true
        this.passwordField = new MDCTextField(this.element('.password-field'))
        this.passwordField.useNativeValidation = true
        this.progressBar = new MDCLinearProgress(this.element('.mdc-linear-progress'))

        this.get('accept').disable = true

        await this.afterRender()
    }

    public async content(): Promise<void> {
        this.el.innerHTML = ''
        this.el.prepend(this.body())
    }

    private body = (): DocumentFragment => {
        let html: string[] = []

        html.push(`<div class="login-container">`)
        html.push(`<div role="progressbar" class="mdc-linear-progress" aria-valuemin="0"
                aria-valuemax="1" aria-valuenow="0">
                <div class="mdc-linear-progress__buffer"></div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                    <span class="mdc-linear-progress__bar-inner"></span>
                </div>
            </div>`)
        html.push(`<div class="form">`)
        html.push(`<h2 class="mdc-dialog__title">Login</h2>`)
        html.push(`<ul class="mdc-list mdc-list--non-interactive">`)
        html.push(`<li class="mdc-list-item">`)
        html.push(`<div class="mdc-text-field mdc-text-field--outlined username-field">
                <input class="mdc-text-field__input" size="40" name="username" type="email" id="username" required="true" minLength="8">
                <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>
                <div class="mdc-notched-outline__notch">
                <label for="username" class="mdc-floating-label">Username</label>
                </div>
                <div class="mdc-notched-outline__trailing"></div>
                </div>
            </div>`)
        html.push(`</li>`)
        html.push(`<li class="mdc-list-item">`)
        html.push(`<div class="mdc-text-field mdc-text-field--outlined password-field">
                <input class="mdc-text-field__input" size="40" name="password" type="password" id="password" required="true" minLength="8">
                <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>
                <div class="mdc-notched-outline__notch">
                <label for="password" class="mdc-floating-label">Password</label>
                </div>
                <div class="mdc-notched-outline__trailing"></div>
                </div>
            </div>`)
        html.push(`</li>`)
        html.push(`</ul>`)
        html.push(`<p class="mdc-typography--body1 message"></p>`)
        html.push(`</div>`)
        html.push(`<div class="mdc-dialog__actions">`)
        html.push(this.get('close').preRender())
        html.push(this.get('accept').preRender())
        html.push(`</div>`)
        html.push(`</div>`)

        return this.toDocumentFragment(html)
    }
}
