import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database,
  Save,
  RotateCcw
} from "lucide-react";

const SettingsForm = () => {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Alpha-7 Mining Site" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Northern District" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Site Description</Label>
            <Textarea 
              id="description" 
              defaultValue="Open-pit copper mine with 3 active benches and automated monitoring systems."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc-5">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                <SelectItem value="utc-6">UTC-6 (Central Time)</SelectItem>
                <SelectItem value="utc-7">UTC-7 (Mountain Time)</SelectItem>
                <SelectItem value="utc-8">UTC-8 (Pacific Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Alert Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Critical alerts via SMS
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Audio notifications in dashboard
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Risk Threshold for Alerts</Label>
            <div className="px-3">
              <Slider
                defaultValue={[75]}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Generate alerts when risk level exceeds 75%
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertEmail">Alert Email Recipients</Label>
            <Textarea 
              id="alertEmail" 
              placeholder="supervisor@mine.com, safety@mine.com"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Safety Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evacuationZone">Auto-Evacuation Zone (m)</Label>
              <Input id="evacuationZone" type="number" defaultValue="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warningZone">Warning Zone (m)</Label>
              <Input id="warningZone" type="number" defaultValue="1000" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Monitoring Frequency</Label>
            <Select defaultValue="real-time">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">Real-time (1 sec)</SelectItem>
                <SelectItem value="high">High (5 sec)</SelectItem>
                <SelectItem value="medium">Medium (30 sec)</SelectItem>
                <SelectItem value="low">Low (5 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Protocol</Label>
              <p className="text-sm text-muted-foreground">
                Auto-activate emergency procedures
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Data Retention Period</Label>
            <Select defaultValue="1-year">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">3 Months</SelectItem>
                <SelectItem value="6-months">6 Months</SelectItem>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="2-years">2 Years</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Backup</Label>
              <p className="text-sm text-muted-foreground">
                Daily backup of critical data
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupLocation">Backup Location</Label>
            <Input id="backupLocation" defaultValue="/backup/rockfall-data" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" className="flex items-center space-x-2">
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Defaults</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsForm;