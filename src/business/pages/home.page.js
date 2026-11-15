import BasePage from '../../core/base.page.js';
import HeaderComponent from '../components/header.component.js';

class HomePage extends BasePage {
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

    async searchFor(term) {
        await this.searchInput.waitForDisplayed();
        await this.searchInput.setValue(term);
        await this.searchSubmitBtn.click();

        await browser.waitUntil(async () => {
            const titles = await this.productTitles;
            if (titles.length === 0) return false;

            try {
                const firstTitle = await titles[0].getText();
                return firstTitle.toLowerCase().includes(term.toLowerCase());
            } catch {
                return false;
            }
        });

        return this.productTitles;
    }

    async getFirstInStockProduct() {
        await browser.waitUntil(async () => (await this.productCards).length > 0);

        const cards = await this.productCards;
        for (const card of cards) {
            const outOfStock = await card.$('[data-test="out-of-stock"]').isExisting();
            if (!outOfStock) {
                return card.$('[data-test="product-name"]');
            }
        }

        throw new Error('No in-stock products found');
    }

    async getProductPricesAsNumbers() {
        const priceElements = await this.productPrices;
        return Promise.all(
            Array.from(priceElements).map(async (element) => {
                const rawText = await element.getText();
                const parsedNumber = Number(rawText.replace(/[^0-9.]/g, ''));
                return Number.isNaN(parsedNumber) ? null : parsedNumber;
            })
        ).then((values) => values.filter((value) => value !== null));
    }
}

export default new HomePage();
