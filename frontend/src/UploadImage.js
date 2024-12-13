// src/components/UploadImage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [skinTone, setSkinTone] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            setLoading(true);
            // Send image to the backend for classification
            const response = await axios.post('http://127.0.0.1:5000/classify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSkinTone(response.data.skin_tone);
            setRecommendations(response.data.recommendations);
            setLoading(false);
        } catch (error) {
            console.error('Error uploading the image:', error);
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleImageUpload} disabled={loading}>
                {loading ? 'Classifying...' : 'Upload and Get Recommendations'}
            </button>
            {skinTone && <div>Skin Tone: {skinTone}</div>}
            <div>
                {recommendations.length > 0 && (
                    <div>
                        <h3>Recommended Makeup Base:</h3>
                        <ul>
                            {recommendations.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.product}</strong> by {item.brand} (Shade: {item.shade})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadImage;
