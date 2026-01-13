import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertTable from "@/components/AlertTable";
import Chart from "@/components/Chart";
import { 
  Bell, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle
} from "lucide-react";

const Alerts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Comprehensive alert data
  const allAlerts = [
    {
      id: "A001",
      type: "rockfall" as const,
      priority: "critical" as const,
      location: "West Ridge - Section 7",
      description: "High probability rockfall detected - immediate evacuation recommended",
      timestamp: "2 mins ago",
      status: "active" as const
    },
    {
      id: "A002",
      type: "displacement" as const,
      priority: "high" as const,
      location: "South Slope - Bench 12",
      description: "Unusual ground displacement pattern detected by sensors S-45 to S-52",
      timestamp: "15 mins ago",
      status: "acknowledged" as const
    },
    {
      id: "A003",
      type: "sensor" as const,
      priority: "medium" as const,
      location: "East Pit - Sensor Grid 4",
      description: "Sensor connectivity issues affecting monitoring coverage in sector E4",
      timestamp: "1 hour ago",
      status: "active" as const
    },
    {
      id: "A004",
      type: "weather" as const,
      priority: "low" as const,
      location: "Site-wide",
      description: "Heavy rainfall forecast - increased monitoring protocols activated",
      timestamp: "2 hours ago",
      status: "resolved" as const
    },
    {
      id: "A005",
      type: "rockfall" as const,
      priority: "high" as const,
      location: "North Wall - Zone 3",
      description: "Elevated vibration patterns indicating potential instability",
      timestamp: "3 hours ago",
      status: "acknowledged" as const
    },
    {
      id: "A006",
      type: "displacement" as const,
      priority: "medium" as const,
      location: "Central Bench - Area B",
      description: "Minor ground settlement detected, monitoring increased",
      timestamp: "4 hours ago",
      status: "resolved" as const
    }
  ];

  // Filter alerts based on status
  const activeAlerts = allAlerts.filter(alert => alert.status === "active");
  const acknowledgedAlerts = allAlerts.filter(alert => alert.status === "acknowledged");
  const resolvedAlerts = allAlerts.filter(alert => alert.status === "resolved");

  // Alert statistics for charts
  const alertTrend = [
    { name: "00:00", value: 2 },
    { name: "04:00", value: 1 },
    { name: "08:00", value: 4 },
    { name: "12:00", value: 7 },
    { name: "16:00", value: 3 },
    { name: "20:00", value: 5 },
  ];

  const alertByType = [
    { name: "Rockfall", value: 12 },
    { name: "Displacement", value: 8 },
    { name: "Sensor", value: 5 },
    { name: "Weather", value: 3 },
  ];

  const priorityDistribution = [
    { name: "Low", value: 8 },
    { name: "Medium", value: 12 },
    { name: "High", value: 6 },
    { name: "Critical", value: 2 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Alert Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage safety alerts across all mining zones
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-destructive">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
              <p className="text-2xl font-bold text-warning">{acknowledgedAlerts.length}</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-bold text-success">{resolvedAlerts.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-destructive animate-pulse">
                {allAlerts.filter(a => a.priority === "critical").length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>New Alert</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert Lists */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Active ({activeAlerts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="acknowledged" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Acknowledged ({acknowledgedAlerts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Resolved ({resolvedAlerts.length})</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <AlertTable alerts={activeAlerts} title="Active Alerts" />
            </TabsContent>
            
            <TabsContent value="acknowledged">
              <AlertTable alerts={acknowledgedAlerts} title="Acknowledged Alerts" />
            </TabsContent>
            
            <TabsContent value="resolved">
              <AlertTable alerts={resolvedAlerts} title="Resolved Alerts" showActions={false} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          <Chart
            title="Alert Trend (24h)"
            type="line"
            data={alertTrend}
            color="hsl(var(--destructive))"
            height={200}
          />
          
          <Chart
            title="Alerts by Type"
            type="bar"
            data={alertByType}
            color="hsl(var(--warning))"
            height={200}
          />
          
          <Chart
            title="Priority Distribution"
            type="pie"
            data={priorityDistribution}
            height={200}
          />
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Critical alert triggered</p>
                    <p className="text-xs text-muted-foreground">West Ridge - 2 mins ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alert acknowledged</p>
                    <p className="text-xs text-muted-foreground">South Slope - 15 mins ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Weather alert resolved</p>
                    <p className="text-xs text-muted-foreground">Site-wide - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">High priority alert</p>
                    <p className="text-xs text-muted-foreground">North Wall - 3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;