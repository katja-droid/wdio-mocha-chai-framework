import BasePage from '../../core/base.page.js';

class ProductPage extends BasePage {
    get title() { return $('[data-test="product-name"]'); }
    get description() { return $('[data-test="product-description"]'); }
    get price() { return $('[data-test="unit-price"]'); }
    get addToCartBtn() { return $('[data-test="add-to-cart"]'); }
    get addToFavoritesBtn() { return $('[data-test="add-to-favorites"]'); }
    get toastAlert() { return $('div.toast, [role="alert"], div.alert'); }

    async addToCart() {
        await this.addToCartBtn.waitForClickable();
        await this.addToCartBtn.click();
    }

    async addToFavorites() {
        await this.addToFavoritesBtn.waitForClickable();
        await this.addToFavoritesBtn.click();
    }
}

export default new ProductPage();