import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Products } from "./components/Models/Products";
import { WebLarekApi } from "./components/Communication/WebLarekApi";
import { API_URL } from "./utils/constants";
import { Header } from "./components/Views/Header";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/Views/Modal";
import { CardPreview } from "./components/Views/CardPreview";
import { FormOrder } from "./components/Views/FormOrder";
import { FormContacts } from "./components/Views/FormContacts";
import { Success } from "./components/Views/Success";
import { Basket as BasketView } from "./components/Views/Basket";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/CardCatalog";
import { CardBasket } from "./components/Views/CardBasket";
import {
    BasketItemRemoveEventParams,
    CardSelectEventParams,
    ContactsEmailChangeEventParams,
    ContactsPhoneChangeEventParams,
    OrderAddressChangeEventParams,
    OrderPaymentChangeEventParams,
    TOrder
} from "./types";

const events = new EventEmitter();

/** Инициализация моделей и API */

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const webLarekApi = new WebLarekApi(new Api(API_URL));

/** Инициализация представлений */

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const basketView = new BasketView(events, cloneTemplate<HTMLDivElement>('#basket'));
const formOrder = new FormOrder(events, cloneTemplate<HTMLFormElement>('#order'));
const formContacts = new FormContacts(events, cloneTemplate<HTMLFormElement>('#contacts'));
const successView = new Success(events, cloneTemplate<HTMLDivElement>('#success'));

const cardPreview = new CardPreview(
    events,
    cloneTemplate<HTMLDivElement>('#card-preview'),
    {
        onToggleBasket: () => events.emit('card:toggle-basket'),
    },
);

/** Обоаботка событий View */

events.on<CardSelectEventParams>('card:select', ({ product }) => {
    productsModel.setSelectedProduct(product);
});

events.on('card:toggle-basket', () => {
    const selectedProduct = productsModel.getSelectedProduct()

    if (selectedProduct) {
        if (basketModel.contains(selectedProduct.id)) {
            basketModel.removeProduct(selectedProduct);
        } else {
            basketModel.addProduct(selectedProduct);
        }
    }
});

events.on('basket:open', () => {
    modal.open(basketView.render());
});

events.on<BasketItemRemoveEventParams>('basket:item-remove', ({ id }) => {
    const product = productsModel.getProductById(id);

    if (product) {
        basketModel.removeProduct(product);
    }
});

events.on('basket:order', () => {
    const data = buyerModel.getBuyerData();

    const renderedForm = formOrder.render({
        isValid: false,
        errors: '',
        payment: data.payment,
        address: data.address,
    });

    modal.open(renderedForm);
});

events.on<OrderPaymentChangeEventParams>('order:payment-change', ({ payment }) => {
    buyerModel.setPayment(payment);
});

events.on<OrderAddressChangeEventParams>('order:address-change', ({ address }) => {
    buyerModel.setAddress(address);
});

events.on('order:submit', () => {
    const data = buyerModel.getBuyerData();

    const renderedForm = formContacts.render({
        isValid: false,
        errors: '',
        email: data.email,
        phone: data.phone,
    });

    modal.open(renderedForm);
});

events.on<ContactsEmailChangeEventParams>('contacts:email-change', ({ email }) => {
    buyerModel.setEmail(email);
});

events.on<ContactsPhoneChangeEventParams>('contacts:phone-change', ({ phone }) => {
    buyerModel.setPhone(phone);
});

events.on('contacts:submit', async () => {
    const buyerData = buyerModel.getBuyerData();
    const products = basketModel.getItems();

    const items = products.map((product) => product.id);
    const total = basketModel.getTotalPrice();

    const order: TOrder = {
        ...buyerData,
        total,
        items,
    };

    try {
        const response = await webLarekApi.createOrder(order);

        const renderedSuccess = successView.render({
            totalPrice: response.total
        });

        modal.open(renderedSuccess);

        basketModel.clear();
        buyerModel.clearBuyerData();
    } catch (error) {
        console.error('Произошла ошибка при создании заказа', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

/** Обоаботка событий Model */

const renderPreview = () => {
    const selectedProduct = productsModel.getSelectedProduct()

    if (selectedProduct) {
        const isInBasket = basketModel.contains(selectedProduct.id);

        return cardPreview.render({
            ...selectedProduct,
            isInBasket,
            image: {
                name: selectedProduct.image,
                altText: selectedProduct.title,
            },
        });
    }
};

events.on('products:set', () => {
    const items = productsModel.getItems().map((product) => {
        const card = new CardCatalog(
            events,
            cloneTemplate<HTMLButtonElement>('#card-catalog'),
            {
                onClick: () => events.emit<CardSelectEventParams>('card:select', { product }),
            },
        );

        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
        });
    });

    gallery.render({ items });
});

events.on('products:selected', () => {
    const renderedPreview = renderPreview();

    if (renderedPreview) {
        modal.open(renderedPreview);
    }
});

events.on('basket:items-changed', () => {
    const basketItems = basketModel.getItems().map((product, index) => {
        const item = new CardBasket(
            events,
            cloneTemplate<HTMLLIElement>('#card-basket'),
            {
                onDelete: () => events.emit<BasketItemRemoveEventParams>('basket:item-remove', {
                    id: product.id ,
                }),
            },
        );

        return item.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    basketView.render({
        items: basketItems,
        totalPrice: basketModel.getTotalPrice(),
        isEmpty: basketItems.length === 0,
    });

    header.render({ counter: basketModel.getItemsCount() });

    renderPreview();
});

events.on('buyer:order-changed', () => {
    const errors = buyerModel.validate();
    const data = buyerModel.getBuyerData();

    formOrder.render({
        isValid: !errors.payment && !errors.address,
        errors: errors.payment || errors.address || '',
        payment: data.payment,
        address: data.address,
    });
});

events.on('buyer:contacts-changed', () => {
    const errors = buyerModel.validate();
    const data = buyerModel.getBuyerData();

    formContacts.render({
        isValid: !errors.email && !errors.phone,
        errors: errors.email || errors.phone || '',
        email: data.email,
        phone: data.phone,
    });
});

/** Запуск приложения */

const runApp = async () => {
    header.render({ counter: 0 });

    try {
        const response = await webLarekApi.getProducts();

        productsModel.setItems(response.items);
    } catch (error) {
        console.error('Не удалось загрузить данные', error);
    }
};

runApp();
