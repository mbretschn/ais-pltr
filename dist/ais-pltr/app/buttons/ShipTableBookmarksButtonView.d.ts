import { AbstractButtonView } from '../lib';
export declare class ShipTableBookmarksButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    init: boolean;
    private _filter;
    constructor(selector: string);
    private filter;
    content(ev?: any): Promise<DocumentFragment>;
}
