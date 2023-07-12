const {
    assertText,
    buildUrl,
    logIn,
    downloadFile,
    getBoundingBox,
    assertNotText,
    turnOnV2
  } = require('./Robots/helpers');

test('Profanity words are filtered out of results', async () => {
// log in and view all tests
const { page } = await logIn({ slowMo: 1000 });
await page.click('[data-icon="sort-down"]');
await page.click("text=QA Wolves");
// await assertElement(
//   page,
//   '[src="https://d1q02u2o70cucv.cloudfront.net/profile_pictures/e5cdb832ad814d05b42ea9a764902a4d.png"]'
// );

//* Create a survey
// turn on homepage v2
try {
  await expect(page.locator('text="My Events"')).toBeHidden({ timeout: 5000 });
  await turnOnV2();
} catch {}

// click on "Add New Event" and then select "Test" as the type, then select an assortment, the "Add" button should become active. And then when you click add, you are taken to the campaign wizard
expect(await page.locator('text="My Events"').isVisible()).toBeTruthy();
await page.click("text=Add New Event");
await page.click(':text("Select...")');
await page.click("div >> text='Test'");
await expect(page.locator("button >> text='Add'")).toBeDisabled();
await page.click(':text("Select...")');
await page.click("div >> text='2024 summer Pants'");
await expect(page.locator("button >> text='Add'")).toBeEnabled();
await page.click("button >> text='Add'");
await page.click(
  '[src="https://qa-app.makersights.com/./assets/img/51a371f9b2fefbd934b2.png"]'
);
const testTitle = faker.random.words(2);
await page.fill('[name="title"]', testTitle);
await page.click(':text("Choose Purpose(s)")');
await page.click('.ms-select-multiple__option >> text="Test new product silhouettes, features or details"');
await page.click("text=Next");
await page.click(".product-thumbnail >> nth=0");
await expect(page.locator(".ms-pill__label >> nth=0")).toHaveText("1");

// Add custom free response question
await page.click(':text-is("Consumers")');
await page.click(':text-is("Add Question")');
await page.click(':text("Free Response Question")');
await page.click(".is-active .ms-ds-button--color-primary");

// set to 'recruited audience'
await page.click("#step-nav-prep-to-send");
await page.selectOption("select", "Recruited Audience");

// review and send
await page.click("text=Ready to Send");
await page.click("text=Yes, publish");

// refresh data
await expect(page.locator('text="My Assortments"')).toBeVisible();
await page.reload();

// get link to survey
await page.click(':text("summer 2024Pants")');
await page.click('.menu-item:has-text("Tests")');
await page.click(`:text("${testTitle}")`);

// copy link for site
await page.click('[data-testid="dropdown-icon"]');
const pagePromise = context.waitForEvent('page');
await page.click('[data-testid="dropdown-content"] :text("Live Link")');
const page2 = await pagePromise;
await page2.waitForLoadState();
const link = page2.url()
await page2.close();

// send 1 valid response
const newContext = await browser.newContext();
const surveyPage = await newContext.newPage();
await surveyPage.goto(link);
surveyPage.on("frameattached", async () => {
  await page.waitForTimeout(1000);
  await page.mouse.click(10, 10);
  await page.keyboard.press("Escape");
});

// start survey
await surveyPage.click(".brand-primary");
await expect(
  surveyPage.locator("md-icon:nth-of-type(4):visible")
).toBeVisible();

// go through survey until we get to free response
await surveyPage.click("md-icon:nth-of-type(3)");
await surveyPage.click(':text("Male")');
await surveyPage.click('#demoQuestions_1 [type="button"]');
await surveyPage.click('#demoQuestions_2 [type="button"]');
await surveyPage.click("#demoQuestions_3 .brand-secondary");

// submit valid free response
await surveyPage.fill('[placeholder="Enter text here"]', "test testing");
await surveyPage.click(':text("Next")');

// escape last frame
await surveyPage.waitForTimeout(1000);
await surveyPage.mouse.click(10, 10);
await surveyPage.keyboard.press("Escape");

await expect(surveyPage.locator(".container p").first()).toContainText("Unfortunately, you haven't qualified for any surveys at this time. We hope you'll try again later.");

// navigate back to start of survey
await surveyPage.goto(link);

// submit profane response
await surveyPage.click(".brand-primary");
await expect(
  surveyPage.locator("md-icon:nth-of-type(4):visible")
).toBeVisible();

// go through survey until we get to free response
await surveyPage.click("md-icon:nth-of-type(3)");
await surveyPage.click(':text("Male")');
await surveyPage.click('#demoQuestions_1 [type="button"]');
await surveyPage.click('#demoQuestions_2 [type="button"]');
await surveyPage.click("#demoQuestions_3 .brand-secondary");

// download profanity text
const filePath = await downloadS3File(surveyPage, "profanity_dictionary.txt");
const rawData = await readFileAsText(filePath);

// parse file
const data = rawData.split("\\").join(" ").split("\n");
const wordsToRemove = ["{", "}"];
const newArray = data.map((element) => {
  return element.replace(/[{}]/g, "");
});

// enter profanity word
const randomWord = getRandomElement(newArray);
await surveyPage.fill('[placeholder="Enter text here"]', randomWord);
await surveyPage.click(':text("Next")');

// escape last frame
await surveyPage.waitForTimeout(1000);
await surveyPage.mouse.click(10, 10);
await surveyPage.keyboard.press("Escape");

await expect(surveyPage.locator(".container p").first()).toContainText("Unfortunately, you haven't qualified for any surveys at this time. We hope you'll try again later.");

// close survey page
await surveyPage.close();

// focus survey results
await page.waitForTimeout(60 * 1000); // wait 1 minute for response to be logged
await page.reload();

// expect 0 responses
await expect(page.locator(':text("1 of 1 (100%)")')).toBeVisible();
await expect(page.locator(':text("2 of 2 (100%)")')).not.toBeVisible();

// download csv
await page.click('[data-testid="dropdown-icon"]');
const [csvDownload] = await Promise.all([
  page.waitForEvent("download"),
  page.click('[data-testid="dropdown-content"] :text("Respondents CSV")'),
]);

// convert file data
const path = await csvDownload.path();
const csvDataRAW = await fse.readFile(path, "utf-8");
expect(csvDataRAW.includes(randomWord)).toBeFalsy();

// delete test
await page.click(".back");
await page.waitForTimeout(5000);
await page.click(`[role="row"]:has-text("${testTitle}") [data-testid="dropdown-icon"]`);
await page.click('[data-testid="dropdown-item"]:has-text("Delete")');
await expect(page.locator('text=Delete Test')).toBeVisible();
await page.click(':text("Yes")');
await expect(page.locator(`[role="row"]:has-text("${testTitle}")`)).not.toBeVisible();
});