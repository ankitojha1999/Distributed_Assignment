import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5001/api/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Extract text from response
            const readResults = response.data.analyzeResult.readResults;
            const text = readResults.map(page => 
                page.lines.map(line => line.text).join('\n')
            ).join('\n\n');

            setExtractedText(text); // Set the formatted text

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>OCR Analyzer</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Analyze</button>
            <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                {extractedText}
            </div>
        </div>
    );
}

export default App;
