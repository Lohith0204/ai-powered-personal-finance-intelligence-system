from fastapi import APIRouter, File, UploadFile, HTTPException
import pandas as pd
import io
from app.services.ml import ml_service
from app.services.analysis import generate_insights

router = APIRouter()

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")
        
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")
        
    target_col = 'Transaction Description'
    
    if target_col not in df.columns:
        possible_cols = ['Description', 'text', 'transaction', 'name']
        found = False
        for c in possible_cols:
            for real_col in df.columns:
                if real_col.lower() == c.lower():
                    target_col = real_col
                    found = True
                    break
            if found: break
        if not found:
            raise HTTPException(status_code=400, detail=f"CSV must contain a '{target_col}' column.")
            
    df_clean = df.dropna(subset=[target_col])
    if df_clean.empty:
        return {"predictions": []}
        
    texts = df_clean[target_col].tolist()
    
    try:
        predictions = ml_service.predict(texts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    df_clean['Predicted Category'] = predictions
    
    amt_col = next((c for c in df_clean.columns if 'amount' in c.lower() or 'cost' in c.lower() or 'price' in c.lower()), None)
    type_col = next((c for c in df_clean.columns if 'type' in c.lower()), None)
    date_col = next((c for c in df_clean.columns if 'date' in c.lower() or 'time' in c.lower()), None)

    insights = generate_insights(df_clean, amt_col, type_col, date_col)
    
    result = df_clean.to_dict(orient="records")
    return {"predictions": result, "insights": insights}
