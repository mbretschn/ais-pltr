import { AbstractButtonView } from '../lib/index';
export declare class LoginIconButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private init;
    private text;
    constructor(selector: string);
    private update;
    private showHelp;
    content(): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
