const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());

const subscriptionKey = process.env.SUBSCRIPTION_KEY;
const endpoint = process.env.ENDPOINT;

app.post('/api/ocr', upload.single('image'), async (req, res) => {
    const image = req.file;
    const fs = require('fs');
    const imageData = fs.readFileSync(image.path);

    try {
        const response = await axios.post(`${endpoint}/vision/v3.2/read/analyze`, imageData, {
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/octet-stream'
            }
        });

        const operationLocation = response.headers['operation-location'];
        
        // Poll the operation location for the result after 5 seconds
        setTimeout(async () => {
            const resultResponse = await axios.get(operationLocation, {
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey
                }
            });

            res.status(200).json(resultResponse.data);
        }, 5000); // Wait for 5 seconds
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
