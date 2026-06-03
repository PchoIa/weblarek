import type { IProduct } from '../../types';
import {IEvents} from "../base/Events.ts";

export class Basket {
    private items: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    emitItemsChanged() {
        this.events.emit('basket:items-changed');
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    addProduct(product: IProduct): void {
        if (product.price === null || this.contains(product.id)) {
            return;
        }

        this.items = [...this.items, product];

        this.emitItemsChanged();
    }

    removeProduct(product: IProduct): void {
        this.items = this.items.filter((basketProduct) => basketProduct.id !== product.id);

        this.emitItemsChanged();
    }

    clear(): void {
        this.items = [];

        this.emitItemsChanged();
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, product) => sum + (product.price ?? 0), 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    contains(id: string): boolean {
        return this.items.some((product) => product.id === id);
    }
}
