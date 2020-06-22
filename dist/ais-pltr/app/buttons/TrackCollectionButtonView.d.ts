import { AbstractButtonView } from '../lib/index';
export declare class TrackCollectionButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private style;
    constructor(selector: string, style?: string);
    private update;
    private showPanel;
    content(ev: any): Promise<DocumentFragment>;
}
