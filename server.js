const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows requests from any origin
app.use(bodyParser.json()); // Parses JSON request bodies

// API endpoint to forward data to Zapier
app.post('/send-to-zapier', async (req, res) => {
    try {
        const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/11962945/2cxz6j6/'; // Replace with your actual Zapier Webhook URL

        const response = await fetch(zapierWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error(`Zapier request failed with status: ${response.status}`);
        }

        const responseData = await response.text();
        res.json({ success: true, message: 'Data sent to Zapier', zapierResponse: responseData });
    } catch (error) {
        console.error('Error sending to Zapier:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
