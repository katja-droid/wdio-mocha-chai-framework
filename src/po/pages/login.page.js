import Page from './base.page.js';

class LoginPage extends Page {
    get emailInput() { return $('[data-test="email"]'); }
    get passwordInput() { return $('[data-test="password"]'); }
    get submitBtn() { return $('[data-test="login-submit"]'); }
    get pageTitle() { return $('[data-test="page-title"]'); }

    open() {
        return super.open('auth/login');
    }
}

export default new LoginPage();