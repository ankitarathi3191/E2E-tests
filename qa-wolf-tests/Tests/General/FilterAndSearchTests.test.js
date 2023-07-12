// https://qa-wolf.monday.com/boards/2150171022/pulses/2671831753
const assert = require('assert').strict;
const {
    assertText,
    buildUrl,
    logIn,
    assertNotText,
    assertElement,
  } = require('./Robots/helpers');

test('Filter and search tests', async () => {
// log in and view all tests
const { page, context, browser } = await logIn({slowMo: 1000, permissions: ["clipboard-read", "clipboard-write"]});
await page.click('[data-icon="sort-down"]');
await page.click("text=QA Static");
await assertElement(page, '[src="https://cdn.makersights.com/1e693a19-8aad-47ba-a3bb-9ddfa8edc667.png"]');
await page.click("text=All Tests");
await assertText(page, "Filters");
await assertText(page, "TEST NAME");

await page.waitForTimeout(5000); // wait for page to load before counting
const testResults = await page.locator('.test-title').count();

// filter tests by decision point
await assertText(page, "DECISION POINT");
await page.check("text=Global Line Review");
expect(await page.locator(':text("2023 Fall Men\'s Shirts - Evaluate Newness")').isVisible()).toBeFalsy();
await page.uncheck("text=Global Line Review");

// filter tests by status
await page.check("text=Active");
const statusResults = await page.locator('.test-title').count();
console.log(statusResults)
expect(await page.locator(':text("Full Copy of 2022 - Fall - Mens Shirts")').isVisible()).toBeFalsy();
assert(statusResults < testResults);
await page.uncheck("text=Active");

// search tests
// await page.fill('[placeholder="Search..."]', "Kev Kev");
// const searchedResults = await page.locator('.test-title').count();
// await assertNotText(page, "Don't delete Test");
// assert(searchedResults < testResults);

// preview test
await page.click(".grow:right-of(:text('Kev Kev'))");
const [page2] = await Promise.all([
//   context.waitForEvent('page'),
  page.click("text=Preview")
])
// await page2.waitForLoadState();

// assert new page
await assertText(page2, "Welcome!");
await page2.click("text=Onward!");
await assertText(page2, "Would you consider buying this item?");

// view test links
await page.bringToFront();
await page.click("text=Links");
await assertText(page, "Great job, looks like you’re just about done!");
await assertText(page, "LINK");
await page.dblclick(".input-link");
await assertText(page, "Copied to clipboard");
const copiedLink = await page.evaluate(() => {
  return navigator.clipboard.readText();
});
const context3 = await browser.newContext();
const page3 = await context3.newPage();
await page3.goto(copiedLink);  
await page3.waitForLoadState();

// assert new page
await assertText(page3, "Welcome!");
await page3.click("text=Onward!");
await assertText(page3, "Would you consider buying this item?")
});