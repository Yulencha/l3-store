import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { SearchHints } from '../searchHints/searchHints';
import { ProductList } from '../productList/productList';

class Homepage extends Component {
  popularProducts: ProductList;
  searchHints: SearchHints; // Экземпляр SearchHints для управления и отображения блока подсказок

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);

    // Инициализация SearchHints с данными подсказок
    const hints = [
      { name: 'чехол iphone 13 pro', url: '#' },
      { name: 'коляски agex', url: '#' },
      { name: 'яндекс станция 2', url: '#' }
    ];
    this.searchHints = new SearchHints(hints);
  }

  render() {
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.popularProducts.update(products);
      });

    // Прикрепление и отображение SearchHints
    this.searchHints.attach(this.view.searchHints);
    this.searchHints.render();

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки'
      });
    }
  }
}

export const homepageComp = new Homepage(html);
