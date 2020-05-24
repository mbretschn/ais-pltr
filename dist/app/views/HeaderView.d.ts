import { AbstractView } from '../lib';
export declare class HeaderView extends AbstractView {
    name: string;
    selector: string;
    el: HTMLDivElement;
    private waitState;
    constructor();
    private unsetWaitState;
    private setWaitState;
    render(): Promise<void>;
    content(): Promise<void>;
    private header;
}
