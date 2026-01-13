import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, RefreshCw, Wifi, AlertTriangle } from 'lucide-react';
import { LivePredictionResult } from '@/components/LivePredictionResult';
import { monitorLocation, LiveMonitorResponse } from '@/services/liveMonitor';
import { useRiskMapStore } from '@/services/riskMap';

// Helper function to determine risk level
function getRiskLevel(probability: number) {
  if (probability >= 0.75) return 'critical' as const;
  if (probability >= 0.5) return 'high' as const;
  if (probability >= 0.25) return 'medium' as const;
  return 'low' as const;
}

// Map city names to location IDs
const LOCATION_ID_MAP = {
  "Jharia, Jharkhand, India": "jharia_main",
  "Panaji, Goa, India": "panaji_west",
  "Bellary, Karnataka, India": "bellary_central",
  "Dhanbad, Jharkhand, India": "dhanbad_north",
  "Raipur, Chhattisgarh, India": "raipur_east",
  "Nagpur, Maharashtra, India": "nagpur_south",
  "Chandrapur, Maharashtra, India": "chandrapur_main", 
  "Singrauli, Madhya Pradesh, India": "singrauli_west",
  "Talcher, Odisha, India": "talcher_north",
  "Korba, Chhattisgarh, India": "korba_central"
};

const MINING_CITIES = [
  { label: "Jharia, Jharkhand, India", value: "Jharia, Jharkhand, India" },
  { label: "Panaji, Goa, India", value: "Panaji, Goa, India" },
  { label: "Bellary, Karnataka, India", value: "Bellary, Karnataka, India" },
  { label: "Raipur, Chhattisgarh, India", value: "Raipur, Chhattisgarh, India" },
  { label: "Nagpur, Maharashtra, India", value: "Nagpur, Maharashtra, India" },
  { label: "Chandrapur, Maharashtra, India", value: "Chandrapur, Maharashtra, India" },
  { label: "Dhanbad, Jharkhand, India", value: "Dhanbad, Jharkhand, India" },
  { label: "Singrauli, Madhya Pradesh, India", value: "Singrauli, Madhya Pradesh, India" },
  { label: "Talcher, Odisha, India", value: "Talcher, Odisha, India" },
  { label: "Korba, Chhattisgarh, India", value: "Korba, Chhattisgarh, India" }
];

export function LiveMonitoring() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LiveMonitorResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [inputMode, setInputMode] = useState<'dropdown' | 'custom'>('dropdown');
  const updateZoneRisk = useRiskMapStore(state => state.updateZoneRisk);

  const handleMonitor = async () => {
    const locationToMonitor = inputMode === 'dropdown' ? selectedLocation : customLocation;
    
    if (!locationToMonitor.trim()) {
      setError('Please select or enter a location');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await monitorLocation(locationToMonitor);
      setResult(response);
      
      // Update risk map for known locations
      if (inputMode === 'dropdown' && LOCATION_ID_MAP[locationToMonitor as keyof typeof LOCATION_ID_MAP]) {
        const locationId = LOCATION_ID_MAP[locationToMonitor as keyof typeof LOCATION_ID_MAP];
        const riskLevel = getRiskLevel(response.probability);
        updateZoneRisk(locationId, riskLevel, response.probability * 100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to monitor location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (result) {
      handleMonitor();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wifi className="w-6 h-6 text-green-500" />
        <h1 className="text-3xl font-bold">Live Monitoring</h1>
        <Badge variant="outline" className="text-green-600 border-green-300">
          Real-time API Data
        </Badge>
      </div>
      
      <p className="text-muted-foreground">
        Monitor rockfall risk using real-time weather, elevation, and environmental data from live APIs.
      </p>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant={inputMode === 'dropdown' ? 'default' : 'outline'}
              onClick={() => setInputMode('dropdown')}
              size="sm"
            >
              Popular Mining Sites
            </Button>
            <Button
              variant={inputMode === 'custom' ? 'default' : 'outline'}
              onClick={() => setInputMode('custom')}
              size="sm"
            >
              Custom Location
            </Button>
          </div>

          {inputMode === 'dropdown' ? (
            <div className="space-y-2">
              <Label htmlFor="location-select">Select Mining Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger id="location-select">
                  <SelectValue placeholder="Choose a mining location..." />
                </SelectTrigger>
                <SelectContent>
                  {MINING_CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {city.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="custom-location">Custom Location</Label>
              <Input
                id="custom-location"
                placeholder="Enter location (e.g., Mumbai, Maharashtra, India)"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Use format: City, State, Country for best results
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleMonitor} 
              disabled={isLoading || (!selectedLocation && !customLocation)}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Fetching Live Data...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Monitor Location
                </>
              )}
            </Button>
            
            {result && (
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-700 rounded-md">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </Card>

      {result && (
        <>
          <Separator />
          <LivePredictionResult result={result} />
        </>
      )}
    </div>
  );
}