class HeaderComponent {
    get navHome() { return $('[data-test="nav-home"]'); }
    get navSignIn() { return $('[data-test="nav-sign-in"]'); }
    get navCart() { return $('[data-test="nav-cart"]'); }
    get cartQuantityBadge() { return $('[data-test="cart-quantity"]'); }
    get languageDropdown() { return $('#language, [data-test="language"]'); }
    get spanishOption() {
        return $('//a[contains(@class, "dropdown-item") and (contains(text(), "ES") or contains(text(), "Español"))]');
    }
}

export default new HeaderComponent();