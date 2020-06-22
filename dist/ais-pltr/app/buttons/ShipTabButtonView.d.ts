import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class ShipTabButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isShown: boolean;
    ship: Ship;
    constructor(selector: string, ship: Ship);
    private dataShown;
    private dataHidden;
    private showShipdata;
    content(ev?: any): Promise<DocumentFragment>;
}
