import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class PositionTabButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isShown: boolean;
    ship: Ship;
    constructor(selector: string, ship: Ship);
    private positionShown;
    private positionHidden;
    private showShipdata;
    content(ev?: any): Promise<DocumentFragment>;
}
