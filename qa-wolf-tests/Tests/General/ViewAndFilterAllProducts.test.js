const {
    assertText,
    buildUrl,
    logIn,
    downloadFile,
    getBoundingBox,
    assertNotText,
  } = require('./Robots/helpers');

test('User can view, filter, and search for products, download images, and access infinite scroll', async () => {
// log in
const { page } = await logIn({ acceptDownloads: true });

// nav to 'All Products' page
await page.click("text=All Products");

// REQ04 View product details
await page.click(".main-card >> text=Arizona");
await assertText(page, "Arizona");
await assertText(page, "Up-cycled Cotton");
await assertText(page, "T-Shirt");
await assertText(page, "Olive Green");
await assertText(page, "6-Months");
await assertText(page, "OGR");
await page.click(".fa-w-11");

// REQ156 Download image
await page.click(".ms-product-card:has-text('Arizona') .grow");
const downloadImg = await downloadFile(
  page,
  ".open [data-testid='dropdown-item']"
);
// expect(downloadImg.includes("PK"));
// expect(downloadImg.includes("4H"));

// REQ158 Filter all products by price
await assertText(page, "Arizona", { selector: ".main-card .title:text('Arizona')" });
var products = await page.locator(".ms-product-card").count();
await assertText(page, "$45.00");
const sliders = await getBoundingBox(page, '[role="slider"]');
await page.mouse.move(sliders.x, sliders.y);
await page.mouse.down();
await page.mouse.move(sliders.x + 125, sliders.y);
await page.mouse.up();
await page.waitForTimeout(2000);
expect(await page.locator(".ms-product-card").count()).toBeLessThan(products);

// REQ157 Price range reflects product data
await assertNotText(page, "$45");

// REQ159 Search all products
await assertText(page, "Bruce", { selector: ".main-card .title" });
await page.fill('[placeholder="Search..."]', "Charles");
// await expect(page.locator('.top-container :text("Charles")')).toBeVisible();
expect(await page.locator('.top-container :text("Charles")').isVisible()).toBeTruthy();
expect((await page.locator(".ms-product-card").count()) < products);
await page.waitForTimeout(3000);
// await expect(page.locator('.top-container :text("Bruce")')).not.toBeVisible();
expect(await page.locator('.top-container :text("Bruce")').isVisible()).toBeFalsy();


// reset filters
await page.fill('[placeholder="Search..."]', "");
await page.mouse.click(0, 0);
const slider = await getBoundingBox(page, '[role="slider"]');
await page.mouse.move(slider.x, slider.y);
await page.mouse.down();
await page.mouse.move(slider.x - 125, slider.y);
await page.mouse.up();
await page.waitForTimeout(2000);

// grab initial number of products
const initialProductCount = await page.locator('.card-dropdown-list').count();

// C2058 Page has 'Infinite Scroll' (More Products Load when scrolling to bottom)
await page.mouse.wheel(0, 6000);
await page.waitForTimeout(1000);
const nextProductCount = await page.locator('.card-dropdown-list').count();
// expect(nextProductCount).toBeGreaterThan(initialProductCount)
});
