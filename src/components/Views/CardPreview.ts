import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICard, Card } from "./Card";
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface ICardPreviewImage {
  name: string;
  altText: string;
}

export interface ICardPreview extends ICard {
  category: string;
  image: ICardPreviewImage;
  description: string;
  isInBasket: boolean;
}

interface ICardPreviewActions {
  onToggleBasket: () => void;
}

const UNAVAILABLE_BUTTON_TEXT = 'Недоступно';
const ADD_TO_BASKET_TEXT = 'В корзину';
const REMOVE_FROM_BASKET_TEXT = 'Убрать из корзины';

export class CardPreview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected toggleBasketButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement, actions?: ICardPreviewActions) {
    super(events, container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.toggleBasketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onToggleBasket) {
      this.toggleBasketButton.addEventListener('click', actions?.onToggleBasket);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach((key) => {
      const categoryKey = key as keyof typeof categoryMap;

      this.categoryElement.classList.toggle(categoryMap[categoryKey], key === value);
    });
  }

  set image({ name, altText }: ICardPreviewImage) {
    this.setImage(this.imageElement, `${CDN_URL}/${name}`, altText,);
  }

  set price(value: number | null) {
    super.price = value;

    const isUnavailable = value === null;

    this.toggleBasketButton.disabled = isUnavailable;

    if (isUnavailable) {
      this.toggleBasketButton.textContent = UNAVAILABLE_BUTTON_TEXT;
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set isInBasket(value: boolean) {
    if (!this.toggleBasketButton.disabled) {
      this.toggleBasketButton.textContent = value ? REMOVE_FROM_BASKET_TEXT : ADD_TO_BASKET_TEXT;
    }
  }
}