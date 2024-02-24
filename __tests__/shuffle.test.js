const shuffle = require("../src/shuffle");
const bots = require("../src/botsData");

describe("shuffle should...", () => {
  test('shuffle should return an array', () => {
    const result = shuffle(bots);
    expect (Array.isArray(result)).toBe(true);
  });

  test('shuffle should return an array at the same length as the input array', () => {
    const result = shuffle(bots);
    expect (result.length).toBe(bots.length);
  });
  test('shuffle should return an array has all the same items', () => {
    const result = shuffle(bots);
    const checkLength = (result.length === bots.length);

    let checkValue = true;
    for (const item of bots) {
      if (!result.includes(item)){
        checkValue = false;
        break;
      }
    };

    expect(checkLength && checkValue).toBe(true);
  });

});
