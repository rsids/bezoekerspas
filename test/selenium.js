import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {aangemeldeKentekens, aanmelden, afmelden} from "../selenium/parkeren.js";
import {login, quit} from "../selenium/setup.mjs";

const argv = yargs(hideBin(process.argv)).parse()

let result;
try {
    switch (argv.cmd) {
        case 'aangemeldeKentekens':
            await login(argv.username, argv.password)
            result = await aangemeldeKentekens();
            break

        case 'afmelden':
            await login(argv.username, argv.password)
            await afmelden(argv.licenseplate);
            result = await aangemeldeKentekens();
            break;

        case 'aanmelden':
            await login(argv.username, argv.password)
            await aanmelden(argv.licenseplate);
            result = await aangemeldeKentekens();
            break
    }
} catch
    (e) {
    console.error(e);
}
await quit();