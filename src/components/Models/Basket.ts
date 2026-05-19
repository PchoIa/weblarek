import type { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    addProduct(product: IProduct): void {
        if (product.price === null || this.contains(product.id)) {
            return;
        }

        this.items = [...this.items, product];
    }

    removeProduct(product: IProduct): void {
        this.items = this.items.filter((basketProduct) => basketProduct.id !== product.id);
    }

    clear(): void {
        this.items = [];
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
