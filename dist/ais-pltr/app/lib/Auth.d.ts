/// <reference types="node" />
export declare class Auth {
    timeout?: NodeJS.Timeout;
    get isLogin(): boolean;
    get header(): any;
    constructor();
    private init;
    private setRefreshTimeout;
    private verify;
    private refresh;
    private responseLogin;
    private responseIsAuth;
    login(user?: string, pass?: string): Promise<any>;
    logout: () => void;
}
export declare const auth: Auth;
