import {Browser, Builder, By, until} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome.js";


export const getBrowser = async () => {
    try {
        const options = new Options();
        options.addArguments("--profile-directory=Profile 6");
        options.addArguments("--no-sandbox")
        options.addArguments('--user-data-dir=/app/userdata')
        options.addArguments('--headless=new')
        const thenableWebDriver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();
        await thenableWebDriver.get('https://aanvraagparkeren.groningen.nl/DVSPortal/BezoekersApp/www/#/');
        return thenableWebDriver;
    } catch (e) {
        console.error(e);
        return false
    }

}
export const login = async function (username, password) {
    try {
        const nummerTag = await getDriver().findElement(By.css('.main-menu-top + .main-menu-top > div:first-child'));
        const nummerText = await nummerTag.getText();
        if(nummerText.endsWith(username)) {
            console.log('already logged in')
            return true;
        }
    } catch (e) {
        if(e.toString().includes('NoSuchSessionError')) {
            console.log('session expired');
            await restart();
        }
        console.log('Failed to check if already logged in',e)
    }
    try {
        console.log('current title', await getDriver().getTitle());
        await getDriver().wait(until.titleIs('Login'), 1000);
    } catch (e) {
        console.log('actual title', await getDriver().getTitle());
        await logout();
    }
    await getDriver().wait(until.elementLocated(By.id('txtIdentifier')), 5000);
    let usernameInput = await getDriver().findElement(By.id('txtIdentifier'));
    let passwordInput = await getDriver().findElement(By.id('txtPincode'));
    let button = await getDriver().findElement(By.id('btnLogin'));
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

export const logout = async function () {
    try {
        await clickMenuItem('Uitloggen');
    } catch (e) {
        // failed to logout
        console.log('failed to logout 1', e)
    }
    try {
        await getDriver().wait(until.titleIs('Login'), 1000);
    } catch (e) {
        // something is really wrong
        console.log('failed to logout 2', e)
    }

}

export async function clickMenuItem(menuItem) {
    let hamburger = await locate(By.css('.btn.btn-menu'));
    try {
        await(locate(By.css('.main-content-open')))
        console.log('Menu already open')
    } catch (e) {
        await hamburger.click();
    }
    await locate(By.id('mainMenu'));
    const menuItems = await getDriver().findElements(By.css('.main-menu-item'))
    for (let element of menuItems) {
        if (await element.getText() === menuItem) {
            await element.click();
            return;
        }
    }
    throw new Error('menu item not found');
}

export async function locate(locator) {
    await getDriver().wait(until.elementLocated(locator), 2000);
    let element = await getDriver().findElement(locator);
    await getDriver().wait(until.elementIsVisible(element), 2000);
    return element;
}

export const getDriver = () => {
    return driver;
}

export async function restart() {
    try {
        await driver.quit();
    } catch (e) {
        console.log('failed to quit driver', e)
    }
    driver = await getBrowser();
}

let driver = await getBrowser();