import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';
import { eventService } from '../../services/event.service';
import { genUUID } from '../../utils/helpers';

class Checkout extends Component {
  products!: ProductData[];
  totalPrice: number = 0;

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    this.totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(this.totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

  private async _makeOrder() {
    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });

    // Генерируем уникальный идентификатор для заказа
    const orderId = genUUID();
    // Отправка события оформления заказа
    eventService.sendEvent('purchase', {
      orderId: orderId,
      totalPrice: this.totalPrice,
      productIds: this.products.map((p) => p.id)
    });

    window.location.href = '/?isSuccessOrder';
  }
}

export const checkoutComp = new Checkout(html);
