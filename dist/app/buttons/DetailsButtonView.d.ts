import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class DetailsButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isShown: boolean;
    ship: Ship;
    constructor(selector: string, ship: Ship);
    private detailsShown;
    private detailsHidden;
    private showDetails;
    content(ev?: any): Promise<DocumentFragment>;
}
