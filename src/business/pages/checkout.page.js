import BasePage from '../../core/base.page.js';

class CheckoutPage extends BasePage {
    get lineItemTitle() { return $('[data-test="product-title"]'); }
    get proceedToCheckoutBtn1() { return $('[data-test="proceed-1"]'); }
    get proceedToAddressBtn2() { return $('[data-test="proceed-2"]'); }
    get proceedToPaymentBtn3() { return $('[data-test="proceed-3"]'); }
    get stateInput() { return $('[data-test="state"]'); }
    get postalCodeInput() { return $('[data-test="postal_code"]'); }
    get houseNumberInput() { return $('[data-test="house_number"]'); }
    get countrySelect() { return $('[data-test="country"]'); }
    get paymentMethodSelect() { return $('[data-test="payment-method"]'); }
    get finishBtn() { return $('[data-test="finish"]'); }
    get orderConfirmationNotice() { return $('#order-confirmation'); }

    open() {
        return super.open('checkout');
    }

    async continueToAddress() {
        await this.proceedToCheckoutBtn1.waitForClickable();
        await this.proceedToCheckoutBtn1.click();
        await this.proceedToAddressBtn2.waitForClickable();
        await this.proceedToAddressBtn2.click();
    }

    async fillAddress({ state, postalCode, houseNumber, country }) {
        if (await this.stateInput.isDisplayed()) {
            await this.stateInput.setValue(state);
            await this.postalCodeInput.setValue(postalCode);

            if (await this.houseNumberInput.isDisplayed()) {
                await this.houseNumberInput.setValue(houseNumber);
            }

            if (await this.countrySelect.isDisplayed()) {
                await this.countrySelect.selectByVisibleText(country);
            }
        }
    }

    async completePayment(paymentMethod) {
        await this.proceedToPaymentBtn3.waitForClickable();
        await this.proceedToPaymentBtn3.click();
        await this.paymentMethodSelect.waitForDisplayed();
        await this.paymentMethodSelect.selectByVisibleText(paymentMethod);
    }

    async finishOrder() {
        await this.finishBtn.waitForClickable();
        await this.finishBtn.click();
        await browser.waitUntil(async () => (await this.finishBtn.getText()).trim().toLowerCase() === 'confirm');
        await this.finishBtn.click();
        await this.orderConfirmationNotice.waitForDisplayed();
        return this.orderConfirmationNotice.getText();
    }
}

export default new CheckoutPage();
