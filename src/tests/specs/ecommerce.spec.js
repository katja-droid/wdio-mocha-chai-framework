import { assert, expect } from 'chai';
import { homePage, loginPage, productPage, checkoutPage } from '../../business/index.js';
import { testData } from '../data/test-data.js';

const loginUser = async () => {
    await loginPage.open();
    await loginPage.login(testData.credentials);
    await homePage.open();
};

beforeEach(async () => {
    await homePage.open();
    await browser.setWindowSize(1920, 1080);
});

describe('User flows for e-commerce application', () => {
    it('returns matching products for an exact title search', async () => {
        await homePage.searchFor(testData.searchTerm);

        const titles = await homePage.productTitles;
        const titleTexts = await Promise.all(Array.from(titles).map((title) => title.getText()));

        assert.isAbove(titleTexts.length, 0, 'Search should return at least one product');
        titleTexts.forEach((title) => {
            assert.include(
                title.toLowerCase(),
                testData.searchTerm.toLowerCase(),
                `Product title "${title}" should contain "${testData.searchTerm}"`
            );
        });
    });

    it('sorts products by price in descending order', async () => {
        await homePage.sortDropdown.waitForDisplayed();

        const firstPriceBefore = Number((await homePage.productPrices[0].getText()).replace(/[^0-9.]/g, ''));
        await homePage.sortDropdown.selectByVisibleText(testData.sortOption);

        await browser.waitUntil(async () => {
            const firstPrice = Number((await homePage.productPrices[0].getText()).replace(/[^0-9.]/g, ''));
            return firstPrice > firstPriceBefore;
        });

        const prices = await homePage.getProductPricesAsNumbers();
        expect(prices.length).to.be.greaterThan(1);
        expect(prices[0]).to.equal(Math.max(...prices), 'First item must have the maximum price');

        for (let index = 0; index < prices.length - 1; index++) {
            expect(prices[index]).to.be.at.least(
                prices[index + 1],
                `Item at index ${index} should be >= item at index ${index + 1}`
            );
        }
    });

    it('signs in with valid credentials', async () => {
        await homePage.navSignIn.waitForClickable();
        await homePage.navSignIn.click();

        await loginPage.login(testData.credentials);

        const titleText = await loginPage.pageTitle.getText();
        expect(titleText).to.equal('My account');
        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/account');
    });

    it('shows the details for an available product', async () => {
        const product = await homePage.getFirstInStockProduct();
        await product.click();

        await productPage.title.waitForDisplayed();
        await productPage.description.waitForDisplayed();
        await productPage.price.waitForDisplayed();

        const titleText = await productPage.title.getText();
        const descriptionText = await productPage.description.getText();
        const priceText = await productPage.price.getText();

        assert.isNotEmpty(titleText, 'Product title should not be empty');
        assert.isNotEmpty(descriptionText, 'Product description should not be empty');
        assert.match(priceText, /\$?\d+(\.\d{2})?/, 'Price should match numeric format');
    });

    it('adds a product to the shopping basket', async () => {
        const product = await homePage.getFirstInStockProduct();
        await product.click();
        await productPage.addToCart();

        await homePage.cartQuantityBadge.waitForDisplayed();
        await browser.waitUntil(async () => (await homePage.cartQuantityBadge.getText()).trim() === '1');

        expect((await homePage.cartQuantityBadge.getText()).trim()).to.equal('1');

        await homePage.navCart.click();
        await checkoutPage.lineItemTitle.waitForDisplayed();

        const itemText = await checkoutPage.lineItemTitle.getText();
        expect(itemText).to.be.a('string').and.not.be.empty;
    });

    it('adds a product to the favorites list', async () => {
        await loginUser();

        const product = await homePage.getFirstInStockProduct();
        await product.click();
        await productPage.addToFavorites();

        await productPage.toastAlert.waitForDisplayed();
        const toastText = await productPage.toastAlert.getText();
        expect(toastText).to.match(/product added to your favorites list|favorite/i);
    });

    it('completes checkout with a valid order', async () => {
        await loginUser();

        const product = await homePage.getFirstInStockProduct();
        await product.click();
        await productPage.addToCart();

        await homePage.navCart.click();
        await checkoutPage.continueToAddress();
        await checkoutPage.fillAddress(testData.address);
        await checkoutPage.completePayment(testData.paymentMethod);

        const confirmationMessage = await checkoutPage.finishOrder();
        assert.match(
            confirmationMessage,
            /Thanks for your order! Your invoice number is INV-\d+/i,
            'Confirmation message should indicate order was placed with an invoice number'
        );
    });

    it('switches the interface language to Spanish', async () => {
        await homePage.languageDropdown.waitForClickable();
        await homePage.languageDropdown.click();
        await homePage.spanishOption.waitForClickable();
        await homePage.spanishOption.click();

        await browser.waitUntil(async () => (await homePage.navHome.getText()).trim().toLowerCase() !== 'home');

        const homeText = (await homePage.navHome.getText()).trim().toLowerCase();
        expect(homeText).to.be.oneOf(['inicio', 'es', 'página de inicio', 'comienzo']);
    });
});
