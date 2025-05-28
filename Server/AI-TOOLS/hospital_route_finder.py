from flask import Flask, render_template

app = Flask(__name__)

@app.route('/near_map')
def home():
    return render_template('index4.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)
