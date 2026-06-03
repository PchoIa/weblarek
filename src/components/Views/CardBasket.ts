import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICard, Card } from "./Card";

export interface ICardBasket extends ICard {
  index: number;
}

interface ICardBasketActions {
  onDelete: () => void;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement, actions?: ICardBasketActions) {
    super(events, container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}