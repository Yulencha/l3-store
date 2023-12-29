import localforage from 'localforage';
import { ProductData } from 'types';

const DB_FAVORITES = '__wb-favorites';

class FavoritesService {
  init() {
    this._updateCounters();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DB_FAVORITES)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB_FAVORITES, data);
    this._updateCounters();
  }

  async isInFavorites(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updateCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    document.querySelectorAll('.js__favorites-counter').forEach(($el) => {
      const el = $el as HTMLElement;
      el.innerText = String(count || '');
    });
    const favoritesLink = document.querySelector('.js__favorites-link');

    favoritesLink!.classList.toggle('hide', products.length === 0);
  }

  async toggleProduct(product: ProductData) {
    const isInFavorites = await this.isInFavorites(product);
    if (isInFavorites) {
      await this.removeProduct(product);
    } else {
      await this.addProduct(product);
    }
    return !isInFavorites;
  }
}

export const favoritesService = new FavoritesService();
