# app/cluster_processing.py

import pickle
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm

def load_pca_model(file_path):
    with open(file_path, 'rb') as f:
        pca_model = pickle.load(f)
    return pca_model

def load_kmeans_model(file_path):
    with open(file_path, 'rb') as f:
        kmeans_model = pickle.load(f)
    return kmeans_model

def load_groups(file_path):
    with open(file_path, 'rb') as f:
        groups = pickle.load(f)
    return groups

def transform_features(features, pca_model):
    features_transed = pca_model.transform(features)
    return features_transed.reshape(-1, pca_model.n_components_)

def predict_cluster(features, kmeans_model):
    return kmeans_model.predict(features)[0]

def view_cluster(cluster, groups, img_folder_path):
    print(cluster)
    plt.figure(figsize=(25, 25))
    files = groups[cluster]
    if len(files) > 30:
        print(f"Clipping cluster size from {len(files)} to 30")
        files = files[:29]
    for index, file in tqdm(enumerate(files)):
        plt.subplot(10, 10, index + 1)
        img = load_img(f"{img_folder_path}/{file}")
        img = np.array(img)
        plt.imshow(img)
        plt.axis('off')

    plt.show()

def info_cluster(cluster, groups, dic_data):
    res_data = []
    files = groups[cluster]
    temp2 = []
    for file in tqdm(files):
        temp = {}
        try :
            if dic_data[file][0] not in temp2 :
                temp2.append(dic_data[file][0])
                temp['pla_no'] = dic_data[file][0]
                temp['img_no'] = dic_data[file][1]
                temp['img_original_name'] = file
                res_data.append(temp)
            else :
                continue
        except :
            continue
    return res_data