import express from 'express';
import http from 'http';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {aangemeldeKentekens, aanmelden, afmelden} from "../selenium/parkeren.js";
import {login, logout} from "../selenium/setup.mjs";


// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Create HTTP server instance
const server = http.createServer(app);

app.use(express.json());
app.use(async (req, res, next) => {
    const {username, password, licenseplate} = req.body;
    if (!username || !password || !licenseplate) {
        return res.status(400).json({
            error: 'Missing required fields. Username, password and licenseplate are required.'
        });
    }
    const loggedIn = await login(username, password);
    if (!loggedIn) {
        return res.status(401).json({
            error: 'Invalid username or password'
        });
    }
    next();
})

app.post('/isAangemeld', async (req, res) => {
    const {licenseplate} = req.body;
    const result = await aangemeldeKentekens();
    await logout();
    return res.status(200).json({
        isAangemeld: result.includes(licenseplate)
    });

});

app.post('/aanmelden', async (req, res) => {
    const {licenseplate} = req.body;
    await aanmelden(licenseplate);
    const result = await aangemeldeKentekens();
    await logout();
    if (result) {
        return res.status(200).json({
            aangemeldeKentekens: result
        });
    }
    return res.status(403).send();
})


app.post('/afmelden', async (req, res) => {
    const {licenseplate} = req.body;

    try {
        await afmelden(licenseplate);
    } catch (e) {
        await logout();
        // licenseplate not found
        return res.status(404).send();
    }
    const result = await aangemeldeKentekens();
    if (result) {
        return res.status(200).json({
            aangemeldeKentekens: result
        });
    }
    return res.status(403).send();
})

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
