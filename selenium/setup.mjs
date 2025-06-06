import {Browser, Builder, By, until} from "selenium-webdriver";


export const getBrowser = async () => {
    try {
        const d = await new Builder().forBrowser(Browser.CHROME).build();
        await d.get('https://aanvraagparkeren.groningen.nl/DVSPortal/BezoekersApp/www/#/');
        return d;
    } catch (e) {
        return false
    }

}
export const login = async function (username, password) {
    await driver.wait(until.titleIs('Login'), 1000);
    await driver.wait(until.elementLocated(By.id('txtIdentifier')), 5000);
    let usernameInput = await driver.findElement(By.id('txtIdentifier'));
    let passwordInput = await driver.findElement(By.id('txtPincode'));
    let button = await driver.findElement(By.id('btnLogin'));
    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(password)
    await button.click();
}

export const quit = async function () {
    driver.quit();
}

export const driver = await getBrowser();