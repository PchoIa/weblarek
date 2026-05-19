import type { IBuyer, TBuyerData, TBuyerErrors, TBuyerField, TPayment } from '../../types';

export class Buyer {
    private data: TBuyerData = {};

    setBuyerData(data: TBuyerData): void {
        this.data = {
            ...this.data,
            ...data,
        };
    }

    setPayment(payment: TPayment): void {
        this.setBuyerData({ payment });
    }

    setAddress(address: string): void {
        this.setBuyerData({ address });
    }

    setEmail(email: string): void {
        this.setBuyerData({ email });
    }

    setPhone(phone: string): void {
        this.setBuyerData({ phone });
    }

    getBuyerData(): TBuyerData {
        return { ...this.data };
    }

    clearBuyerData(): void {
        this.data = {};
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

    getOrderBuyerData(): IBuyer | null {
        return this.isValid()
            ? this.data as IBuyer
            : null;
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
