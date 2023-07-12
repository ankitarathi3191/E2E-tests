const { firefox } = require('playwright');

async function assertInputValue(page, selector, value) {
  await page.waitForFunction(({ selector, value }) => {
    const input = document?.querySelector(selector);
    return input?.value === value;
  }, { selector, value });
}

async function assertNotText(page, text) {
  return page.waitForFunction(text => {
    return !document.body.innerText.includes(text);
  }, text);
}

async function assertText(page, text) {
  await page.waitForSelector(`:text("${text}")`, { timeout: 3000 });
}

async function assertNotElement(page, element) {
  await page.waitForFunction(element => {
    return !document.querySelector(element);
  }, element);
}

async function assertElement(page, element) {
  await page.waitForFunction(element => {
    return document.querySelector(element);
  }, element);
}

function buildUrl(route = '/') {
  const baseUrl = (process.env.URL || process.env.DEFAULT_URL || 'https://qa-app.makersights.com')
  // .replace(/\/$/, '');

  return `${baseUrl}${route}`;
}

async function logIn(options = {}) {
  const { email, password } = options;

  // go to landing page
  const { browser, context } = await firefox.launch({ ...options, timeout: 2 * 60 * 1000 });
  await page.goto(buildUrl("/"));

  // fill out log in form
  await page.fill("#username", email || process.env.DEFAULT_EMAIL || 'qa.makersights+automation3@gmail.com');
  await page.click('[type="submit"]:has-text("Continue")');
  await page.fill("#password", password || process.env.DEFAULT_PASSWORD || 'QaMakersights1');
  await page.click('[type="submit"]:has-text("Continue")');

  // await assertText(page, "Settings", { timeout: 3 * 60 * 1000 });

  const cookieAlert = page.locator('div#cookie-policy:has-text("We use cookies on our website") >> button:has-text("Accept")');
  if (await cookieAlert.isVisible()) {
    await cookieAlert.click();
  }

  return { page, context, browser };
}

async function dragDrop(page, dragSelector, dropSelector, { steps } = { steps: 3 }) {
  const drag = await getBoundingBox(page, dragSelector);
  const drop = await getBoundingBox(page, dropSelector);
  await page.mouse.move(drag.x, drag.y);
  await page.mouse.down();
  await page.mouse.move(drop.x, drop.y, { steps });
  await page.mouse.up();
}

async function downloadFile(page, selector) {
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 5 * 60000 }),
    await page.click(selector)
  ]);
  // const path = await download.path();
  // const text = await fse.readFile(path, "utf8");

  // return text;
}

async function getBoundingBox(page, selector) {
  const handle = await page.waitForSelector(selector);
  const box = await handle.boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function turnOnV2() {
  await page.click('[data-icon="cog"]');
  await expect(page.locator('text="Brand Settings"')).toBeVisible();
  await page.check("text=Enable Homepage v2");
  await page.click("text=Dashboard");
}

async function goToTest(page, testName) {
  const testLocator = page.locator(`:text("${testName}")`);
  await page.fill("[placeholder='Search...']", `${testName}`);
  await page.waitForTimeout(3000);
  await testLocator.last().click();
}

async function searchTest(page, testName) {
  const testLocator = page.locator(`:text("${testName}")`);
  await page.fill("[placeholder='Search...']", `${testName}`);
}

/**
 * @param {string} url
 * @returns {string} path to the downloaded image
*/


module.exports = {
  assertInputValue,
  assertNotText,
  assertText,
  assertNotElement,
  buildUrl,
  logIn,
  downloadFile,
  getBoundingBox,
  dragDrop,
  assertElement,
  turnOnV2,
  goToTest,
  searchTest,
};