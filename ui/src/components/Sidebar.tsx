import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Settings, 
  Info,
  TrendingUp,
  Activity,
  Brain,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Risk Map", href: "/risk-map", icon: Map },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Live Monitoring", href: "/live-monitoring", icon: Wifi },
  { name: "Predict", href: "/predict", icon: Brain },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "About", href: "/about", icon: Info },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Control Center</h2>
          <p className="text-sm text-muted-foreground">Site monitoring & management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-success/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success">System Online</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All sensors operational
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;