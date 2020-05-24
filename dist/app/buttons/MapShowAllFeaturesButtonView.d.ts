import { AbstractButtonView } from '../lib/index';
export declare class MapShowAllFeaturesButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private style;
    constructor(selector: string, style?: string);
    private showAll;
    content(ev?: any): Promise<DocumentFragment>;
}
