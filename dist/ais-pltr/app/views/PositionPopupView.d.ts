import { default as L } from 'leaflet';
import { NmeaPositionFeature } from 'ais-tools';
import { AbstractLayer } from '../lib';
export declare class PositionPopupView extends AbstractLayer {
    name: string;
    selector: string;
    position: NmeaPositionFeature;
    private popup?;
    constructor(position: NmeaPositionFeature);
    content: () => Promise<DocumentFragment>;
    render(): Promise<L.Popup>;
}
