import { Bell, Settings, User, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">RockSafe AI</h1>
            <p className="text-xs text-muted-foreground">Mining Safety Monitoring</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-warning/10 px-3 py-1.5 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-warning">3 Active Alerts</span>
        </div>

        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            5
          </Badge>
        </Button>

        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5" />
        </Button>

        {/* <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Mine Supervisor</p>
            <p className="text-muted-foreground text-xs">Site Alpha-7</p>
          </div>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;