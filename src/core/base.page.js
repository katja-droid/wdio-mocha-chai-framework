export default class BasePage {
    open(path = '') {
        const normalizedPath = path ? path.replace(/^\/+/, '') : '';
        return browser.url(`https://practicesoftwaretesting.com/${normalizedPath}`);
    }
}
