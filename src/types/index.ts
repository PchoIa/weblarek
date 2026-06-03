export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type TBuyerField = keyof IBuyer;
export type TBuyerErrors = Partial<Record<TBuyerField, string>>;

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export type TOrder = IBuyer & {
    total: number;
    items: string[];
};

export interface IOrderResult {
    id: string;
    total: number;
}

/** Описание типов для параметров событий */

export interface CardSelectEventParams {
    product: IProduct;
}

export interface BasketItemRemoveEventParams {
    id: string;
}

export interface OrderPaymentChangeEventParams {
    payment: TPayment;
}

export interface OrderAddressChangeEventParams {
    address: string;
}

export interface ContactsEmailChangeEventParams {
    email: string;
}

export interface ContactsPhoneChangeEventParams {
    phone: string;
}