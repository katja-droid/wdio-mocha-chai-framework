import Page from './base.page.js';

class ProductPage extends Page {
    get title() { return $('[data-test="product-name"]'); }
    get description() { return $('[data-test="product-description"]'); }
    get price() { return $('[data-test="unit-price"]'); }
    get addToCartBtn() { return $('[data-test="add-to-cart"]'); }
    get addToFavoritesBtn() { return $('[data-test="add-to-favorites"]'); }
    get toastAlert() { return $('div.toast, [role="alert"], div.alert'); }
}

export default new ProductPage();