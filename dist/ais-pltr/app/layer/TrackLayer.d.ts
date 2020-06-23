import { Color, Ship, NmeaPositionFeature } from 'ais-tools';
import { AbstractLayer } from '../lib/index';
import { MapView } from '../views';
export declare class TrackLayer extends AbstractLayer {
    name: string;
    selector: string;
    ship: Ship;
    private map;
    private layer?;
    constructor(ship: Ship, map: MapView);
    private title;
    private onEachFeature;
    private style;
    addFragment: (position: NmeaPositionFeature) => Promise<void>;
    attachEvents(): boolean;
    detachEvents(): boolean;
    remove(): Promise<void>;
    content(color: Color): Promise<void>;
}
