import Page from './base.page.js';

class CheckoutPage extends Page {
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
    get orderConfirmationNotice() {
        return $('#order-confirmation');
    }

    open() {
        return super.open('checkout');
    }
}

export default new CheckoutPage();