import BasePage from '../../core/base.page.js';

class LoginPage extends BasePage {
    get emailInput() { return $('[data-test="email"]'); }
    get passwordInput() { return $('[data-test="password"]'); }
    get submitBtn() { return $('[data-test="login-submit"]'); }
    get pageTitle() { return $('[data-test="page-title"]'); }

    open() {
        return super.open('auth/login');
    }

    async login({ email, password }) {
        await this.emailInput.waitForDisplayed();
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.submitBtn.click();

        await browser.waitUntil(async () => {
            const currentUrl = await browser.getUrl();
            if (currentUrl.includes('/account')) {
                return true;
            }

            try {
                return await this.pageTitle.isDisplayed();
            } catch {
                return false;
            }
        });

        return this.pageTitle;
    }
}

export default new LoginPage();