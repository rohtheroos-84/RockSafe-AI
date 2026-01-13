import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';

interface PredictionFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const defaultValues = {
    timestamp: "2025-09-27",
    location_id: "loc_test_4",
    elevation: "780.4412",
    slope: "32.8176",
    aspect: "137.4427",
    curvature: "0.3186",
    fracture_density: "0.2078",
    rock_strength: "42.3119",
    weathering: "0.5823",
    displacement: "9.4315",
    strain: "0.1452",
    pore_pressure: "1.7421",
    rainfall: "1.8234",
    temperature: "14.8842",
    vibrations: "0.1987",
    wind_speed: "6.1175",
    rainfall_3d_sum: "6.2891",
    rainfall_7d_sum: "15.2235",
    pore_3d_mean: "1.7328",
    disp_rate: "0.0",
    disp_accel: "0.0",
    blast_event: "0.0",
    blast_magnitude: "0.0",
    blast_distance: "275.6634",
    ppv: "0.0",
    blast_24h: "0.0",
    blast_72h: "0.0",
    max_ppv_24h: "0.0",
    blast_risk_multiplier: "1.0582",
    cumulative_blast_damage: "0.0"
  };

  const [formData, setFormData] = useState(defaultValues);

  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultValues, null, 2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert all numeric fields to numbers
    const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (key === 'timestamp' || key === 'location_id') {
        acc[key] = value;
      } else {
        acc[key] = value === '' ? 0 : Number(value);
      }
      return acc;
    }, {} as any);

    onSubmit(processedData);
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      onSubmit(parsedData);
    } catch (error) {
      console.error('Invalid JSON format:', error);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="form">Form Input</TabsTrigger>
          <TabsTrigger value="json">JSON Input</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">Date</Label>
                <Input
                  id="timestamp"
                  type="date"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_id">Location ID</Label>
                <Input
                  id="location_id"
                  type="text"
                  value={formData.location_id}
                  onChange={(e) => setFormData({...formData, location_id: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="elevation">Elevation (m)</Label>
                <Input
                  id="elevation"
                  type="number"
                  step="0.0001"
                  value={formData.elevation}
                  onChange={(e) => setFormData({...formData, elevation: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slope">Slope (degrees)</Label>
                <Input
                  id="slope"
                  type="number"
                  step="0.0001"
                  value={formData.slope}
                  onChange={(e) => setFormData({...formData, slope: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspect">Aspect (degrees)</Label>
                <Input
                  id="aspect"
                  type="number"
                  step="0.0001"
                  value={formData.aspect}
                  onChange={(e) => setFormData({...formData, aspect: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="curvature">Curvature</Label>
                <Input
                  id="curvature"
                  type="number"
                  step="0.0001"
                  value={formData.curvature}
                  onChange={(e) => setFormData({...formData, curvature: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fracture_density">Fracture Density</Label>
                <Input
                  id="fracture_density"
                  type="number"
                  step="0.0001"
                  value={formData.fracture_density}
                  onChange={(e) => setFormData({...formData, fracture_density: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rock_strength">Rock Strength</Label>
                <Input
                  id="rock_strength"
                  type="number"
                  step="0.0001"
                  value={formData.rock_strength}
                  onChange={(e) => setFormData({...formData, rock_strength: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weathering">Weathering</Label>
                <Input
                  id="weathering"
                  type="number"
                  step="0.0001"
                  value={formData.weathering}
                  onChange={(e) => setFormData({...formData, weathering: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displacement">Displacement (mm)</Label>
                <Input
                  id="displacement"
                  type="number"
                  step="0.0001"
                  value={formData.displacement}
                  onChange={(e) => setFormData({...formData, displacement: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strain">Strain</Label>
                <Input
                  id="strain"
                  type="number"
                  step="0.0001"
                  value={formData.strain}
                  onChange={(e) => setFormData({...formData, strain: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pore_pressure">Pore Pressure (kPa)</Label>
                <Input
                  id="pore_pressure"
                  type="number"
                  step="0.0001"
                  value={formData.pore_pressure}
                  onChange={(e) => setFormData({...formData, pore_pressure: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.0001"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({...formData, rainfall: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.0001"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibrations">Vibrations</Label>
                <Input
                  id="vibrations"
                  type="number"
                  step="0.0001"
                  value={formData.vibrations}
                  onChange={(e) => setFormData({...formData, vibrations: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wind_speed">Wind Speed (m/s)</Label>
                <Input
                  id="wind_speed"
                  type="number"
                  step="0.0001"
                  value={formData.wind_speed}
                  onChange={(e) => setFormData({...formData, wind_speed: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall_3d_sum">3-Day Rainfall Sum (mm)</Label>
                <Input
                  id="rainfall_3d_sum"
                  type="number"
                  step="0.0001"
                  value={formData.rainfall_3d_sum}
                  onChange={(e) => setFormData({...formData, rainfall_3d_sum: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall_7d_sum">7-Day Rainfall Sum (mm)</Label>
                <Input
                  id="rainfall_7d_sum"
                  type="number"
                  step="0.0001"
                  value={formData.rainfall_7d_sum}
                  onChange={(e) => setFormData({...formData, rainfall_7d_sum: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pore_3d_mean">3-Day Pore Pressure Mean</Label>
                <Input
                  id="pore_3d_mean"
                  type="number"
                  step="0.0001"
                  value={formData.pore_3d_mean}
                  onChange={(e) => setFormData({...formData, pore_3d_mean: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disp_rate">Displacement Rate</Label>
                <Input
                  id="disp_rate"
                  type="number"
                  step="0.0001"
                  value={formData.disp_rate}
                  onChange={(e) => setFormData({...formData, disp_rate: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disp_accel">Displacement Acceleration</Label>
                <Input
                  id="disp_accel"
                  type="number"
                  step="0.0001"
                  value={formData.disp_accel}
                  onChange={(e) => setFormData({...formData, disp_accel: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_event">Blast Event</Label>
                <Input
                  id="blast_event"
                  type="number"
                  step="0.0001"
                  value={formData.blast_event}
                  onChange={(e) => setFormData({...formData, blast_event: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_magnitude">Blast Magnitude</Label>
                <Input
                  id="blast_magnitude"
                  type="number"
                  step="0.0001"
                  value={formData.blast_magnitude}
                  onChange={(e) => setFormData({...formData, blast_magnitude: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_distance">Blast Distance (m)</Label>
                <Input
                  id="blast_distance"
                  type="number"
                  step="0.0001"
                  value={formData.blast_distance}
                  onChange={(e) => setFormData({...formData, blast_distance: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ppv">PPV</Label>
                <Input
                  id="ppv"
                  type="number"
                  step="0.0001"
                  value={formData.ppv}
                  onChange={(e) => setFormData({...formData, ppv: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_24h">24h Blast</Label>
                <Input
                  id="blast_24h"
                  type="number"
                  step="0.0001"
                  value={formData.blast_24h}
                  onChange={(e) => setFormData({...formData, blast_24h: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_72h">72h Blast</Label>
                <Input
                  id="blast_72h"
                  type="number"
                  step="0.0001"
                  value={formData.blast_72h}
                  onChange={(e) => setFormData({...formData, blast_72h: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_ppv_24h">Max PPV 24h</Label>
                <Input
                  id="max_ppv_24h"
                  type="number"
                  step="0.0001"
                  value={formData.max_ppv_24h}
                  onChange={(e) => setFormData({...formData, max_ppv_24h: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blast_risk_multiplier">Blast Risk Multiplier</Label>
                <Input
                  id="blast_risk_multiplier"
                  type="number"
                  step="0.0001"
                  value={formData.blast_risk_multiplier}
                  onChange={(e) => setFormData({...formData, blast_risk_multiplier: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cumulative_blast_damage">Cumulative Blast Damage</Label>
                <Input
                  id="cumulative_blast_damage"
                  type="number"
                  step="0.0001"
                  value={formData.cumulative_blast_damage}
                  onChange={(e) => setFormData({...formData, cumulative_blast_damage: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Predicting...' : 'Predict Rockfall'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="json">
          <form onSubmit={handleJsonSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">Paste JSON Data</Label>
              <Textarea
                id="json-input"
                className="font-mono h-[200px]"
                placeholder="Paste your JSON data here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Predicting...' : 'Predict from JSON'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}