const faker = require('faker');
const {
    assertText,
    buildUrl,
    logIn
  } = require('./Robots/helpers');
  
  test('Edit Name and Department', async () => {
  // login and view settings
const { page } = await logIn();
await assertText(page, "Dashboard");
await page.click(".dropdown-header");
await page.click("text=My Settings");

// edit first name
const firstName = faker.name.firstName();
await page.fill(".ms-text-input input:right-of(:text('First Name'))", firstName);

// edit last name
const lastName = faker.name.lastName();
await page.fill(".ms-text-input input:right-of(:text('Last Name'))", lastName);

//edit department
const departments = ['allocation', 'analytics', 'buying', 'customer insights', 'design', 'ecommerce', 'other'];
const random = Math.floor(Math.random() * departments.length);
const randomDepartment = departments[random];
await page.click(".ms-select-single__value-container");
await page.click(`text=${randomDepartment}`);
await assertText(page, randomDepartment);
await page.click(':text("Update Info")');

// assert changes saved
await assertText(page, `${firstName} ${lastName}`)
});