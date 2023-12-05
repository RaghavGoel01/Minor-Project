import cv2
import os
import numpy as np
import librosa
import pickle
import requests
import matplotlib.pyplot as plt
#from deepface import Deepface
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from keras.models import model_from_json
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

audio_upload_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'audio')
images_upload_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'images')

with open('model/scaler2.pickle', 'rb') as f:
    scaler2 = pickle.load(f)

with open('model/encoder2.pickle', 'rb') as f:
    encoder2 = pickle.load(f)


def load_audio_sentiment_model():
    model_architecture_path = 'model/CNN_model.json'
    model_weights_path = 'model/CNN_model_weights.h5'    
    with open(model_architecture_path, 'r') as json_file:
        loaded_model_json = json_file.read()
    audio_sentiment_model = model_from_json(loaded_model_json)
    audio_sentiment_model.load_weights(model_weights_path)

    return audio_sentiment_model

#################################### PREPROCESSING ###################################################
def zcr(data,frame_length,hop_length):
    zcr=librosa.feature.zero_crossing_rate(data,frame_length=frame_length,hop_length=hop_length)
    return np.squeeze(zcr)

def rmse(data,frame_length,hop_length):
    rmse=librosa.feature.rms(y = data ,frame_length=2048,hop_length=512)
    return np.squeeze(rmse)

def mfcc(data,sr,frame_length=2048,hop_length=512,flatten:bool=True):
    mfcc=librosa.feature.mfcc(y = data,sr=sr)
    return np.squeeze(mfcc.T)if not flatten else np.ravel(mfcc.T)

def extract_features(data,sr=22050,frame_length=2048,hop_length=512):
    result=np.array([])
    result=np.hstack((result,
                      zcr(data,frame_length,hop_length),
                      rmse(data,2048,512),
                      mfcc(data,sr,frame_length,hop_length)
                     ))
    return result

def get_predict_feat(path):
    d, s_rate= librosa.load(path, duration=2.5, offset=0.6)
    res=extract_features(d)
    result=np.array(res)
    result=np.reshape(result,newshape=(1,2376))
    i_result = scaler2.transform(result)
    final_result=np.expand_dims(i_result, axis=2)
    return final_result

emotions1={0:'Angry', 1:'Disgust', 2:'Fear', 3:'Happy', 4:'Neutral', 5:'Sad', 6:'Surprise'}

def prediction(path1, model):
    res=get_predict_feat(path1)
    predictions = model.predict(res)
    y_pred = encoder2.inverse_transform(predictions)
    return getJson(y_pred[0][0], predictions)

def getJson(sent, predicted_proba):
    # Round the elements of the predicted_proba NumPy array to two decimal places
    predicted_proba_list = np.round(predicted_proba, 2).tolist()
    predicted_proba_list = predicted_proba_list[0]
    print(predicted_proba_list)
    if len(predicted_proba_list) >= 7:
        return {
            "score_angry": predicted_proba_list[0],
            "score_disgust": predicted_proba_list[1],
            "score_fear": predicted_proba_list[2],
            "score_happy": predicted_proba_list[3],
            "score_neutral": predicted_proba_list[4],
            "score_sad": predicted_proba_list[5],
            "score_surprise": predicted_proba_list[6],
            "prominent_sentiment": sent
        }
    else:
        return {
            "error": "Not enough elements in predicted_proba_list"
        }

####################################### ROUTES ####################################################

@app.route('/', methods=["GET", "POST"])
def home():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":    
        audio_file = request.files.get("audio-file")
        if audio_file:
            filename = secure_filename(audio_file.filename)
            file_path = os.path.join(audio_upload_folder, filename)
            audio_file.save(file_path)
            audio_sentiment_model = load_audio_sentiment_model()
            try:
                print("predicting emotion")
                emotion = prediction(file_path, audio_sentiment_model)
                return jsonify(emotion)
            except Exception as e:
                return jsonify({"error": str(e)})
        
        image_file = request.files.get("photo-file")
        if image_file:
            print("inside image processing")
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(images_upload_folder, filename)
            image_file.save(file_path)

            
    return jsonify({"error": "Invalid request"})
    
@app.route('/music', methods = ['GET'])
def music():
    if request.method == "GET":
        return render_template('music.html')
    
@app.route('/youtube', methods = ['GET'])
def youtube():
    if request.method == "GET":
        return render_template('youtube.html')

@app.route('/books', methods = ['GET'])
def books():
    if request.method == "GET":
        return render_template('books.html')
    
@app.route('/movie', methods = ['GET'])
def movie():
    if request.method == "GET":
        return render_template('movie.html')
    
if __name__ == '__main__':
    app.run(debug=True)