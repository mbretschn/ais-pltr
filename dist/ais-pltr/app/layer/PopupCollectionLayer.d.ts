import { ShipCollection, Ship, NmeaPositionFeature } from 'ais-tools';
import { AbstractLayer } from '../lib/index';
import { MapView } from '../views/index';
export declare class PopupCollectionLayer extends AbstractLayer {
    name: string;
    selector: string;
    private collection;
    private popups;
    private map;
    constructor(collection: ShipCollection, map: MapView);
    private getLocation;
    addPositionPopup: (ev: any) => Promise<void>;
    addShipPopup: (ev: any) => Promise<void>;
    removePopup: (popup: any, updateCollection?: boolean) => void;
    removePopups: (ev?: any) => void;
    updatePopup: (popup: any, ship: Ship) => void;
    updatePopups: (data: Ship | NmeaPositionFeature) => Promise<void>;
    attachEvents(): boolean;
    detachEvents(): boolean;
    remove(): Promise<void>;
    content(): Promise<void>;
}
