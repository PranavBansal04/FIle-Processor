
const app = require('./app')

test('isValidUrl function should check if the url is valid', () => {
    expect(app.isValidUrl('1')).toBe(false);
    expect(app.isValidUrl('https://www.com')).toBe(true);
});