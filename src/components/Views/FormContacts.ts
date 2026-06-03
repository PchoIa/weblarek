import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IForm, Form } from "./Form";
import { ContactsEmailChangeEventParams, ContactsPhoneChangeEventParams } from "../../types";

interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected emailField: HTMLInputElement;
    protected phoneField: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        this.emailField = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneField = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailField.addEventListener('input', () => {
            this.events.emit<ContactsEmailChangeEventParams>('contacts:email-change', {
                email: this.emailField.value
            });
        });

        this.phoneField.addEventListener('input', () => {
            this.events.emit<ContactsPhoneChangeEventParams>('contacts:phone-change', {
                phone: this.phoneField.value
            });
        });
    }

    set email(value: string) {
        this.emailField.value = value;
    }

    set phone(value: string) {
        this.phoneField.value = value;
    }

    protected onSubmit(): void {
        this.events.emit('contacts:submit');
    }
}