const {
  assertText,
  buildUrl,
  logIn
} = require('./Robots/helpers');

test('User can log in and log out', async () => {
  // log in
  const { page } = await logIn();
  await assertText(page, "Dashboard");
  await assertText(page, "All Tests");
  await assertText(page, "All Products");
  await page.click(".dropdown-header");
  await assertText(page, "Settings");

// log out
// await page.click(".dropdown-header");
await page.click("text=Sign Out");

// assert logged out
await assertText(page, "Log in");
});