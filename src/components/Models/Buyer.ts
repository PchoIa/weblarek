import type { IBuyer, TBuyerErrors, TBuyerField, TPayment } from '../../types';
import { IEvents } from "../base/Events.ts";

const initialData: IBuyer = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
}

export class Buyer {
    private data: IBuyer = {
        ...initialData,
    };

    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: TPayment) {
        this.data = { ...this.data, payment };

        this.events.emit('buyer:order-changed');
    }

    setAddress(address: string) {
        this.data = { ...this.data, address };

        this.events.emit('buyer:order-changed');
    }

    setEmail(email: string) {
        this.data = { ...this.data, email };

        this.events.emit('buyer:contacts-changed');
    }

    setPhone(phone: string) {
        this.data = { ...this.data, phone };

        this.events.emit('buyer:contacts-changed');
    }

    getBuyerData(): IBuyer {
        return { ...this.data };
    }

    clearBuyerData(): void {
        this.data = {
            ...initialData,
        };

        this.events.emit('buyer:order-changed');
        this.events.emit('buyer:contacts-changed');
    }

    validate(fields: TBuyerField[] = ['payment', 'address', 'email', 'phone']): TBuyerErrors {
        const errors: TBuyerErrors = {};

        fields.forEach((field) => {
            if (!this.data[field]) {
                errors[field] = this.getFieldError(field);
            }
        });

        return errors;
    }

    isValid(fields?: TBuyerField[]): boolean {
        return Object.keys(this.validate(fields)).length === 0;
    }

    private getFieldError(field: TBuyerField): string {
        const errors: Record<TBuyerField, string> = {
            payment: 'Не выбран вид оплаты',
            email: 'Укажите email',
            phone: 'Укажите телефон',
            address: 'Укажите адрес доставки',
        };

        return errors[field];
    }
}
