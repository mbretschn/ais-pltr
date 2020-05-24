import { AbstractButtonView } from '../lib/index';
export declare class ShowDrawerButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    constructor(selector: string);
    zoomIn: () => void;
    content(ev?: any): Promise<DocumentFragment>;
}
