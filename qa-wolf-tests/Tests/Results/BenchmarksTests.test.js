const {
    assertText,
    buildUrl,
    logIn,
    goToTest,
    searchTest
  } = require('./Robots/helpers');

// const { MongoClient } = require('mongodb');

// const uri = 'mongodb://localhost:27017';
// const dbName = 'yourDatabaseName';
// const collectionName = 'yourCollectionName';
  
  test('Benchmarks are reset when a closed test is reopened', async () => {
    // log in
    const { page } = await logIn();
    const survey = "Full Copy of FA21 Side Tables CRC SSS"

    await page.click("text=All Tests");
    try {
        const loading = page.locator(".surveys-section >> text=Loading :visible");
        if (await loading.count()) {
          await assertNotText(page, "Loading");
        }
      } catch (err) {
        await page.reload();
      }

    await goToTest(page, survey);
    await page.click('.menu-item:text("Consumer Sentiment")');
    await page.waitForTimeout(3000);
    expect(await page.locator('.rect.brand-avg-zone').isVisible());


    await page.click('.back-button.is-lg')
    await searchTest(page, survey);
    await page.click(`.grow:right-of(:text('Full Copy of FA21 Side Tables CRC SSS'))`);
    await page.click(".open .dropdown-item >> text='Re-open Test'");    
    await page.click(".ms-ds-button--color-primary:has-text('Yes')");

    await assertText(page, "Test re-opened.");
    await goToTest(page, survey);
    expect(await page.locator('.rect.brand-avg-zone').isHidden());

    await page.click('.back-button.is-lg')
    await page.click(`.grow:right-of(:text('Full Copy of FA21 Side Tables CRC SSS'))`);
    await page.click(".open .dropdown-item >> text='Close Test'");  

  });