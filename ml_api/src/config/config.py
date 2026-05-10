import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask settings
    FLASK_APP = os.getenv('FLASK_APP', 'main.py')
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

    # Model settings
    FIRST_LAYER_MODEL_PATH = os.getenv("FIRST_LAYER_MODEL_PATH")
    SECOND_LAYER_MODEL_PATH = {
        "A0000": os.getenv("SECOND_LAYER_MODEL_PATH_A0000"),
        "B0000": os.getenv("SECOND_LAYER_MODEL_PATH_B0000"),
        "D0000": os.getenv("SECOND_LAYER_MODEL_PATH_D0000"),
        "F0000": os.getenv("SECOND_LAYER_MODEL_PATH_F0000"),
        "I0000": os.getenv("SECOND_LAYER_MODEL_PATH_I0000"),
    }
    LEAF_DETECT_MODEL_PATH = os.getenv("LEAF_DETECT_MODEL_PATH")

    @classmethod
    def get_config(cls):
        # Debug print statements to help trace values
        print(f"FLASK_APP: {cls.FLASK_APP}")
        print(f"FLASK_ENV: {cls.FLASK_ENV}")
        print(f"PORT: {cls.PORT}")
        print(f"DEBUG: {cls.DEBUG}")
        print(f"FIRST_LAYER_MODEL_PATH: {cls.FIRST_LAYER_MODEL_PATH}")
        print(f"SECOND_LAYER_MODEL_PATH: {cls.SECOND_LAYER_MODEL_PATH}")
        print(f"LEAF_DETECT_MODEL_PATH: {cls.LEAF_DETECT_MODEL_PATH}")
        return {
            'flask_app': cls.FLASK_APP,
            'flask_env': cls.FLASK_ENV,
            'port': cls.PORT,
            'debug': cls.DEBUG,
            'first_layer_model_path': cls.FIRST_LAYER_MODEL_PATH,
            'second_layer_model_path': cls.SECOND_LAYER_MODEL_PATH,
            'leaf_detection_model_path': cls.LEAF_DETECT_MODEL_PATH,
        }
