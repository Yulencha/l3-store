import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';
import { eventService } from '../../services/event.service';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
    this._observeProduct(); // Вызов метода наблюдения за элементом
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal');
  }

  // Метод для наблюдения, когда карточка товара попадает во вьюпорт
  _observeProduct() {
    // Настраиваем механизм для отслеживания, когда элемент становится видимым на экране
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // Проверяем, попал ли элемент во вьюпорт
          if (entry.isIntersecting) {
            // Формируем данные
            const payload = { ...this.product };
            // Проверяем, является ли log пустым объектом
            const isLogEmpty = Object.keys(this.product.log).length === 0;
            // Отправляем событие
            eventService.sendEvent(isLogEmpty ? 'viewCard' : 'viewCardPromo', payload);
            // После отправки события, можно отменить наблюдение
            observer.unobserve(this.view.root);
          }
        });
      },
      { threshold: 0.5 }
    ); // Threshold - степень видимости элемента во вьюпорте (от 0 до 1)

    observer.observe(this.view.root);
  }
}
