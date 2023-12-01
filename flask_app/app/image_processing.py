# app/image_processing.py

from keras.utils import load_img
from keras.applications.vgg16 import preprocess_input 
from keras.applications.vgg16 import VGG16
from keras.models import Model
import numpy as np

def load_vgg16_model():
    model = VGG16(weights="imagenet")
    model = Model(inputs=model.inputs, outputs=model.layers[-2].output)
    return model

def extract_features(file, model):
    img = load_img(file, target_size=(224, 224))
    img = np.array(img)
    reshaped_img = img.reshape(1, 224, 224, 3) 
    imgx = preprocess_input(reshaped_img)
    features = model.predict(imgx, use_multiprocessing=True, verbose=0)
    return features