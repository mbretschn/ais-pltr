import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class TrackButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    ship: Ship;
    private init;
    private wait;
    private has;
    constructor(selector: string, ship: Ship);
    private enable;
    private update;
    private toggleTrack;
    content(ev?: any): Promise<DocumentFragment>;
    render: (ev?: any) => Promise<void>;
}
