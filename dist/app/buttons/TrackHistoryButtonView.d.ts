import { AbstractButtonView } from '../lib/index';
export declare class TrackHistoryButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private init;
    private locked;
    constructor(selector: string);
    private update;
    private toggleLock;
    content(): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
