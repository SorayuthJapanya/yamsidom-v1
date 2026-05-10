import pandas as pd
from src.util.Filter_Class_list import filter_data

df = pd.DataFrame(filter_data)
print(len(df))

# ---------- ฟังก์ชันตรวจสอบว่ามีข้อมูลจริงหรือไม่ ----------


def has_valid_filters(filters):
    """ตรวจสอบว่ามี filter ที่มีข้อมูลจริง (ไม่ใช่ 'No data') หรือไม่"""
    return any(v and v.strip() and v.strip() != "No data" for v in filters.values())


# ---------- ฟังก์ชันกรองพันธุ์ ----------
def filter_species(**filters):

    filtered_df = df.copy()

    # กรองเฉพาะค่าที่ไม่ใช่ "No data" และไม่เป็นค่าว่าง
    active_filters = {k: v for k, v in filters.items()
                      if v and v.strip() and v.strip() != "No data"}

    # ถ้าไม่มี filter ที่มีข้อมูลจริง ให้ return ทั้งหมด
    if not active_filters:
        print(
            "No valid filters provided (all are 'No data' or empty). Returning all species.")
        return df[["Species"]]

    # เพิ่มคอลัมน์ score เพื่อนับจำนวนเงื่อนไขที่ตรง
    filtered_df['match_score'] = 0

    for key, value in active_filters.items():
        if key in df.columns:
            condition = df[key] == value
            filtered_df.loc[condition, 'match_score'] += 1
            print(f"Condition for {key}={value}: {condition.sum()} matches")

    # กรองเฉพาะ species ที่ match อย่างน้อย 1 เงื่อนไข
    result_df = filtered_df[filtered_df['match_score'] > 0]

    if result_df.empty:
        print("No matches found for filters.")
        return "ไม่มีสายพันธุ์ที่ตรงกับเงื่อนไข filter"

    # เรียงตาม match_score จากมากไปน้อย
    result_df = result_df.sort_values('match_score', ascending=False)

    print(f"Found {len(result_df)} species with matches:")
    print(f"Score distribution:")
    score_counts = result_df['match_score'].value_counts(
    ).sort_index(ascending=False)
    for score, count in score_counts.items():
        print(f"  {score} matches: {count} species")

    return result_df[["Species"]]
