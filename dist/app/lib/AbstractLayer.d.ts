import { AbstractView } from './AbstractView';
export declare abstract class AbstractLayer extends AbstractView {
    hide(): Promise<void>;
    show(): Promise<void>;
}
