import { AbstractLayer } from '../lib';
export declare class DrawerView extends AbstractLayer {
    name: string;
    selector: string;
    private drawer?;
    constructor();
    private toggleDrawer;
    private drawerClose;
    content(): Promise<void>;
    private aside;
    render(): Promise<void>;
}
