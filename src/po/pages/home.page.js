import Page from './base.page.js';
import HeaderComponent from '../components/header.component.js';

class HomePage extends Page {
    get navHome() { return HeaderComponent.navHome; }
    get navSignIn() { return HeaderComponent.navSignIn; }
    get navCart() { return HeaderComponent.navCart; }
    get cartQuantityBadge() { return HeaderComponent.cartQuantityBadge; }
    get languageDropdown() { return HeaderComponent.languageDropdown; }
    get spanishOption() { return HeaderComponent.spanishOption; }

    get searchInput() { return $('[data-test="search-query"]'); }
    get searchSubmitBtn() { return $('[data-test="search-submit"]'); }
    get sortDropdown() { return $('[data-test="sort"]'); }

    get productCards() { return $$('a.card'); }
    get productTitles() { return $$('[data-test="product-name"]'); }
    get productPrices() { return $$('[data-test="product-price"]'); }

    open() {
        return super.open('');
    }

    async getFirstInStockProduct() {
        await browser.waitUntil(
            async () => (await this.productCards.length) > 0,
            { timeout: 10000, timeoutMsg: 'No product cards loaded on catalog' }
        );

        const cards = await this.productCards;
        for (const card of cards) {
            const outOfStock = await card.$('[data-test="out-of-stock"]').isExisting();
            if (!outOfStock) {
                return card.$('[data-test="product-name"]');
            }
        }
        throw new Error('No in-stock products found');
    }
}

export default new HomePage();