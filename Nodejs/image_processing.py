import cv2
from IPython.display import Image
from matplotlib import pyplot as plt
from os import listdir
from numpy import asarray
from numpy import vstack
from keras.utils import img_to_array
from keras.utils import load_img
from instancenormalization import InstanceNormalization
from matplotlib import pyplot as plt
import matplotlib.image
from keras.models import load_model
from matplotlib import pyplot
from numpy.random import randint
import numpy as np
import sys
from yoloface import face_analysis
face=face_analysis() 
print("Python RUN!!!!!")

###########Step 1 Face detection and resize###############

path = 'C:\\git\\FRA_503-IOT\\Nodejs\\uploads\\'
list_dir = listdir(path)

img,box,conf=face.face_detection(image_path= path + list_dir[len(list_dir)-1] ,model='tiny')

for (x, y, w, h) in box: 
    faces = img[y:y + w, x- 30:x + h + 30]

resized_image = cv2.resize(faces, (256, 256))
cv2.imwrite('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step1.png', resized_image) 

###########Step 2 Train model###############
def select_sample(dataset):
	X = dataset[0]
	return X.reshape(1, 256, 256, 3)

def show_plot(imagesX, imagesY1, imagesY2):
    images = vstack((imagesX, imagesY1, imagesY2))
    images = (images + 1) / 2.0
    matplotlib.image.imsave('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step2.png', images[1])

def load_images(path, size=(256,256)):
    data_list = list()
    pixels = load_img(path, target_size=size)
    pixels = img_to_array(pixels)
    data_list.append(pixels)
    return asarray(data_list)

dataB_all = load_images('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step1.png')

B_data = (dataB_all - 127.5) / 127.5

cust = {'InstanceNormalization': InstanceNormalization}
model_AtoB = load_model('C:\\git\\FRA_503-IOT\\g_model_AtoB_003400.h5', cust)
model_BtoA = load_model('C:\\git\\FRA_503-IOT\\g_model_BtoA_003400.h5', cust)

B_real = select_sample(B_data)
A_generated  = model_BtoA.predict(B_real)
B_reconstructed = model_AtoB.predict(A_generated)
show_plot(B_real, A_generated, B_reconstructed)

###########Step 3 Skeleton extraction###############
img = cv2.imread("C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step2.png",0)
binr = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]
kernel = np.ones((2,2), np.uint8)
opening = cv2.morphologyEx(binr, cv2.MORPH_OPEN, kernel, iterations=1)  
open_n_closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1) 
matplotlib.image.imsave('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step3.png', open_n_closing)


###########Step 4 Image Contour###############
img2 = cv2.imread('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step3.png')
gray_image = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
_, binary_image = cv2.threshold(gray_image, 200, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(255-binary_image, mode=cv2.RETR_TREE, method=cv2.CHAIN_APPROX_SIMPLE)
line_image = np.zeros_like(img2)

for contour in contours:
    cv2.drawContours(line_image, [contour], contourIdx=-1, color=(255, 255, 255), thickness=2)

cv2.imwrite("C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\step4.png", 255-line_image)

###########Step 5 Get points###############
points = []
i = 1
num_of_contour = len(contours)
for contour in contours:
    for point in contour:
        points.append(np.append(point[0],i))  # Append the points of the contour
    i = i+1
points = np.asarray(points)
array_to_ur = np.ndarray(shape= points.shape)
array_to_ur[:,0] = (points[:,1] - 257) * 1e-3
array_to_ur[:,1] =  (np.round((points[:,0] * 0.82),0) + 196) * 1e-3
array_to_ur[:,2] = points[:,2]

np.savetxt('C:\\git\\FRA_503-IOT\\Nodejs\\Processed_image\\ur_array.txt', array_to_ur)

print("Writing Image Finish")
