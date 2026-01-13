import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from "@/components/MapView";
import Chart from "@/components/Chart";
import { 
  Layers, 
  Filter, 
  Download, 
  RefreshCw,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useRiskMapStore } from "@/services/riskMap";
import { generateRiskMapPDF } from "@/utils/exportPDF";

const RiskMap = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const zones = useRiskMapStore((state) => state.zones);

  const handleExport = async () => {
    if (!mapRef.current) return;
    
    try {
      setIsExporting(true);
      const pdf = await generateRiskMapPDF(zones, mapRef.current, sensorStatusData);
      pdf.save('rockfall-risk-assessment.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // All zone data is now managed by the riskMap store

  // Historical data for selected zone
  const zoneHistoryData = [
    { name: "Jan", value: 25 },
    { name: "Feb", value: 32 },
    { name: "Mar", value: 45 },
    { name: "Apr", value: 52 },
    { name: "May", value: 67 },
    { name: "Jun", value: 78 },
  ];

  const sensorStatusData = [
    { name: "Active", value: 142 },
    { name: "Warning", value: 8 },
    { name: "Offline", value: 3 },
    { name: "Maintenance", value: 2 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Risk Assessment Map</h1>
          <p className="text-muted-foreground">
            Real-time geological risk monitoring and zone analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map - Takes up most space */}
        <div className="lg:col-span-3">
          <div ref={mapRef}>
            <MapView 
              title="Interactive Risk Map" 
              zones={zones}
              showControls={true}
            />
          </div>
        </div>

        {/* Right Sidebar - Zone Details */}
        <div className="space-y-6">
          {/* Zone List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Risk Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedZone === zone.id ? "bg-muted border-primary" : ""
                    }`}
                    onClick={() => setSelectedZone(zone.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{zone.name}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          zone.risk === "low"
                            ? "bg-success text-success-foreground"
                            : zone.risk === "medium"
                            ? "bg-warning text-warning-foreground"
                            : zone.risk === "high"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-destructive text-destructive-foreground animate-pulse"
                        }`}
                      >
                        {zone.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Risk:</span>
                        <span className="font-medium">{zone.probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sensors:</span>
                        <span className="font-medium">{zone.sensors}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">2 Critical zones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-warning" />
                  <span className="text-sm">3 Medium risk areas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm">155 Active sensors</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last updated: 2 minutes ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Detailed Analysis */}
      <Tabs defaultValue="zones" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones">Zone Analysis</TabsTrigger>
          <TabsTrigger value="sensors">Sensor Status</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {zones.slice(0, 3).map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Probability</span>
                      <span className="text-sm font-bold">{zone.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Sensors</span>
                      <span className="text-sm font-medium">{zone.sensors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Incident</span>
                      <span className="text-sm font-medium">{zone.lastIncident}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`w-full justify-center ${
                        zone.risk === "low"
                          ? "bg-success text-success-foreground"
                          : zone.risk === "medium"
                          ? "bg-warning text-warning-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {zone.risk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sensors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Chart
              title="Sensor Status Distribution"
              type="pie"
              data={sensorStatusData}
              height={300}
            />
            <Card>
              <CardHeader>
                <CardTitle>Sensor Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Sensors</span>
                    <span className="text-lg font-bold">155</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success">Online</span>
                    <span className="text-sm font-medium">142 (91.6%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-warning">Warning</span>
                    <span className="text-sm font-medium">8 (5.2%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-destructive">Offline</span>
                    <span className="text-sm font-medium">3 (1.9%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                    <span className="text-sm font-medium">2 (1.3%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Chart
            title="Risk Level History (6 Months)"
            type="line"
            data={zoneHistoryData}
            color="hsl(var(--destructive))"
            height={400}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskMap;