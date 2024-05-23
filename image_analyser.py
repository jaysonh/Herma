import cv2
import time
import os
import numpy
from sklearn.cluster import KMeans
import json
import datetime
import time

num_clusters = 6

def image2X(image, width, height, channels = 3):
    # Converts an RGB image to an array X for use with sklearn.
    return image.reshape([width * height, channels])
def X2image(X, width, height, channels = 3):
    # Converts an array X from sklearn to an RGB image.
    return X.reshape([height, width, channels])

def find_clusters( original_img, width, height ):
    img = original_img # cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)
    X = image2X(img, width, height, 3)

    kmeans = KMeans(n_clusters = num_clusters, random_state = 42)
    kmeans.fit(X)
    # Obtain the cluster centroids for each pixel in the image.
    # These centroids are essentially our image segments.
    X_kmeans = kmeans.cluster_centers_[kmeans.predict(X)]
    X_kmeans = X_kmeans.astype("uint8")

    print(kmeans.cluster_centers_)
    return X2image(X_kmeans, width, height, 3), kmeans.cluster_centers_



def generate_timestamp():
    # Get the current datetime with microseconds
    now = datetime.datetime.now()

    # Format the datetime as a timestamp
    timestamp = now.strftime("%Y%m%d%H%M%S.%f")

    return str(timestamp)

def get_unique_id():
    timestamp = int(time.time() * 1000)  # Multiply by 1000 to get milliseconds
    unique_id = str(timestamp)    
    return unique_id

def analyse_image( image_path ):
    print(f"Analysing image {image_path}")
    image = cv2.imread(image_path) 
    #output_path = "/var/www/html/result_images/result.png"
    output_filename = "kmeans_" + generate_timestamp() + ".png"
    output_path = "/var/www/html/result_images/" + output_filename
    copy_path = "/var/www/html/result_images/original.png"

    if image is not None:
        result_img, cluster_centers = find_clusters( image, 256, 192 )
        cv2.imwrite(output_path, result_img)
        cv2.imwrite(copy_path, image)
        meta_data = {
                        'id' : get_unique_id(),
                        'image_original': "http://3.149.240.150/result_images/original.png",
                        'image_file' : "http://3.149.240.150/result_images/" + output_filename,
                        'image_width' : 0,
                        'image_height' : 0,
			'num_clusters' : num_clusters,
			'kmeans_clusters' : cluster_centers.tolist() 
                    }
        with open('working_data/data.json', 'w') as file:
                file.write(json.dumps(meta_data))

def remove_image(file_path):
    try:
        os.remove(file_path)
    except OSError as e:
        print(f"Error deleting file: {e}")

def main():
    app_running = True
    while app_running:
        folder_path = '/var/www/html/images/'
        file_name = 'image.png'

        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path):
            analyse_image(file_path)
            remove_image(file_path)
        time.sleep(1)

if __name__ == "__main__":
    main()
