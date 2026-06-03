import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { IForm, Form } from "./Form";
import { OrderAddressChangeEventParams, OrderPaymentChangeEventParams } from "../../types";

interface IFormOrder extends IForm {
    payment: string | null;
    address: string;
}

export class FormOrder extends Form<IFormOrder> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected addressField: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressField = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.buttonCard.addEventListener('click', () => {
            this.events.emit<OrderPaymentChangeEventParams>('order:payment-change', {
                payment: 'card',
            });
        });

        this.buttonCash.addEventListener('click', () => {
            this.events.emit<OrderPaymentChangeEventParams>('order:payment-change', {
                payment: 'cash'
            });
        });

        this.addressField.addEventListener('input', () => {
            this.events.emit<OrderAddressChangeEventParams>('order:address-change', {
                address: this.addressField.value
            });
        });
    }

    set payment(value: string | null) {
        this.buttonCard.classList.toggle('button_alt-active', value === 'card');
        this.buttonCash.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressField.value = value;
    }

    protected onSubmit(): void {
        this.events.emit('order:submit');
    }
}