import { default as moment } from 'moment'

export class Auth {
    timeout?: NodeJS.Timeout

    public get isLogin(): boolean {
        return !!sessionStorage.getItem('access')
    }

    public get header(): any {
        return {
            Authorization: "Bearer " + sessionStorage.getItem('access')
        }
    }

    constructor() {
        document.addEventListener('request:login', this.responseLogin, false)
        document.addEventListener('request:logout', this.logout, false)
        this.init()
    }

    private async init(): Promise<void> {
        await this.verify()
        this.setRefreshTimeout()
    }

    private setRefreshTimeout(): void {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        if (!!sessionStorage.getItem('access')) {
            const now = moment()
            const timeout = moment.unix(Number(sessionStorage.getItem('exp')))
            const diff = timeout.diff(now) - 10000
            if (diff < 1) {
                return this.logout()
            }
            this.timeout = setTimeout(this.refresh, diff)
        }
    }

    private verify = async (): Promise<any> => {
        if (!!sessionStorage.getItem('access')) {
            const res = await fetch('/auth/verify', {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Token: sessionStorage.getItem('access')
                })
            })

            if (!res.ok) {
                this.logout()
            }
        }
    }

    private refresh = async (): Promise<void> => {
        const res = await fetch('/auth/refresh', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: sessionStorage.getItem('username'),
                Token: sessionStorage.getItem('refresh')
            })
        })

        if (res.ok) {
            const tokens = await res.json()
            for (const key of Object.keys(tokens)) {
                sessionStorage.setItem(key, tokens[key]);
            }
            this.setRefreshTimeout()
            this.responseIsAuth()
        } else {
            this.logout()
        }
    }

    private responseLogin = (): void => {
        this.responseIsAuth()
    }

    private responseIsAuth = (): void => {
        document.dispatchEvent(new CustomEvent('response:login', { detail: this.isLogin }))
    }

    public async login (user?: string, pass?: string): Promise<any> {
        const res = await fetch('/auth/login', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: user,
                Password: pass
            })
        })

        if (res.ok) {
            const tokens = await res.json()
            for (const key of Object.keys(tokens)) {
                sessionStorage.setItem(key, tokens[key]);
            }
            this.setRefreshTimeout()
            this.responseIsAuth()
        }

        return res
    }

    public logout = (): void => {
        sessionStorage.clear()
        this.setRefreshTimeout()
        this.responseIsAuth()
    }
}

export const auth = new Auth()