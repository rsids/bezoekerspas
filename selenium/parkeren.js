import {By, until} from "selenium-webdriver";
import {clickMenuItem, driver, locate} from "./setup.mjs";

const aanmelden = async function (licenseplate) {
    try {
        await clickMenuItem('Kenteken aanmelden');
    } catch (e) {
        return;
    }
    await driver.wait(until.titleIs('Kenteken aanmelden'), 1000);
    await driver.wait(until.elementLocated(By.id('txtLicenseplate')), 5000);
    let licenseplateInput = await driver.findElement(By.id('txtLicenseplate'));
    let submit = await driver.findElement(By.id('btnStartReservation'));
    await licenseplateInput.sendKeys(licenseplate);
    await submit.click();
    const licensePlateBig = await locate(By.css('.licensePlateBig'));
    if (await licensePlateBig.getText() === licenseplate) {
        return;
    } else {
        throw new Error(`licenseplate ${licenseplate} not found`);
    }
}


const afmelden = async function (licenseplate) {
    try {
        await clickMenuItem('Actief');
    } catch (e) {
        // no active reservations
        return;
    }
    const title = await locate(By.tagName('h1'));
    if (await title.getText() === 'Actieve reservering') {
        await _afmelden(licenseplate);
    } else {
        const licensePlateElements = await driver.findElements(By.css('#view table tbody tr td:first-child'))
        for (let element of licensePlateElements) {
            if (await element.getText() === licenseplate) {
                await element.click();
                await _afmelden(licenseplate);
            }
        }
    }


}

const aangemeldeKentekens = async function () {
    try {

        await clickMenuItem('Actief');
    } catch (e) {
        // menu item not found, no active reservations
        return [];
    }
    //single: licensePlateBig
    const title = await locate(By.tagName('h1'));
    if (await title.getText() === 'Actieve reservering') {
        const licensePlateBig = await locate(By.css('.licensePlateBig'));
        return [await licensePlateBig.getText()];
    } else if (await title.getText() === 'Actieve reserveringen') {
        const licensePlateElements = await driver.findElements(By.css('#view table tbody tr td:first-child'))
        const plates = []
        for (let element of licensePlateElements) {
            plates.push(await element.getText());

        }
        return plates;
    } else {
        throw new Error('unknown title')
    }

}


async function _afmelden(licenseplate) {
    const licensePlateBig = await locate(By.css('.licensePlateBig'));
    if (await licensePlateBig.getText() === licenseplate) {
        const submit = await locate(By.id('btnEndReservation'));
        await submit.click();
        await locate(By.id('btnStartReservation'));
    } else {
        throw new Error(`licenseplate ${licenseplate} not found`);
    }
}


export {aanmelden, afmelden, aangemeldeKentekens};