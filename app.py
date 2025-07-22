from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained SVM model
model = pickle.load(open('svm_best_model.pkl', 'rb'))

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        gender = int(data['gender'])
        age = int(data['age'])
        responses = data['responses']
        features = [gender, age] + responses
        final_input = np.array([features])
        prediction = model.predict(final_input)[0]

        if prediction == 0:
            label = "Auditory"
        elif prediction == 1:
            label = "Kinesthetic"
        else:
            label = "Visual"

        # Return the result template with predicted label
        return jsonify({'learning_style': label})

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/result/<style>')
def result(style):
    return render_template('result.html', learning_style=style)



if __name__ == '__main__':
    app.run(debug=True)
