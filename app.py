from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)


model = pickle.load(open('svm_best_model.pkl', 'rb'))

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        responses = data['responses']

        final_input = np.array([responses])
        prediction = model.predict(final_input)[0]

        if prediction == 0:
            label = "Visual"
        elif prediction == 1:
            label = "Kinesthetic"
        else:
            label = "Auditory"

        
        return jsonify({'learning_style': label})

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/result/<style>')
def result(style):
    return render_template('result.html', learning_style=style)



if __name__ == '__main__':
    app.run(debug=True)
