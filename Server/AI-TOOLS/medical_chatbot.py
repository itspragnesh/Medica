from flask import Flask, request, jsonify, render_template
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS

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

# System prompt for the chatbot
SYSTEM_PROMPT = """
You are a medicine chatbot providing general information about medical conditions, treatments, and commonly used medications. Always include a disclaimer in your response: 'This is not professional medical advice. Consult a healthcare provider for medical concerns.'

- Provide accurate, general information about symptoms, conditions, possible treatments, and commonly used medicines.
- If the user requests "related medicines" or asks for medications, you may list commonly prescribed or over-the-counter medicines used for that condition, but make it clear they must consult a doctor before using any.
- If the query suggests a medical emergency (e.g., overdose, chest pain, severe allergic reaction), urge the user to seek immediate medical help.
- Keep responses concise, clear, and empathetic.
- If the user requests information 'as points' or 'in points,' format the response as a bulleted list using the '❥' character (e.g., ❥ Point 1\n❥ Point 2).
"""

# Emergency keywords list
EMERGENCY_KEYWORDS = ["chest pain", "difficulty breathing", "severe bleeding", "unconscious", "seizure"]
@app.route('/chat')
def chat_ui():
    return render_template('index1.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "").lower().strip()

        # Check for emergency keywords
        if any(keyword in user_input for keyword in EMERGENCY_KEYWORDS):
            response_text = "This sounds like a medical emergency. Please seek immediate medical help by calling emergency services or visiting the nearest hospital. This is not professional medical advice. Consult a healthcare provider for medical concerns."
        else:
            # Initialize the Gemini model
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"{SYSTEM_PROMPT}\nUser: {user_input}"
            
            response = model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 1500,
                    "temperature": 0.7
                }
            )
            
            # Clean response
            response_text = response.text.strip()

            # Bullet format if requested
            if "as points" in user_input or "in points" in user_input:
                lines = response_text.split('. ')
                if not response_text.startswith('-'):
                    formatted = []
                    for line in lines:
                        if line.strip() and "This is not professional medical advice" not in line:
                            formatted.append(f"- {line.strip()}.")
                        else:
                            formatted.append(line.strip())
                    response_text = "\n".join(formatted)

        return jsonify({"response": response_text})

    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg.lower():
            return jsonify({"response": "Error: Invalid API key. Check your GEMINI_API_KEY."}), 500
        return jsonify({"response": f"Error: {error_msg}"}), 500



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)