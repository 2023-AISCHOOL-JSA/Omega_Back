# app/main.py

from flask import Flask, request, jsonify
from app.image_processing import load_vgg16_model, extract_features
from app.cluster_processing import (
    load_pca_model, load_kmeans_model, load_groups,
    transform_features, predict_cluster, info_cluster
#   , view_cluster
)

app = Flask(__name__)

m_path = "D:/flask_data/"

@app.route('/upload', methods=['POST'])
def main():
    data = request.json
    given_path = data.get('file_path')
    
    model = load_vgg16_model()
    ex_feat = extract_features(given_path, model)

    pca_model = load_pca_model(m_path + "pca_100.pkl")
    ex_feat_transed = transform_features(ex_feat, pca_model)

    kmeans_model = load_kmeans_model(m_path + "km2500_100.pkl")
    pre_cluster = predict_cluster(ex_feat_transed, kmeans_model)

    groups = load_groups(m_path + "groups2500_100.pkl")
#     view_cluster(pre_cluster, groups, "C:/Users/gjaischool1/Desktop/크롤링/dataset/img/imgs_sample_224/")

    dic_data = load_groups(m_path + "dic_data.pkl")
    result = info_cluster(pre_cluster, groups, dic_data)
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)