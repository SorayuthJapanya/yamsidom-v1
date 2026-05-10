import cv2
import numpy as np
import os
from ultralytics import YOLO
from src.config.config import Config

config = Config()

leaf_detection_path = os.path.abspath(config.LEAF_DETECT_MODEL_PATH)

print("✅ Leaf detection path:", leaf_detection_path)

model_path = leaf_detection_path

model = YOLO(model_path)


def crop_to_yolo_square(input_path, output_path, crop_size=3000):
    """
    ครอปภาพเป็นสี่เหลี่ยมจัตุรัสจาก YOLO Detection
    โดยหาจุดกึ่งกลางของ Box ที่ใหญ่ที่สุด แล้วสร้าง Crop Box ขนาด crop_size x crop_size 
    ที่มีจุดกึ่งกลางตรงกับจุดกึ่งกลางของ YOLO Box
    """
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError(f"❌ ไม่สามารถโหลดภาพจาก {input_path}")

    h_img, w_img = img.shape[:2]

    # รัน YOLO
    results = model(input_path)
    boxes = results[0].boxes.xyxy.cpu().numpy()

    if len(boxes) == 0:
        print("❌ No objects detected in", input_path)
        return None

    # เลือกกล่องที่ใหญ่ที่สุด
    largest_box = max(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))
    x1, y1, x2, y2 = map(int, largest_box)

    # คำนวณจุดกึ่งกลางของ YOLO Box ที่ใหญ่ที่สุด
    model_box_center_x = (x1 + x2) // 2
    model_box_center_y = (y1 + y2) // 2

    print(f"📍 YOLO Box ที่ใหญ่ที่สุด: ({x1}, {y1}) ถึง ({x2}, {y2})")
    print(
        f"🎯 จุดกึ่งกลางของ YOLO Box: ({model_box_center_x}, {model_box_center_y})")

    # สร้าง Crop Box ขนาด crop_size x crop_size โดยใช้จุดกึ่งกลางเดียวกัน
    half_crop_size = crop_size // 2

    # คำนวณพิกัดของ Crop Box
    crop_left = model_box_center_x - half_crop_size
    crop_top = model_box_center_y - half_crop_size
    crop_right = model_box_center_x + half_crop_size
    crop_bottom = model_box_center_y + half_crop_size

    print(
        f"📦 Crop Box เริ่มต้น: ({crop_left}, {crop_top}) ถึง ({crop_right}, {crop_bottom})")

    # ตรวจสอบและปรับแก้หากเกินขอบภาพ
    # หากเกินขอบซ้าย
    if crop_left < 0:
        shift = -crop_left
        crop_left = 0
        crop_right = min(w_img, crop_right + shift)

    # หากเกินขอบขวา
    if crop_right > w_img:
        shift = crop_right - w_img
        crop_right = w_img
        crop_left = max(0, crop_left - shift)

    # หากเกินขอบบน
    if crop_top < 0:
        shift = -crop_top
        crop_top = 0
        crop_bottom = min(h_img, crop_bottom + shift)

    # หากเกินขอบล่าง
    if crop_bottom > h_img:
        shift = crop_bottom - h_img
        crop_bottom = h_img
        crop_top = max(0, crop_top - shift)

    print(
        f"📦 Crop Box สุดท้าย: ({crop_left}, {crop_top}) ถึง ({crop_right}, {crop_bottom})")
    print(
        f"📏 ขนาด Crop Box: {crop_right - crop_left} x {crop_bottom - crop_top}")

    # ตรวจสอบว่า Crop Box มีขนาดเพียงพอหรือไม่
    actual_width = crop_right - crop_left
    actual_height = crop_bottom - crop_top

    if actual_width < crop_size or actual_height < crop_size:
        print(f"⚠️  เตือน: ขนาดภาพต้นฉบับเล็กกว่า crop size ที่ต้องการ")
        print(f"    ขนาดที่ได้จริง: {actual_width} x {actual_height}")

    # ครอปภาพ
    crop = img[crop_top:crop_bottom, crop_left:crop_right]

    # เซฟออกมา
    cv2.imwrite(output_path, crop)
    print(f"✅ บันทึกภาพที่ครอปแล้วไปที่: {output_path}")

    return output_path
