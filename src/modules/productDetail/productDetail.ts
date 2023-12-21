import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoritesService } from '../../services/favorites.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    // Назначаем обработчик клика на кнопку добавления в избранное.
    this.view.btnFav.onclick = this._toggleToFavorites.bind(this);

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();

    // Проверяем, находится ли товар в избранном, если да, то обновляем вид кнопки
    const isFavorite = await favoritesService.isInFavorites(this.product);
    if (isFavorite) {
      this.view.btnFav.classList.add('in-favorites');
    }

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  // Метод для переключения состояния избранного для товара
  private async _toggleToFavorites() {
    if (!this.product) return;

    // Переключаем состояние товара в избранном
    const isFavorite = await favoritesService.toggleProduct(this.product);

    // Обновляем внешний вид кнопки в зависимости от того, в избранном ли товар
    if (isFavorite) {
      this.view.btnFav.classList.add('in-favorites');
    } else {
      this.view.btnFav.classList.remove('in-favorites');
    }
  }
}

export const productDetailComp = new ProductDetail(html);
