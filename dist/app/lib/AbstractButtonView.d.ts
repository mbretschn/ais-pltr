import { Ship } from 'ais-tools';
import { AbstractView } from './AbstractView';
export declare abstract class AbstractButtonView extends AbstractView {
    abstract name: string;
    abstract textA?: string;
    abstract textB?: string;
    abstract classList: string;
    selector: string;
    replace: string;
    class: string;
    uuid: string;
    ship?: Ship;
    private interrupted;
    abstract content(ev?: any): Promise<DocumentFragment>;
    constructor(selector: string, ship?: Ship);
    interrupt: () => Promise<void>;
    continue: () => Promise<void>;
    get disabled(): string;
    preRender(textA?: string, textB?: string, classList?: string): string;
    render: (ev?: any) => Promise<void>;
}
