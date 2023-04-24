const generaRandomColorFromList = require("../utile/generaRandomColorFromList");

test('generate random color', () => {
    expect(generaRandomColorFromList(["undefined"])).toStrictEqual({ "undefined": "rgb(169,169,169)" });
});
