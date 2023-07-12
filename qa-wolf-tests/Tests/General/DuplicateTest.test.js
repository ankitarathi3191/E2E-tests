// https://qa-wolf.monday.com/boards/2150171022/pulses/2671831753
const faker = require('faker');
const {
    assertText,
    buildUrl,
    logIn,
    assertNotText,
    assertElement,
  } = require('./Robots/helpers');

test('Duplicate test', async () => {
// log in and view all tests
const { page, context, browser } = await logIn({slowMo: 1000});
await page.click('[data-icon="sort-down"]');
await page.click("text=QA Wolves");
await assertElement(page, '[src="https://d1q02u2o70cucv.cloudfront.net/profile_pictures/e5cdb832ad814d05b42ea9a764902a4d.png"]');
await page.click("text=All Tests");
await assertText(page, "Filters");
await assertText(page, "TEST NAME");

// duplicate test
await page.fill('[placeholder="Search..."]', "Test One");
await page.click(".grow:right-of(:text('Test One'))");
await page.click(".open .dropdown-item >> text='Duplicate'");
await page.click(".ms-modal__content-button:has-text('Include')");

// edit name of test
const duplicatedTestName = `QAW: ${faker.random.words(2)}`;
await page.fill('[name="title"]', duplicatedTestName);
await assertText(page, duplicatedTestName);

// edit calendar results
await page.click('[aria-label="Open calendar"]');
await page.click(".md-calendar-date-today span");

// publish test
await page.click(':text("Next")');
await assertText(page, "Products");
await page.click(".md-confirm-button");
await page.click("#step-nav-prep-to-send");
await assertText(page, "United States");
await page.click("text=Ready to Send");
await page.click("text=Yes, publish");
await assertText(page, "Campaign published.");

// assert test duplicated
await assertText(page, duplicatedTestName);

// delete test
await page.click(`.grow:right-of(:text('${duplicatedTestName}'))`);
await page.click(".open .dropdown-item >> text='Delete'");
await page.click(".ms-ds-button--color-primary:has-text('Yes')");
await assertNotText(page, duplicatedTestName)
});