import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class PositionsButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isShown: boolean;
    ship: Ship;
    constructor(selector: string, ship: Ship);
    private positionsShown;
    private positionsHidden;
    private showPositions;
    content(ev?: any): Promise<DocumentFragment>;
}
