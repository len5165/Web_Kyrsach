import os
import wget
import pandas as pd
import keras
from keras import *
from keras.layers import Dense


def load_training_data():
    check_file = os.path.exists("data.csv")
    if not check_file:
        wget.download("http://xyla.istu.webappz.ru/neuron/data.csv")

    data = pd.read_csv('data.csv')
    return data


def create_network(data):
    neural_network = Sequential()
    neural_network.add(Dense(3, input_shape=(3,), activation='sigmoid'))
    neural_network.add(Dense(1, activation='sigmoid'))

    neural_network.compile(loss='mean_squared_error', optimizer=keras.optimizers.Adam(0.01))

    train_data = data[['exam', 'deadline', 'complition']]
    train_output = data['successPass']

    neural_network.fit(train_data, train_output, epochs=300, verbose=0)

    return neural_network


def show_predict(neural_network, data):
    predicts = neural_network.predict(data)

    if len(predicts) == 1:
        return predicts[0]

    return predicts
