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

# Set the path to the Tesseract executable (Windows only)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  # Change path if needed

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure the Gemini API
genai.configure(api_key=api_key)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# System prompt for medicine identification
MEDICINE_PROMPT = """
You are a medicine identification assistant. Based on the provided image and any text extracted from it, identify the medicine (e.g., name, type, or brand) and provide a brief description (e.g., uses, common side effects). Always include a disclaimer: 'This is not professional medical advice. Consult a healthcare provider or pharmacist for accurate identification and guidance.' 
- If the image is unclear or not a medicine, state so clearly.
- Avoid definitive diagnoses or prescriptions.
- Keep responses concise and clear.
- Format as:
  - Name: [Medicine name or type]
  - Type: [e.g., Tablet, Capsule]
  - Uses: [Primary uses]
  - Common Side Effects: [If applicable]
  - Disclaimer: [Standard disclaimer]
"""

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/identify_medicine')
def chat_ui():
    return render_template('index2.html')

@app.route('/api/identify_medicine', methods=['POST'])
def identify_medicine():
    try:
        if 'image' not in request.files:
            return jsonify({"response": "Error: No image provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"response": "Error: No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"response": "Error: Invalid file type. Use PNG, JPG, or JPEG."}), 400

        # Read and process image
        img = Image.open(file.stream).convert('RGB')
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

        # OCR text extraction
        extracted_text = pytesseract.image_to_string(img)

        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Prompt with extracted text + image
        response = model.generate_content(
            [
                MEDICINE_PROMPT,
                f"Extracted Text:\n{extracted_text.strip()}",
                {"mime_type": "image/png", "data": img_base64}
            ],
            generation_config={
                "max_output_tokens": 250,
                "temperature": 0.7
            }
        )

        # Clean response
        response_text = response.text.strip()
        return jsonify({"response": response_text})

    except Exception as e:
        error_msg = str(e)
        if "tesseract" in error_msg.lower():
            return jsonify({"response": "Error: Tesseract is not installed or not configured correctly."}), 500
        return jsonify({"response": f"Error: {error_msg}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
