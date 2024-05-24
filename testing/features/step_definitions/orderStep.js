const { After, Given, When, Then } = require('cucumber')
const { Builder, By, until } = require('selenium-webdriver')

let driver

Given('I am on the homepage', async function () {
  driver = await new Builder().forBrowser('chrome').build()
  await driver.get('https://localhost:3000')
  console.log('Successfully navigated to the homepage.')
})

When('I click on the cart button in the navbar', async function () {
  const cartButton = await driver.findElement(By.className('cart-button'))
  await cartButton.click()
  console.log('Clicked on the cart button.')
})

Then('I should be on the cart page', async function () {
  await driver.wait(until.urlContains('/cart'))
  console.log('Successfully navigated to the cart page.')
})

When('I click on the proceed to checkout button', async function () {
  const checkoutButton = await driver.findElement(
    By.className('proceed-to-checkout')
  )
  await checkoutButton.click()
  console.log('Clicked on the proceed to checkout button.')
})

Then('I should be on the shipping page', async function () {
  await driver.wait(until.urlContains('/shipping'))
  console.log('Successfully navigated to the shipping page.')
})

When(
  'I input my fullname, address, city, postalcode, and country',
  async function () {
    const fullnameInput = await driver.findElement(By.id('fullname'))
    const addressInput = await driver.findElement(By.id('address'))
    const cityInput = await driver.findElement(By.id('city'))
    const postalcodeInput = await driver.findElement(By.id('postalcode'))
    const countryInput = await driver.findElement(By.id('country'))

    await fullnameInput.sendKeys('John Doe')
    await addressInput.sendKeys('123 Main Street')
    await cityInput.sendKeys('Anytown')
    await postalcodeInput.sendKeys('12345')
    await countryInput.sendKeys('Country')

    console.log('Filled in shipping information.')
  }
)

When('I click on the next button', async function () {
  const nextButton = await driver.findElement(By.className('next-button'))
  await nextButton.click()
  console.log('Clicked on the next button.')
})

Then('I should be on the payment page', async function () {
  await driver.wait(until.urlContains('/payment'))
  console.log('Successfully navigated to the payment page.')
})

When('I click on the next button again', async function () {
  const nextButton = await driver.findElement(By.className('next-button'))
  await nextButton.click()
  console.log('Clicked on the next button.')
})

Then('I should be on the place order page', async function () {
  await driver.wait(until.urlContains('/place-order'))
  console.log('Successfully navigated to the place order page.')
})

When('I click on the Place Order button', async function () {
  const placeOrderButton = await driver.findElement(
    By.className('place-order-button')
  )
  await placeOrderButton.click()
  console.log('Clicked on the Place Order button.')
})

Then('I should be on the order confirmation page', async function () {
  await driver.wait(until.urlMatches(/\/orders\/\d+/))
  console.log('Successfully navigated to the order confirmation page.')
})

After(async function () {
  await driver.quit()
})
