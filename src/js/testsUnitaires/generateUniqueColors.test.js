import { generateUniqueColors } from "../utile/generaRandomColorFromList";

test('generate random color', () => {
    expect(generateUniqueColors(["undefined"])).toStrictEqual({ "undefined": "rgb(169,169,169)" });
});
