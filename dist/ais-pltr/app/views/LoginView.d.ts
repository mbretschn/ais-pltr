import { AbstractView } from '../lib/index';
export declare class LoginView extends AbstractView {
    name: string;
    selector: string;
    private usernameField?;
    private passwordField?;
    private progressBar?;
    constructor();
    validate: () => void;
    show: () => Promise<void>;
    hide: () => Promise<void>;
    close: (timed?: boolean | undefined) => Promise<void>;
    accept: () => Promise<void>;
    render(ev?: any): Promise<any>;
    content(): Promise<void>;
    private body;
}
