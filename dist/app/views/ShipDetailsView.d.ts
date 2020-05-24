import { Ship, INmeaShipdata, INmeaPosition } from 'ais-tools';
import { AbstractView } from '../lib';
export declare class ShipDetailsView extends AbstractView {
    name: string;
    selector: string;
    private ship;
    private format;
    private shipdataFields;
    private positionFields;
    constructor(ship: Ship);
    close: () => Promise<void>;
    stop: (ev: any) => void;
    show: () => Promise<void>;
    hide: () => Promise<void>;
    clipboard: (ev: any) => void;
    shipdata: () => void;
    position: () => void;
    animate: (model: INmeaPosition | INmeaShipdata) => void;
    content: () => Promise<void>;
    private dialog;
    detachEvents(): boolean;
    attachEvents(): boolean;
}
