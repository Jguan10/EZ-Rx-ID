import tensorflow as tf
import pandas as pd
import os
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# Load dataset
df = pd.read_csv("augmented.csv")

# Define image parameters
IMG_SIZE = (224, 224)  # Resize images to 224x224
BATCH_SIZE = 8

# Convert labels to integers using LabelEncoder
encoder = LabelEncoder()
df["label_encoded"] = encoder.fit_transform(df["name"])  # Convert class labels to numeric
NUM_CLASSES = len(encoder.classes_)  # Get number of unique classes

# Create file paths
df["file_path"] = "D:/rximage/image/images/split_padded_rotated/" + df["new_filename"]

# Filter out non-existing images
df = df[df["file_path"].apply(os.path.exists)]

# Split dataset into training and validation sets
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["label_encoded"])

# Function to load and preprocess images
def load_image(img_path, label):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_jpeg(img, channels=3)  # Decode image
    img = tf.image.resize(img, IMG_SIZE)  # Resize
    img = img / 255.0  # Normalize
    return img, label

# Create TensorFlow datasets
train_dataset = tf.data.Dataset.from_tensor_slices((train_df["file_path"].values, train_df["label_encoded"].values))
val_dataset = tf.data.Dataset.from_tensor_slices((val_df["file_path"].values, val_df["label_encoded"].values))

# Apply preprocessing function and batch datasets
train_dataset = train_dataset.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
train_dataset = train_dataset.shuffle(len(train_df)).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

val_dataset = val_dataset.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
val_dataset = val_dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# Load ResNet50 with pre-trained ImageNet weights, excluding the top classification layer
base_model = ResNet50(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base model layers

# Add custom classification layers
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation="relu")(x)
output = Dense(NUM_CLASSES, activation="softmax")(x)

# Define the model
model = Model(inputs=base_model.input, outputs=output)

# Compile the model
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

# Train the model
model.fit(train_dataset, validation_data=val_dataset, epochs=10)

# Save model
model.save("pill_classifier_resnet.h5")

print("Training complete and model saved.")