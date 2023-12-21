import { Component } from '../component';
import { Product } from '../product/product';
import html from './favorites.tpl.html';
import { favoritesService } from '../../services/favorites.service';
import { ProductData } from 'types';

class Favorites extends Component {
  products!: ProductData[];

  async render() {
    // Получаем список избранных товаров
    this.products = await favoritesService.get();

    this.products.forEach((product) => {
      // Создаем компонент Product для каждого товара
      // Передаем параметр showRemoveButton как true, чтобы отобразить кнопку удаления из избранного
      const productComp = new Product(product, { showRemoveButton: true });
      // Вызываем метод render для каждого компонента Product
      productComp.render();
      // Присоединяем компонент Product к DOM-элементу favoritesList для отображения на странице
      productComp.attach(this.view.favoritesList);
    });
  }
}

export const favoritesComp = new Favorites(html);
