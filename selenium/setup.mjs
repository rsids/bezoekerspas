import {Browser, Builder, By, until} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";


export const getBrowser = async () => {
    try {
        const d = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions((new Options()).addArguments('--headless=new'))
            .build();
        await d.get('https://aanvraagparkeren.groningen.nl/DVSPortal/BezoekersApp/www/#/');
        return d;
    } catch (e) {
        console.error(e);
        return false
    }

}
export const login = async function (username, password) {
    await driver.wait(until.titleIs('Login'), 1000);
    await driver.wait(until.elementLocated(By.id('txtIdentifier')), 5000);
    let usernameInput = await driver.findElement(By.id('txtIdentifier'));
    let passwordInput = await driver.findElement(By.id('txtPincode'));
    let button = await driver.findElement(By.id('btnLogin'));
    await usernameInput.clear();
    await passwordInput.clear();
    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(password);
    await button.click();
    try {
        const err = await locate(By.css('.has-error'));
        return false;
    } catch (e) {

    }
    return true;
}

export const logout =async function () {
    try {
        await clickMenuItem('Uitloggen');
    } catch (e) {
        // failed to logout
        console.log('failed to logout 1')
    }
    try {
        await driver.wait(until.titleIs('Login'), 1000);
    } catch (e) {
        // something is really wrong
        console.log('failed to logout 2')
    }

}

export const quit = async function () {
    driver.quit();
}


export async function clickMenuItem(menuItem) {
    let hamburger = await locate(By.css('.btn.btn-menu'));
    await hamburger.click();
    await locate(By.id('mainMenu'));
    const menuItems = await driver.findElements(By.css('.main-menu-item'))
    for (let element of menuItems) {
        if (await element.getText() === menuItem) {
            await element.click();
            return;
        }
    }
    throw new Error('menu item not found');
}

export async function locate(locator) {
    await driver.wait(until.elementLocated(locator), 3000);
    let element = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(element), 3000);
    return element;
}

export const driver = await getBrowser();