from flask import Flask, request, jsonify, render_template
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
from werkzeug.utils import secure_filename
import base64
from io import BytesIO
from PIL import Image
import pytesseract

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Set the path to the Tesseract executable (modify as needed for your system)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Configure Gemini API
genai.configure(api_key=api_key)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Prescription analysis system prompt
PRESCRIPTION_PROMPT = """
You are a prescription analysis assistant. Based on the provided OCR-extracted text and the image of a prescription, extract and summarize key details such as:
- Medication names, dosages, administration instructions
- Patient information if available
- Brief description of medication uses

Format your output like:
- Medications: [...]
- Uses: [...]
- Patient Information: [...]
- Disclaimer: 'This is not professional medical advice. Consult a healthcare provider or pharmacist for accurate interpretation and guidance.'

Avoid diagnoses or treatment recommendations. If the image or text is unclear or not a prescription, say so.
"""

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/analyze')
def chat_ui():
    return render_template('index3.html')

@app.route('/api/analyze', methods=['POST'])
def identify_medicine():
    try:
        if 'image' not in request.files:
            return jsonify({"response": "Error: No image provided"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"response": "Error: No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"response": "Error: Invalid file type. Use PNG, JPG, or JPEG."}), 400

        # Read image and convert to base64
        img = Image.open(file.stream)
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

        # OCR text extraction using Tesseract
        extracted_text = pytesseract.image_to_string(img)

        # Gemini model initialization
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Prepare message input
        response = model.generate_content(
            [
                PRESCRIPTION_PROMPT,
                f"Extracted Text from OCR:\n{extracted_text}",
                {"mime_type": "image/png", "data": img_base64}
            ],
            generation_config={
                "max_output_tokens": 400,
                "temperature": 0.7
            }
        )

        # Return Gemini's response
        response_text = response.text.strip()
        return jsonify({"response": response_text})

    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg.lower():
            return jsonify({"response": "Error: Invalid API key. Check your GEMINI_API_KEY."}), 500
        return jsonify({"response": f"Error: {error_msg}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5003, debug=True)
