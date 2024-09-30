import json

import pandas as pd

import network as ntw

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

Network = ntw.create_network(ntw.load_training_data())


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save("temp.csv")
        data = load_csv_file(Network)
        return jsonify(data)


@app.route("/makePrediction", methods=['POST', 'GET'])
def make_prediction():
    print(request.json)
    data = request.json['list']
    values = []
    for i in data:
        value = {
            "exam": float(i['exam']),
            "deadline": float(i['deadline']),
            "complition": float(i['complition']),
            "success": float(ntw.show_predict(Network,
                [[float(i['exam'])*0.01, float(i['deadline'])*0.01, float(i['complition'])*0.01]])[0]),
        }
        values.append(value)
        print(values)
    return jsonify(values)


def load_csv_file(neural_network):
    data = pd.read_csv('temp.csv')
    predicts = ntw.show_predict(neural_network, data[['exam', 'deadline', 'complition']])
    values = []

    for i in range(len(data)):
        student = (data.loc[i, "exam"], data.loc[i, "deadline"], data.loc[i, "complition"], "Высокая:" + str(predicts[i]))
        value = {
            "exam": float(data.loc[i, "exam"]),
            "deadline": float(data.loc[i, "deadline"]),
            "complition": float(data.loc[i, "complition"]),
            "success": float(predicts[i]),
        }
        values.append(value)
    return values


if __name__ == '__main__':
    app.run()
