import RiskCard from "@/components/RiskCard";
import Chart from "@/components/Chart";
import MapView from "@/components/MapView";
import AlertTable from "@/components/AlertTable";

const Dashboard = () => {
  // Sample data for charts
  const riskTrendData = [
    { name: "00:00", value: 35 },
    { name: "04:00", value: 42 },
    { name: "08:00", value: 58 },
    { name: "12:00", value: 73 },
    { name: "16:00", value: 69 },
    { name: "20:00", value: 45 },
  ];

  const sensorData = [
    { name: "Displacement", value: 8 },
    { name: "Strain", value: 12 },
    { name: "Pressure", value: 6 },
    { name: "Vibration", value: 15 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 65 },
    { name: "Medium Risk", value: 25 },
    { name: "High Risk", value: 8 },
    { name: "Critical", value: 2 },
  ];

  const recentAlerts = [
    {
      id: "A001",
      type: "rockfall" as const,
      priority: "critical" as const,
      location: "West Ridge - Section 7",
      description: "High probability rockfall detected",
      timestamp: "2 mins ago",
      status: "active" as const
    },
    {
      id: "A002",
      type: "displacement" as const,
      priority: "high" as const,
      location: "South Slope - Bench 12", 
      description: "Unusual ground displacement pattern",
      timestamp: "15 mins ago",
      status: "acknowledged" as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mining Safety Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and risk assessment for Alpha-7 Mining Site
        </p>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RiskCard
          title="Overall Risk Level"
          value="Medium"
          risk="medium"
          change={12}
          location="Site-wide"
          lastUpdate="2 mins ago"
        />
        <RiskCard
          title="Active Sensors"
          value="127/130"
          risk="low"
          change={-2}
          location="All zones"
          lastUpdate="30 secs ago"
        />
        <RiskCard
          title="Critical Zones"
          value="3"
          risk="high"
          change={15}
          location="Multiple"
          lastUpdate="5 mins ago"
        />
        <RiskCard
          title="Weather Impact"
          value="Moderate"
          risk="medium"
          location="Regional"
          lastUpdate="1 hour ago"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Chart
            title="Risk Level Trend (24h)"
            type="line"
            data={riskTrendData}
            color="hsl(var(--warning))"
            height={250}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Chart
              title="Active Sensors by Type"
              type="bar"
              data={sensorData}
              color="hsl(var(--primary))"
              height={200}
            />
            <Chart
              title="Risk Distribution"
              type="pie"
              data={riskDistribution}
              height={200}
            />
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="space-y-6">
          <MapView title="Live Risk Map" showControls={false} />
          
          {/* Quick Stats */}
          {/* <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Personnel on site</span>
                <span className="text-sm font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Equipment active</span>
                <span className="text-sm font-medium">12/15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last incident</span>
                <span className="text-sm font-medium">23 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">System uptime</span>
                <span className="text-sm font-medium text-success">99.8%</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Recent Alerts */}
      <AlertTable 
        title="Recent Alerts (Last 24h)" 
        alerts={recentAlerts}
        showActions={false}
      />
    </div>
  );
};

export default Dashboard;