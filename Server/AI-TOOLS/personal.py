from flask import Flask, render_template, request
import google.generativeai as genai

app = Flask(__name__)

# Configure your Gemini API key
GOOGLE_API_KEY = 'AIzaSyBW8D8zC1X8rImAuPH7TATSNzpIY7lsKtY'  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)

def calculate_bmi(weight, height):
    height_m = height / 100
    return round(weight / (height_m ** 2), 2)

def analyze_health(age, gender, bmi, lifestyle, condition):
    recommendations = []
    risk_flags = []

    # BMI evaluation
    if bmi < 18.5:
        recommendations.append("Underweight - consider nutrient-rich foods.")
    elif bmi > 25:
        recommendations.append("Overweight - reduce calorie intake and exercise.")
    else:
        recommendations.append("Healthy weight - maintain current lifestyle.")

    # Lifestyle suggestions
    if lifestyle == "Sedentary":
        recommendations.append("Increase physical activity to at least 30 minutes daily.")
    elif lifestyle == "Moderate":
        recommendations.append("Keep active and consider strength training.")
    else:
        recommendations.append("Excellent activity level. Keep it up!")

    # Condition-based advice
    cond = condition.lower()
    if "diabetes" in cond:
        recommendations.append("Monitor sugar intake and check blood glucose regularly.")
        if bmi > 30:
            risk_flags.append("High risk: Obesity increases diabetes complications.")
    if "hypertension" in cond:
        recommendations.append("Reduce salt intake and manage stress.")
    if "pcos" in cond:
        recommendations.append("Adopt a low-carb diet and regular exercise.")
        if bmi > 28:
            risk_flags.append("PCOS combined with high BMI increases insulin resistance risk.")

    return recommendations, risk_flags

def list_available_models():
    """Fetch and return a list of available models from the Gemini API."""
    try:
        models = genai.list_models()
        return [model.name for model in models if 'generateContent' in model.supported_generation_methods]
    except Exception as e:
        return [f"Error fetching models: {str(e)}"]

def generate_explanation_with_gemini(recommendations, risk_flags):
    prompt_text = f"""
    I have these health recommendations for a user:
    {', '.join(recommendations)}

    And these health risk flags:
    {', '.join(risk_flags) if risk_flags else 'None'}

    Please create a friendly, easy-to-understand health report summarizing these points for the user.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Use a supported model
        response = model.generate_content(prompt_text)
        return response.text.strip()
    except Exception as e:
        available_models = list_available_models()
        error_msg = f"Error generating report: {str(e)}. Available models: {', '.join(available_models)}"
        return error_msg

@app.route('/personal', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            age = int(request.form['age'])
            gender = request.form['gender']
            weight = float(request.form['weight'])
            height = float(request.form['height'])
            lifestyle = request.form['lifestyle']
            condition = request.form['condition']

            bmi = calculate_bmi(weight, height)
            recs, flags = analyze_health(age, gender, bmi, lifestyle, condition)
            gemini_report = generate_explanation_with_gemini(recs, flags)

            return render_template('index5.html', bmi=bmi, gemini_output=gemini_report)
        except ValueError as e:
            return render_template('index5.html', error=f"Invalid input: {str(e)}")
        except Exception as e:
            return render_template('index5.html', error=f"An error occurred: {str(e)}")

    return render_template('index5.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)