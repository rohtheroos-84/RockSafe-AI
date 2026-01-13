export interface LiveMonitorResponse {
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
  location_info: {
    location_name: string;
    location_id: string;
    elevation: number | string;
    temperature: number | string;
    rainfall: number | string;
    wind_speed: number | string;
    rainfall_3d_sum: number | string;
    rainfall_7d_sum: number | string;
  };
  generated_data: Record<string, any>;
  timestamp: string;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

// Helper function to determine risk level
function getRiskLevel(probability: number) {
  if (probability >= 0.75) return 'critical' as const;
  if (probability >= 0.5) return 'high' as const;
  if (probability >= 0.25) return 'medium' as const;
  return 'low' as const;
}

export async function monitorLocation(locationName: string): Promise<LiveMonitorResponse> {
  try {
    const requestData = {
      location_name: locationName
    };
    
    console.log('Sending live monitoring request:', requestData);

    const response = await fetch(`${BACKEND_URL}/monitor/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('Live monitoring response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Live monitoring failed';
      try {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Live monitoring response data:', data);
    return data;
  } catch (error: any) {
    console.error('Error in monitorLocation:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend server. Please ensure it is running on port 8000.');
    }
    throw error;
  }
}