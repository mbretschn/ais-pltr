import { AbstractView } from '../lib';
export declare class HelpView extends AbstractView {
    name: string;
    selector: string;
    private presentations;
    private timeouts;
    private frame;
    private timeout;
    private interrupt;
    private clicked;
    private slideSpeed;
    constructor();
    private hideSlide;
    private showSlide;
    private setFrame;
    private selectedFrame;
    private next;
    show: () => Promise<void>;
    hide: () => Promise<void>;
    close: () => Promise<void>;
    content: () => Promise<void>;
    private help;
    attachEvents(): boolean;
    detachEvents(): boolean;
}
