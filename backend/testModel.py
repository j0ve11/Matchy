from PIL import Image
import numpy as np
import tensorflow as tf

# Load the model
model = tf.keras.models.load_model('skin_tone_model.h5')

# Define the skin tone classes
skin_tone_classes = ['dark', 'light', 'lighten', 'mid dark', 'mid light', 'mid-dark', 'mid-light']


# Load and preprocess the image
img = Image.open('uploads/Screenshot_2024-11-07_170406.png')

# If the image has an alpha channel (RGBA), convert it to RGB
if img.mode == 'RGBA':
    img = img.convert('RGB')

# Resize the image to 224x224 (expected by the model)
img = img.resize((224, 224))

# Convert the image to a NumPy array and normalize it
img_array = np.array(img) / 255.0

# Expand dimensions to match the model input shape (batch size, height, width, channels)
img_array = np.expand_dims(img_array, axis=0)

# Make predictions
predictions = model.predict(img_array)

# Get the predicted class index
predicted_class_index = np.argmax(predictions, axis=1)[0]

# Check if the predicted index is within bounds
if predicted_class_index >= len(skin_tone_classes):
    print(f"Prediction out of bounds: {predicted_class_index} exceeds number of classes ({len(skin_tone_classes)})")
else:
    predicted_skin_tone = skin_tone_classes[predicted_class_index]
    print(f"Predicted skin tone: {predicted_skin_tone}")
