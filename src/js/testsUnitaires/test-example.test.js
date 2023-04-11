// TEST DE test-example.js
/* beforeAll est essentiel quand on doit appeler des promesses avant tous les tests.
 * Ici, il n'est pas nécessaire.
 * beforeEach pourra être très utile (appelé avant chaque test).
*/
const sum = require("../js/tetUnitaire/test-example.js");

test('adds 1 + 2 to equal 3', () => {
    // Example de mock, ici pas essentiel
    const myMock = jest.fn();
    myMock.mockReturnValueOnce(3);

    expect(sum(1, 2)).toBe(myMock());
});

// EXAMPLE DE TEST ASYNCHRONE
/*
test('la donnée est peanut butter', () => {
    return fetchData().then(data => {
        expect(data).toBe('peanut butter');
    });
});
*/