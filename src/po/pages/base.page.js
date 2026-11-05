export default class Page {
    open(path = '') {
        return browser.url(`https://practicesoftwaretesting.com/${path}`);
    }
}