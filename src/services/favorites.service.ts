import localforage from 'localforage';
import { ProductData } from 'types';

const DB_FAVORITES = '__wb-favorites';

class FavoritesService {
  // Инициализация сервиса - обновляем счетчик
  init() {
    this._updateCounters();
  }

  // Метод для добавления продукта в избранное
  async addProduct(product: ProductData) {
    // Получаем текущий список избранных товаров
    const products = await this.get();
    // Добавляем новый продукт в список и сохраняем обновленный список
    await this.set([...products, product]);
  }

  // Метод для удаления продукта из избранного
  async removeProduct(product: ProductData) {
    // Получаем текущий список избранных и фильтруем его, исключая удаляемый продукт
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  // Метод для получения списка избранных товаров
  async get(): Promise<ProductData[]> {
    // Получаем данные из localforage или возвращаем пустой массив, если данных нет
    return (await localforage.getItem(DB_FAVORITES)) || [];
  }

  // Метод для сохранения списка избранных товаров в localforage
  async set(data: ProductData[]) {
    // Сохраняем обновленные данные в localforage
    await localforage.setItem(DB_FAVORITES, data);
    // Обновляем счетчик
    this._updateCounters();
  }

  // Проверка, находится ли данный продукт в списке избранных
  async isInFavorites(product: ProductData) {
    // Получаем текущий список и проверяем наличие продукта в нем
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  // Метод для обновления счетчиков избранных товаров на странице
  private async _updateCounters() {
    // Получаем список и количество избранных товаров
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    // Обновляем текст счетчика на всех элементах с классом .js__favorites-counter
    document.querySelectorAll('.js__favorites-counter').forEach(($el) => {
      // Явное приведение каждого элемента к типу HTMLElement
      const el = $el as HTMLElement;
      el.innerText = String(count || '');

      // Находим ближайший родительский элемент с классом .favorites
      const favoritesLink = el.closest('.favorites');
      if (favoritesLink) {
        // Если в избранном нет товаров, добавляем класс 'hide', иначе удаляем его
        if (products.length === 0) {
          favoritesLink.classList.add('hide');
        } else {
          favoritesLink.classList.remove('hide');
        }
      }
    });
  }

  // Переключение состояния избранного для товара (добавлен/удален)
  async toggleProduct(product: ProductData) {
    // Проверяем, находится ли продукт в избранном
    const isInFavorites = await this.isInFavorites(product);
    // Добавляем или удаляем продукт в зависимости от его текущего состояния
    if (isInFavorites) {
      await this.removeProduct(product);
    } else {
      await this.addProduct(product);
    }
    // Возвращаем обновленное состояние избранного
    return !isInFavorites;
  }
}

export const favoritesService = new FavoritesService();
