import { AbstractButtonView } from '../lib/index';
export declare class BookmarksButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    private init;
    private menu?;
    private style;
    constructor(selector: string, style?: string);
    private selected;
    private bookmarks;
    content(ev?: any): Promise<DocumentFragment>;
    render: () => Promise<void>;
}
