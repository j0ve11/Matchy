import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const App = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Controls the step the user is on
    const [selectedBrand, setSelectedBrand] = useState(""); // Holds the selected brand
    const [recommendations, setRecommendations] = useState([]); // Stores product recommendations

    // Set the backend URL dynamically based on the environment
    const backendUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://your-backend-name.vercel.app/api' // Replace this with your actual deployed backend URL
            : 'http://localhost:5000/api'; // Local development URL

    // Handle image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle image submission for classification
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);
        setStep(2); // Move to step 2 after image is uploaded

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await axios.post(`${backendUrl}/classify`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.skin_tone) {
                setResult(response.data); // Set the result with skin tone
                setStep(2); // Stay in Step 2 for brand selection
            } else {
                setResult({ error: 'Failed to classify image. Please try again.' });
                setStep(2);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setResult({ error: 'Failed to classify image. Please try again.' });
            setStep(2); // Stay in Step 2 if there's an error
        } finally {
            setLoading(false);
        }
    };

    // Handle brand selection and move to Step 3
    const handleBrandSelection = () => {
        if (!selectedBrand || !result?.skin_tone) {
            alert("Please select a brand and ensure skin tone classification is available.");
            return;
        }
        setStep(3); // Proceed to Step 3 to fetch recommendations
    };

    // Fetch product recommendations based on skin tone and brand
    const fetchRecommendations = async () => {
        setLoading(true);

        try {
            if (!result?.skin_tone || !selectedBrand) {
                alert("Please ensure the skin tone classification is available and a brand is selected.");
                return;
            }

            // Send the correct data to the backend for recommendations
            const response = await axios.post(`${backendUrl}/recommendations`, {
                skin_tone: result.skin_tone,
                brand: selectedBrand,
            });

            console.log("Response from recommendations API: ", response.data); // Log the response to debug

            if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
                setRecommendations(response.data.recommendations); // Store the recommendations
            } else {
                alert("No recommendations found. Please try a different brand or skin tone.");
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert("Failed to fetch recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // UseEffect to fetch recommendations when step 3 is reached
    useEffect(() => {
        if (step === 3) {
            fetchRecommendations();
        }
    }, [step, result, selectedBrand]); // Dependency array to trigger when these values change

    // Reset state for a fresh start (go back to Step 1)
    const handleBackToStart = () => {
        setStep(1);
        setImage(null);
        setResult(null);
        setRecommendations([]);
        setSelectedBrand("");
    };

    // Render the app UI
    return (
        <div className="App">
            <h1>Matchy-Matchy</h1>
            <h2>Skin Tone Classification & Base Makeup Recommendation</h2>

            {/* Step 1 - Upload Image */}
            {step === 1 && (
                <form onSubmit={handleSubmit}>
                    <div className="file-upload">
                        <label htmlFor="file-upload" className="upload-label">
                            {image ? "Change Image" : "Upload Image"}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <button type="submit" disabled={loading || !image}>Submit Image</button>
                </form>
            )}

            {loading && <div className="loading">Loading...</div>}

            {/* Step 2 - Display Skin Tone and Brand Selection */}
            {step === 2 && result && (
                <div>
                    <h2>Your Skin Tone: {result.skin_tone}</h2>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                        <option value="">Select a brand</option>
                        <option value="Ever Bilena">Ever Bilena</option>
                        <option value="Colourette Cosmetics">Colourette Cosmetics</option>
                        <option value="Happy Skin">Happy Skin</option>
                        <option value="BLK Cosmetics">BLK Cosmetics</option>
                        <option value="Vice Cosmetics">Vice Cosmetics</option>
                        <option value="Issy">Issy</option>
                    </select>
                    <button onClick={handleBrandSelection}>Get Recommendations</button>
                </div>
            )}

            {step === 3 && recommendations.length > 0 && (
                <div className="recommendations-container">
                    <h2>Recommended Products</h2>
                    <div className="recommendations-grid">
                        {recommendations.map((item, index) => (
                            <div key={index} className="recommendation-card">
                                <p><strong>{item.product}</strong></p>
                                <p>Shade: {item.shade}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Handle case when no recommendations are found */}
            {step === 3 && recommendations.length === 0 && !loading && (
                <div>No recommendations available. Please try a different brand or skin tone.</div>
            )}

            {/* Button to go back to Step 1 */}
            {step !== 1 && (
                <button className="back-to-start" onClick={handleBackToStart}>
                    Back to Start
                </button>
            )}
        </div>
    );
};

export default App;
