from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ml import ml_service

router = APIRouter()

class PredictionRequest(BaseModel):
    text: str

@router.post("/predict")
def predict_transaction(request: PredictionRequest):
    try:
        prediction = ml_service.predict([request.text])[0]
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
