const getLocalStorage = require('./app');

test('getting data from firebase', () => {
    expect(getLocalStorage).toBe([]);
});

