import cv2
import time
import os
import numpy
from sklearn.cluster import KMeans

def image2X(image, width, height, channels = 3):
    # Converts an RGB image to an array X for use with sklearn.
    return image.reshape([width * height, channels])
def X2image(X, width, height, channels = 3):
    # Converts an array X from sklearn to an RGB image.
    return X.reshape([height, width, channels])

def find_clusters( original_img, width, height ):
    img = original_img # cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)
    X = image2X(img, width, height, 3)

    kmeans = KMeans(n_clusters = 6, random_state = 42)
    kmeans.fit(X)
    # Obtain the cluster centroids for each pixel in the image.
    # These centroids are essentially our image segments.
    X_kmeans = kmeans.cluster_centers_[kmeans.predict(X)]
    X_kmeans = X_kmeans.astype("uint8")

    print(kmeans.cluster_centers_)
    return X2image(X_kmeans, width, height, 3)


def analyse_image( image_path ):
    print(f"Analysing image {image_path}")
    image = cv2.imread(image_path) 
    output_path = "/var/www/html/result_images/result.png"
    if image is not None:
        result_img = find_clusters( image, 256, 192 )
        #result_img = cv2.bitwise_not(image)
        cv2.imwrite(output_path, result_img)
    else:
        print(f"Failed to load image from '{image_path}'.")
    pass

def main():
    app_running = True
    while app_running:
        folder_path = '/var/www/html/images/'
        file_name = 'image.png'

        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path):
            analyse_image(file_path)
            #remove_image(file_path)
        else:
            print(f"The file '{file_name}' does not exist in the folder.")
        time.sleep(1)

if __name__ == "__main__":
    main()
