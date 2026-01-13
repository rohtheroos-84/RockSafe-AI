from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import joblib, json, os, numpy as np
from datetime import datetime
import logging

# Import SMS service
from sms_service import sms_service

# Import live monitoring functions
from input import generate_model_input

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_if_exists(name):
    p = os.path.join(MODEL_DIR, name)
    return joblib.load(p) if os.path.exists(p) else None

model = load_if_exists("model.pkl")
preproc = load_if_exists("preproc.pkl")
label_encoder = load_if_exists("label_encoder.pkl")

with open(os.path.join(MODEL_DIR, "feature_cols.json"), "r") as f:
    FEATURE_COLS = json.load(f)

with open(os.path.join(MODEL_DIR, "metadata.json"), "r") as f:
    METADATA = json.load(f)

app = FastAPI(title="RockSafe Local API")

# Configure CORS with more permissive settings
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
)

class PredictByArray(BaseModel):
    features: List[float]         # must be exactly len(FEATURE_COLS)

class PredictByMap(BaseModel):
    feature_map: Dict[str, Any]  # dict of feature_name -> value

class PredictResponse(BaseModel):
    prediction: int
    probability: Optional[float] = None
    used_threshold: float
    raw_score: Optional[float] = None
    message: Optional[str] = None
    sms_alert: Optional[Dict[str, Any]] = None  # SMS alert status

class LiveMonitorRequest(BaseModel):
    location_name: str  # e.g. "Panaji, Goa, India"
    location_id: Optional[str] = None  # auto-generated if not provided

class LiveMonitorResponse(BaseModel):
    prediction: int
    probability: Optional[float] = None
    used_threshold: float
    raw_score: Optional[float] = None
    message: Optional[str] = None
    sms_alert: Optional[Dict[str, Any]] = None
    location_info: Dict[str, Any]  # API data and location details
    generated_data: Dict[str, Any]  # The input data used for prediction
    timestamp: str

@app.get("/metadata")
def metadata():
    return {
        "model_loaded": model is not None,
        "n_expected_features": len(FEATURE_COLS),
        "feature_cols_sample": FEATURE_COLS[:10],
        "metadata": METADATA
    }

@app.get("/sms/status")
def get_sms_status():
    """Get SMS service status and configuration"""
    from config import SMS_ALERTS_ENABLED, EMERGENCY_CONTACTS, TWILIO_AUTH_TOKEN
    return {
        "sms_enabled": SMS_ALERTS_ENABLED,
        "twilio_configured": TWILIO_AUTH_TOKEN != '[AuthToken]',
        "emergency_contacts_count": len(EMERGENCY_CONTACTS),
        "emergency_contacts": EMERGENCY_CONTACTS  # Remove this in production for security
    }

@app.post("/sms/test")
async def test_sms_alert(test_data: Dict[str, Any] = None):
    """Test SMS alert functionality"""
    try:
        # Use test data or default values
        test_probability = test_data.get('probability', 0.8) if test_data else 0.8
        test_location = test_data.get('location', 'Test Location') if test_data else 'Test Location'
        
        result = sms_service.send_sms_alert(
            probability=test_probability,
            location=test_location,
            additional_data={"Test": "This is a test alert"}
        )
        
        return {
            "message": "Test SMS alert completed",
            "result": result
        }
    except Exception as e:
        logger.error(f"SMS test failed: {e}")
        raise HTTPException(status_code=500, detail=f"SMS test failed: {e}")

def prepare_array_from_map(fmap):
    """
    Build ordered array matching FEATURE_COLS.
    If label_encoder exists and a feature is 'location_encoded' but fmap contains 'location_id',
    attempt to encode it.
    """
    arr = []
    for col in FEATURE_COLS:
        if col in fmap:
            arr.append(fmap[col])
        elif col == "location_encoded" and "location_id" in fmap and label_encoder is not None:
            try:
                enc = int(label_encoder.transform([fmap["location_id"]])[0])
            except Exception:
                enc = 0
            arr.append(enc)
        elif col in fmap:
            arr.append(fmap[col])
        else:
            # missing feature -> default 0
            arr.append(0)
    return np.array(arr, dtype=float).reshape(1, -1)

@app.post("/predict", response_model=PredictResponse)
@app.options("/predict")  # Add an options endpoint to handle preflight
async def predict_by_array(payload: PredictByArray = None, payload_map: PredictByMap = None):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")

    # Choose input mode
    if payload and payload.features:
        x = np.array(payload.features, dtype=float).reshape(1, -1)
        if x.shape[1] != len(FEATURE_COLS):
            raise HTTPException(status_code=400, detail=f"Expected {len(FEATURE_COLS)} features, got {x.shape[1]}")
    elif payload_map and payload_map.feature_map:
        x = prepare_array_from_map(payload_map.feature_map)
    else:
        raise HTTPException(status_code=400, detail="Send either 'features' (ordered list) or 'feature_map' (dict).")

    # apply preprocessing if exists
    try:
        if preproc is not None:
            x_proc = preproc.transform(x)
        else:
            x_proc = x
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preprocessing failed: {e}")

    # get probability if available
    raw_score = None
    prob = None
    try:
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(x_proc)[0, 1])
            raw_score = prob
        else:
            # some models might give decision_function
            if hasattr(model, "decision_function"):
                raw_score = float(model.decision_function(x_proc)[0])
                # optional: convert to 0-1 using sigmoid
                prob = 1 / (1 + np.exp(-raw_score))
            else:
                pred = int(model.predict(x_proc)[0])
                return PredictResponse(prediction=pred, probability=None, used_threshold=METADATA.get("cost_threshold", 0.5), raw_score=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    threshold = float(METADATA.get("cost_threshold", 0.5))
    pred_binary = int(prob > threshold)

    # SMS Alert Logic
    sms_alert_result = None
    if prob is not None:
        try:
            # Extract location from input data for SMS
            location = "Unknown"
            if payload_map and payload_map.feature_map:
                location = payload_map.feature_map.get("location_id", "Unknown")
            
            # Prepare additional data for SMS
            additional_data = {
                "Raw Score": f"{raw_score:.4f}" if raw_score else "N/A",
                "Threshold": f"{threshold:.2f}",
                "Prediction": "HIGH RISK" if pred_binary else "LOW RISK"
            }
            
            # Send SMS alert if risk is HIGH or CRITICAL
            sms_alert_result = sms_service.send_sms_alert(
                probability=prob,
                location=location,
                additional_data=additional_data
            )
            
            # Log the alert attempt
            if sms_alert_result['success']:
                logger.info(f"SMS alert sent successfully. Risk: {sms_alert_result.get('risk_level')}, Probability: {prob:.3f}")
            else:
                logger.warning(f"SMS alert failed or skipped: {sms_alert_result.get('message')}")
                
        except Exception as e:
            logger.error(f"SMS alert service error: {e}")
            sms_alert_result = {
                'success': False,
                'message': f'SMS service error: {str(e)}',
                'sent_count': 0,
                'failed_count': 0
            }

    return PredictResponse(
        prediction=pred_binary, 
        probability=prob, 
        used_threshold=threshold, 
        raw_score=raw_score,
        sms_alert=sms_alert_result
    )

@app.post("/monitor/location", response_model=LiveMonitorResponse)
async def monitor_location(request: LiveMonitorRequest):
    """Live monitoring endpoint that uses real-time API data for predictions"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
    # Auto-generate location_id if not provided
    if not request.location_id:
        # Create location_id from location name
        location_parts = request.location_name.replace(" ", "_").replace(",", "").lower()
        timestamp_short = datetime.now().strftime("%H%M")
        location_id = f"live_{location_parts}_{timestamp_short}"
    else:
        location_id = request.location_id
    
    try:
        logger.info(f"Starting live monitoring for location: {request.location_name}")
        
        # Generate model input using real-time APIs
        model_input_json = generate_model_input(request.location_name, location_id)
        
        # Parse the JSON string to extract the feature map
        feature_map = json.loads(model_input_json)
        
        # Convert all string values to appropriate types
        processed_features = {}
        for key, value in feature_map.items():
            if key in ["timestamp", "location_id"]:
                processed_features[key] = value
            else:
                try:
                    processed_features[key] = float(value)
                except (ValueError, TypeError):
                    processed_features[key] = value
        
        # Prepare array for model prediction
        x = prepare_array_from_map(processed_features)
        
        # Apply preprocessing if exists
        try:
            if preproc is not None:
                x_proc = preproc.transform(x)
            else:
                x_proc = x
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Preprocessing failed: {e}")
        
        # Get prediction
        raw_score = None
        prob = None
        try:
            if hasattr(model, "predict_proba"):
                prob = float(model.predict_proba(x_proc)[0, 1])
                raw_score = prob
            else:
                if hasattr(model, "decision_function"):
                    raw_score = float(model.decision_function(x_proc)[0])
                    prob = 1 / (1 + np.exp(-raw_score))
                else:
                    pred = int(model.predict(x_proc)[0])
                    return LiveMonitorResponse(
                        prediction=pred, 
                        probability=None, 
                        used_threshold=METADATA.get("cost_threshold", 0.5), 
                        raw_score=None,
                        location_info={},
                        generated_data=processed_features,
                        timestamp=datetime.now().isoformat()
                    )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
        
        threshold = float(METADATA.get("cost_threshold", 0.5))
        pred_binary = int(prob > threshold)
        
        # SMS Alert Logic for Live Monitoring
        sms_alert_result = None
        if prob is not None:
            try:
                # Send SMS alert if risk is HIGH or CRITICAL
                sms_alert_result = sms_service.send_sms_alert(
                    probability=prob,
                    location=request.location_name,
                    additional_data={
                        "Monitoring Type": "Live API Data",
                        "Location ID": location_id
                    }
                )
                
                # Log the alert attempt
                if sms_alert_result['success']:
                    logger.info(f"Live monitoring SMS alert sent. Risk: {sms_alert_result.get('risk_level')}, Location: {request.location_name}")
                else:
                    logger.warning(f"Live monitoring SMS alert failed: {sms_alert_result.get('message')}")
                    
            except Exception as e:
                logger.error(f"SMS alert service error during live monitoring: {e}")
                sms_alert_result = {
                    'success': False,
                    'message': f'SMS service error: {str(e)}',
                    'sent_count': 0,
                    'failed_count': 0
                }
        
        # Extract important real-time data for UI display
        location_info = {
            "location_name": request.location_name,
            "location_id": location_id,
            "elevation": processed_features.get("elevation", "N/A"),
            "temperature": processed_features.get("temperature", "N/A"),
            "rainfall": processed_features.get("rainfall", "N/A"),
            "wind_speed": processed_features.get("wind_speed", "N/A"),
            "rainfall_3d_sum": processed_features.get("rainfall_3d_sum", "N/A"),
            "rainfall_7d_sum": processed_features.get("rainfall_7d_sum", "N/A"),
        }
        
        logger.info(f"Live monitoring completed for {request.location_name}. Risk: {prob:.3f}")
        
        return LiveMonitorResponse(
            prediction=pred_binary,
            probability=prob,
            used_threshold=threshold,
            raw_score=raw_score,
            sms_alert=sms_alert_result,
            location_info=location_info,
            generated_data=processed_features,
            timestamp=datetime.now().isoformat()
        )
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse model input JSON: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse generated model input: {e}")
    except Exception as e:
        logger.error(f"Live monitoring failed for {request.location_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Live monitoring failed: {str(e)}")
