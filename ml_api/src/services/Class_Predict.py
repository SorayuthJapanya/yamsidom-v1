import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet_v2 import preprocess_input
from tensorflow.keras.models import load_model
import numpy as np
from src.config.config import Config
from src.util.Filter_Class_list import first_layer_class
from src.util.Filter_Class_list import second_layer_class


config = Config()

# -----------------------------
# Model Loading
# -----------------------------
first_layer_path = config.FIRST_LAYER_MODEL_PATH
first_layer_model = load_model(first_layer_path)
print(f"✅ Loaded first layer model from: {first_layer_model}")

second_layer_model_path = config.SECOND_LAYER_MODEL_PATH
all_second_layer_models = {k: load_model(
    v) for k, v in second_layer_model_path.items()}
for k, model in all_second_layer_models.items():
    print(f"✅ Loaded {k} model from: {second_layer_model_path[k]}")


# -----------------------------
# Image Preprocessing
# -----------------------------
IMG_SIZE = 256


def load_and_preprocess(img_path):
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

# -----------------------------
# Predict First Layer
# -----------------------------


def predict_first_layer(image_pil):
    print(">>> Predicting First Layer...")
    img = load_and_preprocess(image_pil)
    preds = first_layer_model.predict(img)
    class_idx = np.argmax(preds, axis=1)[0]
    predicted_class = first_layer_class[class_idx]
    print(f"First Layer Prediction: {predicted_class}")
    return predicted_class

# -----------------------------
# Predict Second Layer Top-5
# -----------------------------


def predict_layer2_top5(image_pil, first_class):
    if first_class not in second_layer_class:
        return None

    print(f">>> Predicting Second Layer for Class: {first_class}")

    model = all_second_layer_models.get(first_class)
    if model is None:
        print(f"    WARNING: Model for {first_class} not found!")
        return None

    img = load_and_preprocess(image_pil)
    pred_probs = model.predict(img)[0]  # shape: [num_classes]

    # Top-K indices
    num_classes = pred_probs
    top_k = len(num_classes)
    print("top_k: ", top_k)
    top_indices = np.argsort(pred_probs)[::-1]  # จากสูงสุดไปต่ำสุด

    print(
        f"Processing Layer 2 Model: {first_class}")
    layer_class_names = second_layer_class[first_class]

    # Get top-K predictions
    top_preds = []
    for i in range(top_k):
        cls_idx = top_indices[i]
        cls_name = layer_class_names[cls_idx] if cls_idx < len(
            layer_class_names) else f"Class_{cls_idx}"
        conf = float(pred_probs[cls_idx] * 100)
        round_conf = round(conf, 4)
        top_preds.append((cls_name, round_conf))

    # Calculate 'other'
    # top_sum = sum([p[1] for p in top_preds])
    # print("sumarize: ", (sum(pred_probs) * 100) - top_sum)
    # other_prob = 100 - top_sum
    # if (other_prob < 0):
    #     round_other_prob = 0
    # else:
    #     round_other_prob = round(other_prob, 4)

    # Assign to dictionary
    print(f"top_preds: {top_preds}")
    layer_result = {}
    for i, pred in enumerate(top_preds):
        layer_result[i + 1] = pred
    # layer_result["other"] = round_other_prob

    print(f"Layer {first_class} Top Predictions: {layer_result}")

    return layer_result


def layered_predict(image_pil):
    print(f"\n=== Processing Image: {image_pil} ===")
    first_class = predict_first_layer(image_pil)

    # ถ้าเป็น C0000 หรือ E0000 ส่งผลทำนายเลย
    if first_class in ["C0000", "E0000"]:
        print(
            f"Class {first_class} does not require Layer 2. Returning result.")
        return {"first_layer": first_class, "second_layer": first_class}

    # Predict Layer 2
    second_results = predict_layer2_top5(
        image_pil, first_class)

    return {"first_layer": first_class, "second_layer": second_results}

# # ===== Prediction =====
# img_resized = image_pil.resize((256, 256))
# img_array = keras_image.img_to_array(img_resized) / 255.0
# img_array = np.expand_dims(img_array, axis=0)

# pred = model_classification.predict(img_array).flatten()

# predicted_index = np.argmax(pred)
# predicted_label = all_class_names_old_model[predicted_index]
# confidence = pred[predicted_index] * 100

# prediction_result = {
#     "label": predicted_label,
#     "confidence": float(confidence)
# }

# print(
#     f"\n Best Predictions by Model: {predicted_label} cofident {float(confidence)}%")

# # ---------- แสดง Top 5 Prediction ----------
# top_k = min(len(all_class_names_old_model), len(pred), 5)
# top_5_indices = np.argsort(pred)[::-1][:top_k]
#  top_5_species = list(zip(
#       [all_class_names_old_model[i] for i in top_5_indices],
#       [pred[i] * 100 for i in top_5_indices]
#       ))

#   print("\n📈 Top 5 Predictions by Model:")
#    for i, (species, conf) in enumerate(top_5_species, start=1):
#         print(f"{i}. {species}: {conf:.2f}%")

    # ---------- ตรวจสอบว่ามี filter ที่มีข้อมูลจริงหรือไม่ ----------
    # if has_valid_filters(user_filters):
    #     print("✅ Valid filters found, proceeding with filtering...")

    #     filtered_species = filter_species(**user_filters)

    #     # ✅ ตรวจสอบว่า filtered_species เป็น string (ไม่พบผลลัพธ์) หรือ DataFrame
    #     if isinstance(filtered_species, str):
    #         # กรณีไม่พบสายพันธุ์ที่ตรงกับเงื่อนไข
    #         print("⚠️ ไม่มีสายพันธุ์ที่ตรงกับเงื่อนไข filter.")
    #         filtered_species_list = "ไม่มีสายพันธุ์ที่ตรงกับเงื่อนไข"
    #         is_filtered = True  # ยังคงระบุว่ามีการใช้ filter แต่ไม่พบผลลัพธ์

    #     else:
    #         filtered_class_names = filtered_species["Species"]

    #         print("🔎 Matched Species from Filters:")
    #         for species in filtered_class_names:
    #             print(f"- {species}")

    #         # ---------- ทำนายในกลุ่มที่ผ่านฟิลเตอร์ ----------
    #         filtered_class_names_list = filtered_class_names.tolist()

    #         valid_filtered_class_names = []

    #         for cls in filtered_class_names_list:
    #             if cls in all_class_names:
    #                 valid_filtered_class_names.append(cls)

    #         filtered_species_list = valid_filtered_class_names
    #         print(f"filtered_species_list: {filtered_species_list}")
    #         is_filtered = True

    # else:
    #     print(
    #         "🚫 No valid filters provided (all are 'No data' or empty). Using standard prediction...")

    #     filtered_species_list = "ผู้ใช้ไม่ได้เพิ่มข้อมูลลักษณะ"
    #     is_filtered = False

#

#     # ---------- เก็บค่าความน่าจะเป็นของทุกคลาส ----------
#     all_predictions_dict = {
#         all_class_names_old_model[i]: float(pred[i]) * 100
#         for i in range(len(all_class_names_old_model))
#     }
