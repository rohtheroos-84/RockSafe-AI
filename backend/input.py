import os
import requests
import json
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
load_dotenv() 

def get_weather_data(location_name):
    API_KEY = os.environ.get('TOMORROW_API_KEY')
    #API_KEY = os.getenv('TOMORROW_API_KEY')
    if not API_KEY:
        raise ValueError("TOMORROW_API_KEY not set in environment")
    url = "https://api.tomorrow.io/v4/weather/realtime"
    params = {"location": location_name, "apikey": API_KEY, "units": "metric"}
    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        v = data.get("data", {}).get("values", {})
        return float(v.get("temperature", 20.0)), float(v.get("windSpeed", 10.0))
    except Exception as e:
        print("Weather API error:", e)
        return 20.0, 10.0

def get_elevation_data(location_name):
    try:
        resp = requests.get("https://nominatim.openstreetmap.org/search",
                            params={'q': location_name, 'format': 'json', 'limit': 1},
                            headers={'User-Agent': 'RockfallApp/1.0'}, timeout=10)
        resp.raise_for_status()
        loc = resp.json()
        if not loc:
            return 500.0
        lat, lon = float(loc[0]['lat']), float(loc[0]['lon'])
        elev_resp = requests.post("https://api.open-elevation.com/api/v1/lookup",
                                  json={"locations":[{"latitude":lat,"longitude":lon}]}, timeout=10)
        elev_resp.raise_for_status()
        results = elev_resp.json().get("results", [])
        return float(results[0].get("elevation", 500.0)) if results else 500.0
    except Exception as e:
        print("Elevation API error:", e)
        return 500.0

def get_rainfall_data(location_name):
    try:
        resp = requests.get("https://nominatim.openstreetmap.org/search",
                            params={'q': location_name, 'format': 'json', 'limit': 1},
                            headers={'User-Agent': 'RockfallApp/1.0'}, timeout=10)
        resp.raise_for_status()
        loc = resp.json()
        if not loc:
            return 2.0, 6.0, 14.0
        lat, lon = float(loc[0]['lat']), float(loc[0]['lon'])
        # Use daily precip from open-meteo correctly
        params = {'latitude': lat, 'longitude': lon, 'daily': 'precipitation_sum', 'past_days': 6, 'timezone': 'auto'}
        wresp = requests.get("https://api.open-meteo.com/v1/forecast", params=params, timeout=10)
        wresp.raise_for_status()
        wj = wresp.json()
        daily = wj.get("daily", {}).get("precipitation_sum", [])
        if daily:
            rainfall = float(daily[-1])
            rainfall_3d_mean = float(np.mean(daily[-3:])) if len(daily) >= 3 else float(np.mean(daily))
            rainfall_7d_mean = float(np.mean(daily))
            return rainfall, rainfall_3d_mean, rainfall_7d_mean
        return 2.0, 6.0, 14.0
    except Exception as e:
        print("Rainfall API error:", e)
        return 2.0, 6.0, 14.0

def generate_synthetic_parameters():
    """Generate all synthetic parameters for the rockfall model"""
    
    # Geological parameters
    slope = np.random.normal(35, 8)  # degrees
    slope = np.clip(slope, 10, 80)
    
    aspect = np.random.uniform(0, 360)  # degrees
    
    curvature = np.random.normal(0, 0.3)  # profile curvature
    curvature = np.clip(curvature, -1.0, 1.0)
    
    fracture_density = np.random.beta(2, 5)  
    
    rock_strength = np.random.normal(45, 15)  
    rock_strength = np.clip(rock_strength, 10, 100)
    
    weathering = np.random.beta(3, 4)  
    
    displacement = np.random.exponential(2)  
    displacement = np.clip(displacement, 0, 20)
    
    strain = np.random.exponential(0.5)  
    strain = np.clip(strain, 0, 5)
    
    pore_pressure = np.random.lognormal(0, 0.8)  # kPa
    pore_pressure = np.clip(pore_pressure, 0, 10)
    
    vibrations = np.random.exponential(0.5)  # mm/s
    vibrations = np.clip(vibrations, 0, 2)
  
    pore_3d_mean = pore_pressure * np.random.normal(1, 0.2)
    pore_3d_mean = np.clip(pore_3d_mean, 0, 10)
    
    disp_rate = np.random.exponential(0.1) if np.random.random() > 0.7 else 0
    disp_accel = np.random.exponential(0.05) if disp_rate > 0 else 0
    
    blast_event = np.random.choice([0, 1], p=[0.95, 0.05])  
    
    if blast_event:
        blast_magnitude = np.random.uniform(100, 5000)  
        blast_distance = np.random.uniform(50, 500)  
        ppv = np.random.uniform(1, 50) 
    else:
        blast_magnitude = 0
        blast_distance = np.random.uniform(100, 300)  
        ppv = 0
    
    blast_24h = np.random.choice([0, 1], p=[0.8, 0.2])  
    blast_72h = np.random.choice([0, 1], p=[0.6, 0.4])  
    
    max_ppv_24h = np.random.uniform(0, 30) if blast_24h else 0
    
    blast_risk_multiplier = 1 + (max_ppv_24h / 100) * np.random.uniform(0.5, 2.0)
    
    cumulative_blast_damage = np.random.exponential(0.001)  
    cumulative_blast_damage = np.clip(cumulative_blast_damage, 0, 0.1)
    
    return {
        'slope': slope,
        'aspect': aspect,
        'curvature': curvature,
        'fracture_density': fracture_density,
        'rock_strength': rock_strength,
        'weathering': weathering,
        'displacement': displacement,
        'strain': strain,
        'pore_pressure': pore_pressure,
        'vibrations': vibrations,
        'pore_3d_mean': pore_3d_mean,
        'disp_rate': disp_rate,
        'disp_accel': disp_accel,
        'blast_event': blast_event,
        'blast_magnitude': blast_magnitude,
        'blast_distance': blast_distance,
        'ppv': ppv,
        'blast_24h': blast_24h,
        'blast_72h': blast_72h,
        'max_ppv_24h': max_ppv_24h,
        'blast_risk_multiplier': blast_risk_multiplier,
        'cumulative_blast_damage': cumulative_blast_damage
    }
def generate_model_input(location_name="Chennai, Tamil Nadu, India", location_id="loc_1"):
    """
    Generate complete input for the rockfall prediction model in JSON format.
    
    Args:
        location_name: Location for API calls
        location_id: Identifier for this location
    
    Returns:
        String: JSON format with all string values ready for the model
    """
    
    # Get real-time API data
    temperature, wind_speed = get_weather_data(location_name)
    elevation = get_elevation_data(location_name)
    rainfall, rainfall_3d_sum, rainfall_7d_sum = get_rainfall_data(location_name)
    
    synthetic_params = generate_synthetic_parameters()
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    powershell_output = f"""{{
      "timestamp": "{timestamp}",
      "location_id": "{location_id}",
      "elevation": "{elevation}",
      "slope": "{synthetic_params['slope']:.1f}",
      "aspect": "{synthetic_params['aspect']:.7f}",
      "curvature": "{synthetic_params['curvature']:.9f}",
      "fracture_density": "{synthetic_params['fracture_density']:.9f}",
      "rock_strength": "{synthetic_params['rock_strength']:.8f}",
      "weathering": "{synthetic_params['weathering']:.9f}",
      "displacement": "{synthetic_params['displacement']:.1f}",
      "strain": "{synthetic_params['strain']:.9f}",
      "pore_pressure": "{synthetic_params['pore_pressure']:.9f}",
      "rainfall": "{rainfall:.9f}",
      "temperature": "{temperature:.8f}",
      "vibrations": "{synthetic_params['vibrations']:.9f}",
      "wind_speed": "{wind_speed:.8f}",
      "rainfall_3d_sum": "{rainfall_3d_sum:.9f}",
      "rainfall_7d_sum": "{rainfall_7d_sum:.8f}",
      "pore_3d_mean": "{synthetic_params['pore_3d_mean']:.9f}",
      "disp_rate": "{synthetic_params['disp_rate']:.1f}",
      "disp_accel": "{synthetic_params['disp_accel']:.1f}",
      "blast_event": "{synthetic_params['blast_event']:.1f}",
      "blast_magnitude": "{synthetic_params['blast_magnitude']:.1f}",
      "blast_distance": "{synthetic_params['blast_distance']:.1f}",
      "ppv": "{synthetic_params['ppv']:.1f}",
      "blast_24h": "{synthetic_params['blast_24h']:.1f}",
      "blast_72h": "{synthetic_params['blast_72h']:.1f}",
      "max_ppv_24h": "{synthetic_params['max_ppv_24h']:.8f}",
      "blast_risk_multiplier": "{synthetic_params['blast_risk_multiplier']:.9f}",
      "cumulative_blast_damage": "{synthetic_params['cumulative_blast_damage']:.9f}"
}}"""

    return powershell_output

if __name__ == "__main__":
    model_input = generate_model_input("Panaji, Goa, India", "loc_1")
    print(model_input)