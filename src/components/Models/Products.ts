import type { IProduct } from '../../types';
import { IEvents } from "../base/Events.ts";

export class Products {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = [...items];

        this.events.emit('products:set');
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;

        this.events.emit('products:selected');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
