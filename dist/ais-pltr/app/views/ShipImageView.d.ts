import { Ship } from 'ais-tools';
import { AbstractView } from '../lib';
export declare class ShipImageView extends AbstractView {
    name: string;
    selector: string;
    private replace;
    private class;
    private uuid;
    private ship;
    private dropzone?;
    constructor(selector: string, ship: Ship);
    preRender(): string;
    private update;
    private error;
    attachEvents(): boolean;
    detachEvents(): boolean;
    image(): Promise<string[]>;
    content(): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
