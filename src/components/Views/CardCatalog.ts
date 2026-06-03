import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ICard, Card } from "./Card";
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface ICardCatalog extends ICard {
  category: string;
  image: string;
}

interface ICardCatalogActions {
  onClick: () => void;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(events: IEvents, container: HTMLElement, actions?: ICardCatalogActions) {
    super(events, container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach((key) => {
      const categoryKey = key as keyof typeof categoryMap;

      this.categoryElement.classList.toggle(categoryMap[categoryKey], key === value);
    });
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}/${value}`,
      this.titleElement.textContent || '',
    );
  }
}