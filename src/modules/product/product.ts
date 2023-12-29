import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers';
import html from './product.tpl.html';
import { ProductData } from 'types';
import { favoritesService } from '../../services/favorites.service';
import { favoritesComp } from '../favorites/favorites';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();

    if (this.params.showRemoveButton) {
      this.view.root.classList.add('show-remove-button');
    }
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal');

    if (this.params.showRemoveButton && this.view.removeBtn) {
      this.view.removeBtn.onclick = this._removeFromFavorites.bind(this);
    }
  }
  private async _removeFromFavorites(event: MouseEvent) {
    event.preventDefault();

    await favoritesService.removeProduct(this.product);
    this.view.root.remove();
    favoritesComp.render();
  }
}
