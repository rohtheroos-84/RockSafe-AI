import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertTriangle, Clock, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "rockfall" | "displacement" | "sensor" | "weather";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  description: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

interface AlertTableProps {
  alerts?: Alert[];
  title?: string;
  showActions?: boolean;
}

const AlertTable = ({ 
  alerts = [], 
  title = "Recent Alerts",
  showActions = true 
}: AlertTableProps) => {
  const defaultAlerts: Alert[] = [
    {
      id: "A001",
      type: "rockfall",
      priority: "critical",
      location: "West Ridge - Section 7",
      description: "High probability rockfall detected - immediate evacuation recommended",
      timestamp: "2 mins ago",
      status: "active"
    },
    {
      id: "A002", 
      type: "displacement",
      priority: "high",
      location: "South Slope - Bench 12",
      description: "Unusual ground displacement pattern detected",
      timestamp: "15 mins ago",
      status: "acknowledged"
    },
    {
      id: "A003",
      type: "sensor",
      priority: "medium", 
      location: "East Pit - Sensor Grid 4",
      description: "Sensor connectivity issues affecting monitoring coverage",
      timestamp: "1 hour ago",
      status: "active"
    },
    {
      id: "A004",
      type: "weather",
      priority: "low",
      location: "Site-wide",
      description: "Heavy rainfall forecast - increased monitoring activated",
      timestamp: "2 hours ago",
      status: "resolved"
    }
  ];

  const activeAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-destructive";
      case "acknowledged":
        return "text-warning";
      case "resolved":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rockfall":
        return <AlertTriangle className="h-4 w-4" />;
      case "displacement":
        return <MapPin className="h-4 w-4" />;
      case "sensor":
        return <Clock className="h-4 w-4" />;
      case "weather":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(alert.type)}
                      <span className="capitalize">{alert.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getPriorityColor(alert.priority))}
                    >
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.location}</TableCell>
                  <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                  <TableCell className="text-muted-foreground">{alert.timestamp}</TableCell>
                  <TableCell>
                    <span className={cn("capitalize font-medium", getStatusColor(alert.status))}>
                      {alert.status}
                    </span>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {alert.status === "active" && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertTable;