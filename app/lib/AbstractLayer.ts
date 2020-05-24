import { AbstractView } from './AbstractView'

export abstract class AbstractLayer extends AbstractView {
    public async hide(): Promise<void> { }
    public async show(): Promise<void> { }
}