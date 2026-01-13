import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Brain, 
  Zap, 
  Users, 
  Award, 
  ExternalLink,
  Github,
  Mail,
  Phone
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Prediction",
      description: "Advanced machine learning algorithms analyze geological data to predict potential rockfall events with high accuracy."
    },
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "Continuous monitoring of sensor networks provides instant alerts and updates on changing conditions."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Comprehensive safety protocols and automated emergency response systems protect personnel and equipment."
    },
    {
      icon: Users,
      title: "Multi-User Access",
      description: "Role-based access control allows different team members to access relevant information and controls."
    }
  ];

  const stats = [
    { label: "Sites Monitored", value: "50+" },
    { label: "Sensors Deployed", value: "5,000+" },
    { label: "Lives Protected", value: "10,000+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">RockSafe AI</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced AI-based rockfall prediction and alert system designed to enhance safety 
          in open-pit mining operations through intelligent monitoring and predictive analytics.
        </p>
        {/* <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="bg-success text-success-foreground">
            Version 2.1.0
          </Badge>
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            Production Ready
          </Badge>
        </div> */}
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Impact & Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data Sources</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Digital Elevation Models (DEM)</li>
                <li>• Drone-captured imagery and LiDAR</li>
                <li>• Geotechnical sensor networks</li>
                <li>• Environmental monitoring stations</li>
                <li>• Historical incident databases</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI/ML Components</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Neural networks for pattern recognition</li>
                <li>• Time series analysis for trend detection</li>
                <li>• Computer vision for slope analysis</li>
                <li>• Ensemble models for risk assessment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ISO 45001 (Occupational Health & Safety)</li>
                <li>• MSHA Mining Safety Standards</li>
                <li>• ISO 27001 (Information Security)</li>
                <li>• IEC 61508 (Functional Safety)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Certifications</h4>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Mining Safety Excellence Award 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Recharts</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Backend & AI</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">TensorFlow</Badge>
                <Badge variant="outline">PostgreSQL</Badge>
                <Badge variant="outline">Redis</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Docker</Badge>
                <Badge variant="outline">Kubernetes</Badge>
                <Badge variant="outline">AWS</Badge>
                <Badge variant="outline">Grafana</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">support@rocksafe.ai</p>
                <p className="text-sm text-muted-foreground">Technical Support</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">24/7 Emergency Hotline</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Github className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">github.com/rocksafe-ai</p>
                <p className="text-sm text-muted-foreground">Open Source Components</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <span>User Documentation</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>API Reference</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Training Materials</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Safety Guidelines</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2024 RockSafe AI. All rights reserved. | Protecting lives through intelligent monitoring.
        </p>
      </div>
    </div>
  );
};

export default About;