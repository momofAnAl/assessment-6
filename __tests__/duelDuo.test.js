const { Builder, Browser, By, until, Key } = require("selenium-webdriver");
const { find } = require("../src/botsData");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("http://localhost:8000");
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {

    let message;

    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  test("the Draw button should display choices", async () => {
    await driver.findElement(By.id("draw")).click();
    message = await driver.findElement(By.id("choices"));
    expect(await message.isDisplayed()).toBe(true);
  });

  test("Add to Duo button should display player duo", async () => {
    await driver.findElement(By.css("button")).sendKeys("Self-Aware Garbage Android");
  });

  test("Remove from Duo should goes back to choices", async () => {
    await driver.findElement(By.css("button")).click();
    message = await driver.findElement(By.id("player-duo"));
    await driver.wait(until.elementIsNotVisible(message), 2000);
  });

});