// const { test, expect } = require('@playwright/test');
const {
    assertText,
    assertNotText,
    buildUrl,
    logIn
  } = require('./Robots/helpers');


test('User can switch brand', async () => {
  // log in
const { page } = await logIn();

// assert log in successful
await assertText(page, "Dashboard");

// assert login contains name
expect(await page.locator(".ms-avatar__alt").isVisible()).toBeTruthy();
expect(await page.locator('[data-testid="dropdown"] .dropdown-title').isVisible()).toBeTruthy();

//click settings dropdown (we should only expect 4 brands - QA Wolves, QA Static, Daugherty and Sons, and Comprehensive Solution Demo (2021))
await page.click(".dropdown-header");
// await expect(page.locator('[data-testid="dropdown-item"]:has-text("QA Wolves")')).toHaveCount(1);
// await expect(page.locator('[data-testid="dropdown-item"]:has-text("QA Static")')).toHaveCount(1);
// await expect(page.locator('[data-testid="dropdown-item"]:has-text("Daugherty and Sons")')).toHaveCount(1);
expect(await page.locator('[data-testid="dropdown-item"]:has-text("QA Wolves")').count()).toBe(1);
expect(await page.locator('[data-testid="dropdown-item"]:has-text("QA Static")').count()).toBe(1);
expect(await page.locator('[data-testid="dropdown-item"]:has-text("Daugherty and Sons")').count()).toBe(1);
// await expect(page.locator('[data-testid="dropdown-item"]:has-text("Comprehensive Solution Demo (2021)")')).toHaveCount(1);
await page.waitForTimeout(3000);

// select and assert QA Static brand
await page.click( "text=QA Static");
await page.waitForTimeout(6000);
await assertText(page, "Holiday 2023\nGeneric");

// select QA Wolves brand
await page.click(".dropdown-header");
await page.click("text=QA Wolves");
// assert brand switched
await assertNotText(page, "Holiday 2023\nGeneric");
await assertNotText(page, "Fall 2024\nGeneric");
await assertText(page, "Resort 2024\nShirts");

// select daugherty and sons brand
await page.click(".dropdown-header");
await page.click(".open >> text='Daugherty and Sons'");
// assert brand switched
await assertNotText(page, "Holiday 2023\nGeneric");
await assertText(page, "Fall 2024\nGeneric");

// select first daugherty and sons brand
await page.click(".dropdown-header", {delay: 500});
await page.click(".open >> text='QA Wolves'", {delay: 500});
await page.waitForTimeout(7000);
// assert brand switched
await assertNotText(page, "Holiday 2023\nGeneric");
expect(await page.locator('text=Resort 2024').isVisible()).toBeTruthy()
});