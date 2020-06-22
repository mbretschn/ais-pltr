import { AbstractButtonView } from '../lib/index';
export declare class HelpIconButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private init;
    private shown;
    constructor(selector: string);
    private update;
    private showHelp;
    content(): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
