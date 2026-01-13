export interface FeatureMap {
  timestamp: string;
  location_id: string;
  elevation: number;
  slope: number;
  aspect: number;
  curvature: number;
  fracture_density: number;
  rock_strength: number;
  weathering: number;
  displacement: number;
  strain: number;
  pore_pressure: number;
  rainfall: number;
  temperature: number;
  vibrations: number;
  wind_speed: number;
  rainfall_3d_sum: number;
  rainfall_7d_sum: number;
  pore_3d_mean: number;
  disp_rate: number;
  disp_accel: number;
  blast_event: number;
  blast_magnitude: number;
  blast_distance: number;
  ppv: number;
  blast_24h: number;
  blast_72h: number;
  max_ppv_24h: number;
  blast_risk_multiplier: number;
  cumulative_blast_damage: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  used_threshold: number;
  raw_score: number;
  message: string | null;
  sms_alert?: {
    success: boolean;
    message: string;
    sent_count: number;
    failed_count: number;
    risk_level?: string;
    details?: Array<{
      phone_number: string;
      status: string;
      message_sid: string | null;
      error: string | null;
    }>;
  } | null;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

// Helper function to determine risk level
function getRiskLevel(probability: number) {
  if (probability >= 0.75) return 'critical' as const;
  if (probability >= 0.5) return 'high' as const;
  if (probability >= 0.25) return 'medium' as const;
  return 'low' as const;
}

export async function predictRockfall(features: Partial<FeatureMap>): Promise<PredictionResponse> {
  try {
    const requestData = {
      payload_map: {
        feature_map: features
      }
    };
    
    console.log('Sending request to backend:', requestData);

    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Prediction failed';
      try {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        errorMessage = `Prediction failed: ${errorText}`;
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return data;
  } catch (error: any) {
    console.error('Error in predictRockfall:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend server. Please ensure it is running on port 8000.');
    }
    throw error;
  }
}
