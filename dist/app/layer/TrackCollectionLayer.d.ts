import { Ship } from 'ais-tools';
import { AbstractLayer } from '../lib/index';
import { MapView } from '../views';
export declare class TrackCollectionLayer extends AbstractLayer {
    name: string;
    selector: string;
    private collection;
    private map;
    private dialog?;
    constructor(mapView: MapView);
    isEmpty: () => boolean;
    hasTrackMMSI: (MMSI: number) => boolean;
    addToMap: (ev: any) => Promise<void>;
    removeFromMap(ship: Ship | number): void;
    remove(): Promise<void>;
    private listTitle;
    private listSubtitle;
    private listitemShip;
    private listitemEmpty;
    private open;
    close: () => Promise<void>;
    private selected;
    private accept;
    attachEvents(): boolean;
    detachEvents(): boolean;
    content(): Promise<void>;
    private body;
    render: () => Promise<void>;
}
