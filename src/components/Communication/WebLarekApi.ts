import type { IApi, IOrderResult, IProductsResponse, TOrder } from '../../types';

export class WebLarekApi {
    constructor(private readonly api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    createOrder(order: TOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}
