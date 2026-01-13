import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskZone {
  id: string;
  name: string;
  risk: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
}

interface MapViewProps {
  title?: string;
  zones?: RiskZone[];
  showControls?: boolean;
}

const MapView = ({ 
  title = "Site Risk Map", 
  zones = [],
  showControls = true 
}: MapViewProps) => {
  const defaultZones: RiskZone[] = [
    { id: "z1", name: "North Wall", risk: "low", x: 20, y: 30 },
    { id: "z2", name: "East Pit", risk: "medium", x: 70, y: 25 },
    { id: "z3", name: "South Slope", risk: "high", x: 45, y: 80 },
    { id: "z4", name: "West Ridge", risk: "critical", x: 15, y: 60 },
    { id: "z5", name: "Central Bench", risk: "low", x: 50, y: 45 },
  ];

  const activeZones = zones.length > 0 ? zones : defaultZones;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-success shadow-success/50";
      case "medium":
        return "bg-warning shadow-warning/50";
      case "high":
        return "bg-destructive shadow-destructive/50";
      case "critical":
        return "bg-destructive shadow-destructive/50 animate-pulse";
      default:
        return "bg-muted shadow-muted/50";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {showControls && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-1" />
              Layers
            </Button>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg border-2 border-dashed border-border overflow-hidden">
          {/* Topographic background pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="topo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
                  <circle cx="20" cy="20" r="8" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo)" />
            </svg>
          </div>

          {/* Risk zones */}
          {activeZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125",
                  getRiskColor(zone.risk)
                )}
              />
              <MapPin className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-4 w-4 text-foreground" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-card border border-border rounded-lg shadow-lg p-2 min-w-max">
                  <p className="font-medium text-sm">{zone.name}</p>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs mt-1", getRiskColor(zone.risk).replace("shadow-", ""))}
                  >
                    {zone.risk.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-medium mb-2">Risk Levels</h4>
            <div className="space-y-1">
              {[
                { level: "Low", color: "bg-success" },
                { level: "Medium", color: "bg-warning" },
                { level: "High", color: "bg-destructive" },
                { level: "Critical", color: "bg-destructive animate-pulse" },
              ].map((item) => (
                <div key={item.level} className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-xs text-muted-foreground">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;