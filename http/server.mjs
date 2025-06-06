import express from 'express';
import http from 'http';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {aangemeldeKentekens, aanmelden} from "../selenium/parkeren.js";
import {login} from "../selenium/setup.mjs";


// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Create HTTP server instance
const server = http.createServer(app);

app.use(express.json());

app.post('/isAangemeld', async (req, res) => {
    const {username, password, licenseplate} = req.body;

    console.log({username, password, licenseplate});
    await login(username, password);
    const result = await aangemeldeKentekens();
    return res.status(200).json({
        isAangemeld: result.includes(licenseplate)
    });

    // const result = await login()
    if (!username || !password || !licenseplate) {
        return res.status(400).json({
            error: 'Missing required fields. Username, password, and licenseplate are required.'
        });
    }

});

app.post('/aanmelden', async (req, res) => {
    const {username, password, licenseplate} = req.body;
    await login(username, password);
     await aanmelden(licenseplate);
    const result = await aangemeldeKentekens();
    if (result) {
        return res.status(200).json({
            aangemeldeKentekens: result
        });
    }
    return res.status(403);
})


app.post('/afmelden', async (req, res) => {
    const {username, password, licenseplate} = req.body;
    await login(username, password);
    await aanmelden(licenseplate);
    const result = await aangemeldeKentekens();
    if (result) {
        return res.status(200).json({
            aangemeldeKentekens: result
        });
    }
    return res.status(403);
})

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
