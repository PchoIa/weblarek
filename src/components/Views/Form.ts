import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IForm {
    isValid: boolean;
    errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);
        this.formElement = container;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.formElement.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    set isValid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    protected abstract onSubmit(): void;
}