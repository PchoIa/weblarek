import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Products } from "./components/Models/Products";
import { WebLarekApi } from "./components/Communication/WebLarekApi";
import type { TOrder, TPayment } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const webLarekApi = new WebLarekApi(new Api(API_URL));

productsModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getItems());

const firstProduct = productsModel.getProductById(apiProducts.items[0].id);
const secondProduct = productsModel.getProductById(apiProducts.items[1].id);
const unavailableProduct = productsModel.getProductById(
  apiProducts.items[2].id,
);

if (firstProduct) {
  productsModel.setSelectedProduct(firstProduct);
  console.log(
    "Товар для подробного отображения:",
    productsModel.getSelectedProduct(),
  );

  basketModel.addProduct(firstProduct);
  console.log(
    "Корзина после добавления первого товара:",
    basketModel.getItems(),
  );
  console.log(
    "Первый товар есть в корзине:",
    basketModel.contains(firstProduct.id),
  );
}

if (secondProduct) {
  basketModel.addProduct(secondProduct);
  console.log(
    "Корзина после добавления второго товара:",
    basketModel.getItems(),
  );
}

if (unavailableProduct) {
  basketModel.addProduct(unavailableProduct);
  console.log(
    "Корзина после попытки добавить товар без цены:",
    basketModel.getItems(),
  );
}

console.log("Количество товаров в корзине:", basketModel.getItemsCount());
console.log("Стоимость товаров в корзине:", basketModel.getTotalPrice());

if (firstProduct) {
  basketModel.removeProduct(firstProduct);
  console.log("Корзина после удаления первого товара:", basketModel.getItems());
}

const payment: TPayment = "card";

buyerModel.setPayment(payment);
buyerModel.setAddress("Москва, улица Практикума, дом 1");

console.log(
  "Ошибки первого шага заказа:",
  buyerModel.validate(["payment", "address"]),
);

console.log(
  "Валидность первого шага заказа:",
  buyerModel.isValid(["payment", "address"]),
);

buyerModel.setEmail("buyer@example.com");
buyerModel.setPhone("+79990000000");

console.log("Данные покупателя:", buyerModel.getBuyerData());

console.log(
  "Ошибки второго шага заказа:",
  buyerModel.validate(["email", "phone"]),
);

console.log("Валидность всех данных покупателя:", buyerModel.isValid());

buyerModel.setBuyerData({ phone: "+79990000001" });

console.log(
  "Данные покупателя после вызова setBuyerData:",
  buyerModel.getBuyerData(),
);

const orderBuyerData = buyerModel.getOrderBuyerData();

console.log("Покупатель готов к оформлению заказа:", orderBuyerData);

if (orderBuyerData) {
  const testOrder: TOrder = {
    ...orderBuyerData,
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((product) => product.id),
  };

  console.log("Пример объекта заказа для отправки на сервер:", testOrder);
}

basketModel.clear();
console.log("Корзина после очистки:", basketModel.getItems());

buyerModel.clearBuyerData();
console.log("Данные покупателя после очистки:", buyerModel.getBuyerData());

webLarekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log(
      "Каталог, полученный с сервера и сохранённый в модель:",
      productsModel.getItems(),
    );
  })
  .catch((error) => {
    console.error("Ошибка получения каталога с сервера:", error);
  });
