import { AbstractButtonView } from '../lib/index';
export declare class UnlockIconButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private init;
    private style;
    constructor(selector: string, style?: string);
    private unlock;
    content(ev: any): Promise<DocumentFragment>;
    render: (ev: any) => Promise<void>;
}
