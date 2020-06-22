import { AbstractView } from '../lib';
export declare class PageView extends AbstractView {
    name: string;
    selector: string;
    content(ev: any): Promise<void>;
    private body;
}
