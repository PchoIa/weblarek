import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasket {
    items: HTMLElement[];
    totalPrice: number;
    isEmpty: boolean;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalPriceElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.submitButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });

        this.submitButton.disabled = true;
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set totalPrice(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.submitButton.disabled = value;
    }
}