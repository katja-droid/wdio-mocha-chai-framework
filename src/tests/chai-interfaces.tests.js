import { assert, expect as expectChai, should } from 'chai';
import { homePage, loginPage, productPage, checkoutPage } from '../po/index.js';
import { testData } from '../../data/test-data.js';

should();

beforeEach(async () => {
    await homePage.open();
    await browser.setWindowSize(1920, 1080);
});

describe('Scenario 1: Search for an exact product by name', () => {
    it('returns matching products', async () => {
        await homePage.searchInput.waitForDisplayed({ timeout: 10000 });
        await homePage.searchInput.setValue(testData.searchTerm);
        await homePage.searchSubmitBtn.click();

        await browser.waitUntil(
            async () => {
                const titles = await homePage.productTitles;
                const count = await titles.length;
                if (count === 0) return false;

                try {
                    const firstTitle = await titles[0].getText();
                    return firstTitle.toLowerCase().includes(testData.searchTerm.toLowerCase());
                } catch {
                    return false;
                }
            },
            {
                timeout: 10000,
                timeoutMsg: `Search results did not filter down to "${testData.searchTerm}"`
            }
        );

        const titles = await homePage.productTitles;
        const titlesCount = await titles.length;
        const titlesText = [];

        for (let i = 0; i < titlesCount; i++) {
            titlesText.push((await titles[i].getText()).trim());
        }

        assert.isAbove(titlesText.length, 0, 'Search should return at least one product');
        titlesText.forEach((title) => {
            assert.include(
                title.toLowerCase(),
                testData.searchTerm.toLowerCase(),
                `Product title "${title}" should contain "${testData.searchTerm}"`
            );
        });
    });
});

describe('Scenario 2: Sort products by price in descending order', () => {
    it('sorts prices from high to low', async () => {
        await homePage.sortDropdown.waitForDisplayed({ timeout: 10000 });

        const firstPriceBefore = (await homePage.productPrices[0].getText()).replace(/[^0-9.]/g, '');

        await homePage.sortDropdown.selectByVisibleText(testData.sortOption);

        await browser.waitUntil(
            async () => {
                const currentFirst = await homePage.productPrices[0].getText();
                const num = parseFloat(currentFirst.replace(/[^0-9.]/g, ''));
                return num > parseFloat(firstPriceBefore);
            },
            { timeout: 10000, timeoutMsg: 'Products were not re-sorted by price descending' }
        );

        const priceElements = await homePage.productPrices;
        const prices = [];
        for (const el of priceElements) {
            const rawText = await el.getText();
            const num = parseFloat(rawText.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) prices.push(num);
        }

        expectChai(prices.length).to.be.greaterThan(1);
        expectChai(prices[0]).to.equal(Math.max(...prices), 'First item must have the maximum price');

        for (let i = 0; i < prices.length - 1; i++) {
            expectChai(prices[i]).to.be.at.least(
                prices[i + 1],
                `Item at index ${i} ($${prices[i]}) should be >= item at index ${i + 1} ($${prices[i + 1]})`
            );
        }
    });
});

describe('Scenario 3: Successful user sign in with valid credentials', () => {
    it('signs in with valid credentials', async () => {
        await homePage.navSignIn.waitForClickable({ timeout: 10000 });
        await homePage.navSignIn.click();

        await loginPage.emailInput.waitForDisplayed({ timeout: 10000 });
        await loginPage.emailInput.setValue(testData.credentials.email);
        await loginPage.passwordInput.setValue(testData.credentials.password);
        await loginPage.submitBtn.click();

        await loginPage.pageTitle.waitForDisplayed({ timeout: 10000 });
        const titleText = await loginPage.pageTitle.getText();

        (await browser.getUrl()).should.include('/account');
        titleText.should.equal('My account');
    });
});

describe('Scenario 4: View detailed information on the product details page', () => {
    it('shows product details', async () => {
        const product = await homePage.getFirstInStockProduct();
        await product.waitForClickable({ timeout: 10000 });
        await product.click();

        await productPage.title.waitForDisplayed({ timeout: 10000 });
        await productPage.description.waitForDisplayed({ timeout: 10000 });
        await productPage.price.waitForDisplayed({ timeout: 10000 });

        const titleVal = await productPage.title.getText();
        const descVal = await productPage.description.getText();
        const priceVal = await productPage.price.getText();

        assert.isNotEmpty(titleVal, 'Product title should not be empty');
        assert.isNotEmpty(descVal, 'Product description should not be empty');
        assert.match(priceVal, /\$?\d+(\.\d{2})?/, 'Price should match numeric format');
    });
});

describe('Scenario 5: Add a product to the shopping basket', () => {
    it('adds an item to the basket', async () => {
        const product = await homePage.getFirstInStockProduct();
        await product.waitForClickable({ timeout: 10000 });
        await product.click();

        await productPage.addToCartBtn.waitForClickable({ timeout: 10000 });
        await productPage.addToCartBtn.click();

        await homePage.cartQuantityBadge.waitForDisplayed({ timeout: 10000 });
        await browser.waitUntil(
            async () => (await homePage.cartQuantityBadge.getText()).trim() === '1',
            { timeout: 10000, timeoutMsg: 'Cart quantity did not update to 1' }
        );

        const countText = await homePage.cartQuantityBadge.getText();

        expectChai(countText.trim()).to.equal('1');

        await homePage.navCart.click();

        await checkoutPage.lineItemTitle.waitForDisplayed({ timeout: 10000 });
        const itemText = await checkoutPage.lineItemTitle.getText();

        expectChai(itemText).to.be.a('string').and.not.be.empty;
    });
});

describe('Scenario 6: Add a product to the user\'s favorites list', () => {
    it('adds a product to favorites', async () => {
        await loginPage.open();
        await loginPage.emailInput.setValue(testData.credentials.email);
        await loginPage.passwordInput.setValue(testData.credentials.password);
        await loginPage.submitBtn.click();
        await loginPage.pageTitle.waitForDisplayed({ timeout: 10000 });

        await homePage.open();

        const product = await homePage.getFirstInStockProduct();
        await product.waitForClickable({ timeout: 10000 });
        await product.click();

        await productPage.addToFavoritesBtn.waitForClickable({ timeout: 10000 });
        await productPage.addToFavoritesBtn.click();

        await productPage.toastAlert.waitForDisplayed({ timeout: 10000 });
        const toastText = await productPage.toastAlert.getText();

        toastText.should.match(/product added to your favorites list|favorite/i);
    });
});

describe('Scenario 7: Complete the checkout process successfully', () => {
    it('completes checkout', async () => {
        await loginPage.open();
        await loginPage.emailInput.setValue(testData.credentials.email);
        await loginPage.passwordInput.setValue(testData.credentials.password);
        await loginPage.submitBtn.click();
        await loginPage.pageTitle.waitForDisplayed({ timeout: 10000 });

        await homePage.open();
        const product = await homePage.getFirstInStockProduct();
        await product.waitForClickable({ timeout: 10000 });
        await product.click();

        await productPage.addToCartBtn.waitForClickable({ timeout: 10000 });
        await productPage.addToCartBtn.click();

        await homePage.navCart.click();
        await checkoutPage.proceedToCheckoutBtn1.waitForClickable({ timeout: 10000 });
        await checkoutPage.proceedToCheckoutBtn1.click();

        await checkoutPage.proceedToAddressBtn2.waitForClickable({ timeout: 10000 });
        await checkoutPage.proceedToAddressBtn2.click();

        if (await checkoutPage.stateInput.isDisplayed()) {
            await checkoutPage.stateInput.setValue(testData.address.state);
            await checkoutPage.postalCodeInput.setValue(testData.address.postalCode);

            if (await checkoutPage.houseNumberInput.isDisplayed()) {
                await checkoutPage.houseNumberInput.setValue(testData.address.houseNumber);
            }
            if (await checkoutPage.countrySelect.isDisplayed()) {
                await checkoutPage.countrySelect.selectByVisibleText(testData.address.country);
            }
        }

        await checkoutPage.proceedToPaymentBtn3.waitForClickable({ timeout: 10000 });
        await checkoutPage.proceedToPaymentBtn3.click();

        await checkoutPage.paymentMethodSelect.waitForDisplayed({ timeout: 10000 });
        await checkoutPage.paymentMethodSelect.selectByVisibleText(testData.paymentMethod);

      await checkoutPage.finishBtn.waitForClickable({ timeout: 10000 });
        await checkoutPage.finishBtn.click();

        await browser.waitUntil(
            async () => (await checkoutPage.finishBtn.getText()).trim().toLowerCase() === 'confirm',
            {
                timeout: 5000,
                timeoutMsg: 'Expected finish button text to change to "Confirm" after first click'
            }
        );
await checkoutPage.finishBtn.waitForClickable({ timeout: 10000 });
        await checkoutPage.finishBtn.click();
        const updatedButtonText = await checkoutPage.finishBtn.getText();
        expectChai(updatedButtonText.trim()).to.match(/^confirm$/i);
        await checkoutPage.orderConfirmationNotice.waitForDisplayed({ timeout: 12000 });
        await browser.waitUntil(
            async () => (await checkoutPage.orderConfirmationNotice.getText()).trim().length > 0,
            { timeout: 10000, timeoutMsg: 'Order confirmation text did not populate' }
        );

        const confirmationMsg = await checkoutPage.orderConfirmationNotice.getText();

        assert.isTrue(confirmationMsg.length > 0, 'Order confirmation message should be present');
        assert.match(
            confirmationMsg,
            /Thanks for your order! Your invoice number is INV-\d+/i,
            'Confirmation message should indicate order was placed with an invoice number'
        );
    });
});

describe('Scenario 8: Change the application interface language to Spanish', () => {
    it('switches the interface to Spanish', async () => {
        await homePage.languageDropdown.waitForClickable({ timeout: 10000 });
        await homePage.languageDropdown.click();

        await homePage.spanishOption.waitForClickable({ timeout: 10000 });
        await homePage.spanishOption.click();

        await browser.waitUntil(
            async () => (await homePage.navHome.getText()).trim().toLowerCase() !== 'home',
            { timeout: 10000, timeoutMsg: 'Navigation did not switch language away from English' }
        );

        const homeText = (await homePage.navHome.getText()).trim().toLowerCase();

        expectChai(homeText).to.be.oneOf(['inicio', 'es', 'página de inicio', 'comienzo']);
    });
});