from PIL import ExifTags
import math

# ====== ฟังก์ชันช่วย ======
def get_exif_data(image_pil):
    exif_data = {}
    try:
        info = image_pil._getexif()
        print("raw EXIF:", info)
        if info:
            for tag, value in info.items():
                tag_name = ExifTags.TAGS.get(tag, tag)
                exif_data[tag_name] = value
    except Exception as e:
        print("EXIF error:", e)
    return exif_data


def get_gps_info(gps_data):
    """แปลง GPS data จาก EXIF เป็นรูปแบบที่อ่านง่าย"""
    gps_info = {}

    # Mapping ของ GPS tags ที่สำคัญ
    gps_tag_mapping = {
        1: 'GPSLatitudeRef',
        2: 'GPSLatitude',
        3: 'GPSLongitudeRef',
        4: 'GPSLongitude',
        5: 'GPSAltitudeRef',
        6: 'GPSAltitude',
        7: 'GPSTimeStamp',
        29: 'GPSDateStamp'
    }

    for key in gps_data.keys():
        # ใช้ GPSTAGS จาก PIL หรือ mapping ที่เรากำหนด
        decode = ExifTags.GPSTAGS.get(
            key, gps_tag_mapping.get(key, f'GPSTag{key}'))
        gps_info[decode] = gps_data[key]

    print(f"GPS Info decoded: {gps_info}")
    return gps_info


def is_valid_number(value):
    """ตรวจสอบว่าเป็นตัวเลขที่ถูกต้องหรือไม่"""
    try:
        if value is None:
            return False
        # แปลงเป็น float เพื่อตรวจสอบ
        float_val = float(value)
        # ตรวจสอบว่าไม่ใช่ NaN หรือ infinity
        return not (math.isnan(float_val) or math.isinf(float_val))
    except (TypeError, ValueError):
        return False


def dms_to_decimal(dms, ref):
    """แปลง DMS (Degrees, Minutes, Seconds) เป็น Decimal degrees"""
    try:
        if not dms or len(dms) != 3:
            print(f"Invalid DMS format: {dms}")
            return None

        degrees, minutes, seconds = dms

        # ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
        if not all(is_valid_number(x) for x in [degrees, minutes, seconds]):
            print(
                f"Invalid DMS values: degrees={degrees}, minutes={minutes}, seconds={seconds}")
            return None

        # แปลงเป็น float และคำนวณ
        degrees = float(degrees)
        minutes = float(minutes)
        seconds = float(seconds)

        # คำนวณเป็น decimal degrees
        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)

        # ปรับเครื่องหมายตาม reference
        if ref and ref.upper() in ['S', 'W']:
            decimal *= -1

        print(
            f"DMS to Decimal: ({degrees}, {minutes}, {seconds}) {ref} -> {decimal:.6f}")
        return decimal

    except Exception as e:
        print(f"Error converting DMS to decimal: {e}")
        return None


def extract_gps_coordinates(exif_data):
    """แยก GPS coordinates จาก EXIF data"""
    try:
        gps_info = exif_data.get('GPSInfo', None)

        if not gps_info:
            print("No GPS information found in EXIF")
            return {'latitude': "", 'longitude': ""}

        # แปลง GPS data
        gps_data = get_gps_info(gps_info)

        # ดึงข้อมูล latitude และ longitude
        lat_dms = gps_data.get('GPSLatitude')
        lat_ref = gps_data.get('GPSLatitudeRef', 'N')
        lon_dms = gps_data.get('GPSLongitude')
        lon_ref = gps_data.get('GPSLongitudeRef', 'E')

        print(
            f"Raw GPS data: Lat={lat_dms} {lat_ref}, Lon={lon_dms} {lon_ref}")

        # แปลงเป็น decimal
        latitude = dms_to_decimal(lat_dms, lat_ref)
        longitude = dms_to_decimal(lon_dms, lon_ref)

        # ตรวจสอบความถูกต้องของพิกัด
        if latitude is not None and longitude is not None:
            # ตรวจสอบช่วงพิกัดที่เป็นไปได้
            if -90 <= latitude <= 90 and -180 <= longitude <= 180:
                result = {
                    'latitude': round(latitude, 6),  # ปัดเศษ 6 ตำแหน่ง
                    'longitude': round(longitude, 6)
                }
                print(f"✅ Valid GPS coordinates: {result}")
                return result
            else:
                print(
                    f"❌ GPS coordinates out of valid range: lat={latitude}, lon={longitude}")
        else:
            print("❌ Failed to convert GPS coordinates")

        return {'latitude': "", 'longitude': ""}

    except Exception as e:
        print(f"❌ Error extracting GPS coordinates: {e}")
        return {'latitude': "", 'longitude': ""}
