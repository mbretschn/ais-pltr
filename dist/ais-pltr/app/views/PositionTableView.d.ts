import { Ship, INmeaPosition } from 'ais-tools';
import { AbstractView } from '../lib';
export declare class PositionTableView extends AbstractView {
    name: string;
    selector: string;
    ship: Ship;
    private q;
    private format;
    private idx;
    private interrupt;
    private timeoutID;
    private last;
    private _fields;
    show: () => Promise<void>;
    hide: () => Promise<void>;
    constructor(ship: Ship);
    close: () => Promise<void>;
    private queueCB;
    scroll: (ev: any) => void;
    queue: (position: INmeaPosition) => void;
    selected: (ev: any) => Promise<void>;
    content: () => Promise<void>;
    table(): Promise<DocumentFragment>;
    private row;
    attachEvents(): boolean;
    detachEvents(): boolean;
    render: () => Promise<void>;
    remove(): Promise<void>;
}
