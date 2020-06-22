import { ShipCollection } from 'ais-tools';
import { AbstractLayer } from '../lib/index';
import { MapView } from '../views/index';
export declare class ShipLayer extends AbstractLayer {
    name: string;
    selector: string;
    private collection;
    private map;
    private layer?;
    private _selected;
    private _lockedMMSI?;
    constructor(collection: ShipCollection, map: MapView);
    private pointToLayer;
    lockedMMSI: () => number | undefined;
    lockMMSI: (MMSI: number) => void;
    unlockMMSI: () => void;
    private title;
    private onEachFeature;
    private style;
    private update;
    private unselect;
    private selected;
    layerClicked: (ev: any) => Promise<void>;
    attachEvents(): boolean;
    detachEvents(): boolean;
    remove(): Promise<void>;
    content(): Promise<void>;
}
