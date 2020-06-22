/// <reference types="node" />
import { EventEmitter } from 'events';
export declare abstract class AbstractView extends EventEmitter {
    abstract name: string;
    abstract selector: string;
    abstract content(ev?: any): Promise<DocumentFragment | void>;
    el: HTMLElement;
    isDestroying: boolean;
    isDestoryed: boolean;
    isRendered: boolean;
    isAttached: boolean;
    isShown: boolean;
    elements: any[];
    events: any[];
    subscriptions: any[];
    subViews: any[];
    private animationSpeed;
    close: () => Promise<void>;
    refresh: () => Promise<void>;
    add(name: string, view: any): void;
    get(name: string): any;
    hide(): Promise<void>;
    show(): Promise<void>;
    _show: (animationName?: string | undefined, _el?: HTMLElement | undefined) => Promise<void>;
    _hide: (animationName?: string | undefined, _el?: HTMLElement | undefined) => Promise<void>;
    register(event: string, selector?: string | Function, callback?: Function): void;
    unsubscribe(event: any): void;
    subscribe(event: any, callback: any): void;
    broadcast(name: string, data?: any): void;
    delay(delay?: number): Promise<void>;
    element(selector: string, force?: boolean): HTMLElement;
    attachEvents(): boolean;
    detachEvents(): boolean;
    remove(): Promise<void>;
    beforeRender(): Promise<void>;
    afterRender(autoshow?: boolean): Promise<void>;
    render(ev?: any): Promise<any>;
    toDocumentFragment(html: string | string[]): DocumentFragment;
}
