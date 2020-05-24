import { AbstractButtonView } from '../lib/index';
export declare class ShipTableButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isShown: boolean;
    private style;
    constructor(selector: string, style?: string);
    private tableShown;
    private tableHidden;
    private showTable;
    content(): Promise<DocumentFragment>;
}
