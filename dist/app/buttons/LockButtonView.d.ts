import { AbstractButtonView } from '../lib/index';
import { Ship } from 'ais-tools';
export declare class LockButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    ship: Ship;
    private init;
    private locked;
    constructor(selector: string, ship: Ship);
    private update;
    private toggleLock;
    content(): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
