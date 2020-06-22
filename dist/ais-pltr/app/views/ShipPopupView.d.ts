import { default as L } from 'leaflet';
import { Ship } from 'ais-tools';
import { AbstractLayer } from '../lib';
export declare class ShipPopupView extends AbstractLayer {
    name: string;
    selector: string;
    ship: Ship;
    private popup?;
    constructor(ship: Ship);
    clipboard: (ev: any) => void;
    content: () => Promise<DocumentFragment>;
    render(): Promise<L.Popup>;
}
