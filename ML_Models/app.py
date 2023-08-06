
from __future__ import division, print_function
# coding=utf-8
from flask_cors import CORS
import datetime

import sys
import os
import glob
import re
import numpy as np
import cv2
# Keras
from tensorflow.keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Flask utils
from flask import Flask, redirect, url_for, request, render_template,send_file,jsonify,Response
from werkzeug.utils import secure_filename
#from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)

CORS(app)
# Model saved with Keras model.save()

CURRENCY_PATH = 'currency_detection/feature_selection.h5'

# Load your trained model
model = load_model(CURRENCY_PATH)

labelspath = "YOLO-Object-detection-using-OpenCv/coco/coco.names"
labels = open(labelspath).read().strip().split("\n")

np.random.seed(69)
colors = np.random.randint(0, 255, size = (len(labels), 3), dtype= "uint8")

weights_path = "YOLO-Object-detection-using-OpenCv/coco/yolov3.weights"
config_path = "YOLO-Object-detection-using-OpenCv/coco/yolov3.cfg"
net = cv2.dnn.readNetFromDarknet(config_path, weights_path)
def currency_predict(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))

    # Preprocessing the image
    x = image.img_to_array(img)
    # x = np.true_divide(x, 255)
    # Scaling
    x = x/255
    x = np.expand_dims(x, axis=0)

    preds = model.predict(x)
    preds = np.argmax(preds, axis=1)
    if preds == 0:
        preds = "10 "
    elif preds == 1:
        preds = "100"
    elif preds == 2:
        preds = "20"
    elif preds == 3:
        preds = "200"
    elif preds == 4:
        preds = "2000"
    elif preds == 5:
        preds = "50"
    elif preds == 6:
        preds = "500"

    return preds

def objectlocalize(img_path,net):
    image = cv2.imread(img_path)
    (H,W) = image.shape[:2]

    ln = net.getLayerNames()
    ln = [ln[i - 1] for i in net.getUnconnectedOutLayers()]
    blob = cv2.dnn.blobFromImage(image, 1/255.0, (416,416), swapRB=True, crop=False)
    net.setInput(blob)
    layeroutputs = net.forward(ln)
    boxes = []
    confidences =[]
    classids = []
    conf = 0.5
    threshold = 0.3
    for output in layeroutputs:

        for detection in output:

            scores = detection[5:]
            classid = np.argmax(scores)
            confidence = scores[classid]

            if confidence > conf:

                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")

                X = int(centerX - (width/2))
                Y = int(centerY - (height/2))

                boxes.append([X, Y, int(width), int(height)])
                confidences.append(float(confidence))
                classids.append(classid)
    
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, conf, threshold)
    if len(idxs) > 0:
        for i in idxs.flatten():

            (x, y) = (boxes[i][0], boxes[i][1])
            (w, h) = (boxes[i][2], boxes[i][3])

            color = [int(c) for c in colors[classids[i]]]
            cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)

            text = "{}: {:.4f}".format(labels[classids[i]], confidences[i])
            cv2.putText(image, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    ret, buffer = cv2.imencode('.jpg', image)
    return buffer.tobytes()

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']
        uniqueFileName = str(datetime.datetime.now().timestamp()).replace(".","")
        fileNameSplit = f.filename.split(".")
        ext = fileNameSplit[len(fileNameSplit)-1]
        s = uniqueFileName+"."+ext
                # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', s)
        f.save(file_path)

        # Make prediction
        preds = currency_predict(file_path, model)
        result = preds
        print(preds)
        my_dict = {"result": result, "filename": s}
        return jsonify(my_dict)
        # return result
    return None

@app.route('/localizeobject', methods=['GET', 'POST'])
def objectupload():
    # print("ertr")
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['image']
        uniqueFileName = str(datetime.datetime.now().timestamp()).replace(".","")
        # print(uniqueFileName)
        fileNameSplit = f.filename.split(".")
        ext = fileNameSplit[len(fileNameSplit)-1]
        s = uniqueFileName+"."+ext
                # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', s)
        f.save(file_path)

        # Make prediction
        processed_image = objectlocalize(file_path, net)
        return Response(response=processed_image, content_type='image/jpeg')
    return None

@app.route('/uploads/<filename>', methods=['GET'])
def getFile(filename):
    s = os.path.join("uploads",str(filename))

    return send_file(s)


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080,debug = True)
