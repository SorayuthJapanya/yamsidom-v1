from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pandas as pd
import numpy as np
import io
import os
import base64
import time
import tempfile
from tensorflow.keras.models import load_model
from src.config.config import Config
from src.services.Exif_Image import get_exif_data
from src.services.Exif_Image import extract_gps_coordinates
from src.services.Cropper import crop_to_yolo_square
from src.services.Class_Predict import layered_predict

config = Config()
config.get_config()

app = Flask(__name__)
CORS(app)

# ====== โหลดโมเดล classification ======
first_layer_model_path = config.FIRST_LAYER_MODEL_PATH
model_classification = load_model(first_layer_model_path)
print(f"✅ Loaded first layer model from: {first_layer_model_path}")

second_layer_model_path = config.SECOND_LAYER_MODEL_PATH
all_second_layer_models = {k: load_model(
    v) for k, v in second_layer_model_path.items()}
for k, model in all_second_layer_models.items():
    print(f"✅ Loaded {k} model from: {second_layer_model_path[k]}")


def convert_to_jsonable(obj):
    if isinstance(obj, (np.floating, np.integer)):
        return obj.item()
    elif isinstance(obj, (np.ndarray, pd.Series, list, tuple)):
        return [convert_to_jsonable(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_to_jsonable(v) for k, v in obj.items()}
    elif isinstance(obj, (str, int, float, bool)) or obj is None:
        return obj
    else:
        return str(obj)

# ====== Route หลัก ======


@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()

        request_data = request.get_json()

        if not request_data:
            return jsonify({"error": "Invalid JSON"}), 400

        base64_image = request_data['image']

        isCropped_image = request_data['isCropped']
        is_cropped = str(isCropped_image).lower() in ["true", "1", "yes"]

        # decode และแปลงเป็น PIL Image
        image_data = base64.b64decode(base64_image)

        # 🔁 สร้าง stream ใหม่สำหรับ EXIF
        image_stream_exif = io.BytesIO(image_data)
        image_nocenvert = Image.open(image_stream_exif)

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_in:
            tmp_in.write(image_data)
            tmp_in.flush()
            input_path = tmp_in.name

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_out:
            output_path = tmp_out.name

        cropped_path = None
        try:
            if not is_cropped:
                print(f"isCropped: {is_cropped}")
                print("✅ เริ่มทำการ Auto-Crop")
                cropped_path = crop_to_yolo_square(input_path, output_path)

                if cropped_path is None:
                    print("❌ ไม่สามารถตรวจจับวัตถุได้")
                    model_predict = layered_predict(input_path)
                    print("\n=== Final Prediction Result ===")
                    print(model_predict)
                else:
                    model_predict = layered_predict(cropped_path)
                    print("\n=== Final Prediction Result ===")
                    print(model_predict)

            else:
                print(f"isCropped: {is_cropped}")
                print("✅ ผู้ใช้ Crop รูปมาแล้ว")
                model_predict = layered_predict(input_path)
                print("\n=== Final Prediction Result ===")
                print(model_predict)

        finally:
            print("✅ Already Deleted")
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)

        # ===== EXIF Info =====
        exif = get_exif_data(image_nocenvert)
        print("EXIF Data:", exif)

        datetime_taken = (
            exif.get('DateTimeOriginal') or
            exif.get('DateTime') or
            exif.get('GPSDateStamp') or
            ''
        )

        # ===== GPS Processing (ใช้ฟังก์ชันใหม่) =====
        gps_decimal = extract_gps_coordinates(exif)

        print(f"Final GPS coordinates: {gps_decimal}")

        best_first_layer = (model_predict["first_layer"])

        second_layer = model_predict.get("second_layer", None)

        if isinstance(second_layer, dict):
            # ✅ ถ้าเป็น dict → แปลงเป็น list
            second_layer_list = [
                {"class": cls, "prob": prob}
                for cls, prob in second_layer.items()
            ]
        elif isinstance(second_layer, str):
            # ✅ ถ้าเป็น string → ส่งต่อเลย
            second_layer_list = second_layer
        else:
            # ✅ กัน error กรณี None หรือ type อื่น
            second_layer_list = []

        end_time = time.time()
        time_process = round((end_time - start_time) * 1000, 2)

        result = {
            "best_first_layer": best_first_layer,
            "second_layer": second_layer_list,
            'datetime_taken': datetime_taken,
            'gps': gps_decimal,
            'process_time': time_process,
        }
        json_ready_result = convert_to_jsonable(result)

        print(f"result: {json_ready_result}")

        return jsonify(json_ready_result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model_classification is not None,
        "timestamp": time.time()
    })


# ====== Run (เฉพาะทดสอบ local) ======
if __name__ == '__main__':
    app.run(debug=config.DEBUG, port=config.PORT)
