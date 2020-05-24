import { AbstractButtonView } from '../lib/index';
export declare class MapZoomOutButtonView extends AbstractButtonView {
    name: string;
    textA: string;
    textB: string;
    classList: string;
    isInit: boolean;
    constructor(selector: string);
    private zoomOut;
    content(ev?: any): Promise<DocumentFragment>;
}
