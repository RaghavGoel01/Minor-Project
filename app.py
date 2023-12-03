import cv2
import numpy as np
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from keras.models import model_from_json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/', methods=["GET"])
def home():
    if request.method == "GET":
        return render_template("index.html")
    
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