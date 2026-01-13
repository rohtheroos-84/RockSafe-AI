import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  title: string;
  value: string;
  risk: "low" | "medium" | "high" | "critical";
  change?: number;
  location: string;
  lastUpdate: string;
}

const RiskCard = ({ title, value, risk, change, location, lastUpdate }: RiskCardProps) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-success text-success-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "critical":
        return "bg-destructive text-destructive-foreground animate-pulse";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    if (change === undefined) return <Minus className="h-3 w-3" />;
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "text-muted-foreground";
    return change > 0 ? "text-warning" : "text-success";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-2xl font-bold">{value}</div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={cn("text-xs", getRiskColor(risk))}>
              {risk.toUpperCase()}
            </Badge>
            
            {change !== undefined && (
              <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Location:</span> {location}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Updated:</span> {lastUpdate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskCard;