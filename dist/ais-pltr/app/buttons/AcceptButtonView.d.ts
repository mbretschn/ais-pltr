import { AbstractView, AbstractButtonView } from '../lib/index';
export declare class AcceptButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private view;
    private isDisabled;
    constructor(selector: string, text: string, view: AbstractView);
    set disable(isDisabled: boolean);
    close: () => Promise<void>;
    content(): Promise<DocumentFragment>;
}
