import os
import joblib

class MLService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self._load_models()

    def _load_models(self):
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(BASE_DIR, "models", "saved_model.pkl")
        vectorizer_path = os.path.join(BASE_DIR, "models", "vectorizer.pkl")
        
        try:
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)
        except Exception as e:
            print(f"Error loading ML models: {e}")

    def predict(self, texts: list) -> list:
        if not self.model or not self.vectorizer:
            raise RuntimeError("Models not loaded.")
        vec_input = self.vectorizer.transform(texts)
        return self.model.predict(vec_input).tolist()

ml_service = MLService()
