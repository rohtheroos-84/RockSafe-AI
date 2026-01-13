import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertTriangle, ShieldCheck, AlertOctagon, Info, MapPin, Thermometer, CloudRain, Wind, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LiveMonitorResponse } from '@/services/liveMonitor';

interface LivePredictionResultProps {
  result: LiveMonitorResponse;
}

export function LivePredictionResult({ result }: LivePredictionResultProps) {
  const probabilityPercentage = (result.probability * 100).toFixed(1);
  
  // Determine risk level based on probability
  const getRiskLevel = (probability: number) => {
    if (probability >= 0.75) return 'Critical';
    if (probability >= 0.5) return 'High';
    if (probability >= 0.25) return 'Moderate';
    return 'Low';
  };

  const riskLevel = getRiskLevel(result.probability);
  
  const riskColors = {
    Critical: 'text-red-500 bg-red-500/10',
    High: 'text-orange-500 bg-orange-500/10',
    Moderate: 'text-yellow-500 bg-yellow-500/10',
    Low: 'text-green-500 bg-green-500/10'
  };

  const riskMessages = {
    Critical: 'IMMEDIATE EVACUATION RECOMMENDED! Take urgent preventive measures.',
    High: 'HIGH RISK DETECTED. Implement safety protocols immediately.',
    Moderate: 'Exercise caution. Monitor situation closely.',
    Low: 'Safe conditions detected. Continue regular monitoring.'
  };

  const RiskIcon = {
    Critical: AlertOctagon,
    High: AlertTriangle,
    Moderate: Info,
    Low: ShieldCheck
  }[riskLevel];

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Location Information */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Live Monitoring Results</h3>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              📡 Live Data
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">{result.location_info.location_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monitoring Time</p>
              <p className="font-medium">{formatTimestamp(result.timestamp)}</p>
            </div>
          </div>
        </Card>

        {/* Real-time API Data */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-300">
              🌐 Live API Data
            </Badge>
            Environmental Conditions
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <Thermometer className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-semibold">{typeof result.location_info.temperature === 'number' 
                ? `${result.location_info.temperature.toFixed(1)}°C` 
                : `${result.location_info.temperature}°C`}</p>
            </div>
            
            <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
              <CloudRain className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Rainfall (24h)</p>
              <p className="font-semibold">{typeof result.location_info.rainfall === 'number' 
                ? `${result.location_info.rainfall.toFixed(1)}mm` 
                : `${result.location_info.rainfall}mm`}</p>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <Wind className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{typeof result.location_info.wind_speed === 'number' 
                ? `${result.location_info.wind_speed.toFixed(1)} km/h` 
                : `${result.location_info.wind_speed} km/h`}</p>
            </div>
            
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Elevation</p>
              <p className="font-semibold">{typeof result.location_info.elevation === 'number' 
                ? `${result.location_info.elevation.toFixed(0)}m` 
                : `${result.location_info.elevation}m`}</p>
            </div>
          </div>
        </Card>

        {/* Risk Assessment */}
        <Card className="p-6 overflow-hidden">
          <div className="space-y-6">
            {/* Risk Level Header */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg",
                riskColors[riskLevel as keyof typeof riskColors]
              )}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: riskLevel === 'Critical' ? [0, -10, 10, -10, 10, 0] : 0 }}
                  transition={{ repeat: riskLevel === 'Critical' ? Infinity : 0, duration: 2 }}
                >
                  <RiskIcon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-semibold">Live Risk Assessment</h3>
              </div>
              <Badge 
                variant={riskLevel === 'Low' ? 'default' : 'destructive'}
                className={cn(
                  "text-sm px-3 py-1",
                  riskLevel === 'Critical' && "animate-pulse"
                )}
              >
                {riskLevel} Risk
              </Badge>
            </motion.div>

            {/* Risk Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "text-sm font-medium p-3 rounded-md text-center",
                riskLevel === 'Critical' && "bg-red-500/10 text-red-500 animate-pulse",
                riskLevel === 'High' && "bg-orange-500/10 text-orange-500",
                riskLevel === 'Moderate' && "bg-yellow-500/10 text-yellow-500",
                riskLevel === 'Low' && "bg-green-500/10 text-green-500"
              )}
            >
              {riskMessages[riskLevel as keyof typeof riskMessages]}
            </motion.div>

            {/* Probability Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risk Probability</span>
                <motion.span
                  key={probabilityPercentage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {probabilityPercentage}%
                </motion.span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              >
                <Progress 
                  value={Number(probabilityPercentage)} 
                  className={cn(
                    "h-3 transition-colors",
                    riskLevel === 'Critical' && "bg-red-200",
                    riskLevel === 'High' && "bg-orange-200",
                    riskLevel === 'Moderate' && "bg-yellow-200",
                    riskLevel === 'Low' && "bg-green-200"
                  )}
                />
              </motion.div>
            </div>

            {/* SMS Alert Status */}
            {result.sms_alert && (riskLevel === 'Critical' || riskLevel === 'High') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className={cn(
                  "p-4 rounded-lg border",
                  result.sms_alert.success 
                    ? "bg-green-500/10 text-green-700 border-green-200" 
                    : "bg-orange-500/10 text-orange-700 border-orange-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.sms_alert.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">Live Monitoring Alert Status</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Message:</span> {result.sms_alert.message}
                  </p>
                  
                  {result.sms_alert.success && result.sms_alert.sent_count > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        📱 {result.sms_alert.sent_count} SMS Sent
                      </Badge>
                      {result.sms_alert.risk_level && (
                        <Badge variant="destructive">
                          {result.sms_alert.risk_level} Alert
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {result.sms_alert.success && riskLevel === 'Critical' && (
                    <motion.p 
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-sm font-medium text-red-600 mt-2"
                    >
                      🚨 Emergency contacts notified via SMS! Follow evacuation procedures immediately.
                    </motion.p>
                  )}
                  
                  {result.sms_alert.success && riskLevel === 'High' && (
                    <p className="text-sm font-medium text-orange-600 mt-2">
                      ⚠️ Emergency contacts notified via SMS. Implement safety protocols immediately.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Details Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="text-sm text-muted-foreground">Threshold</p>
                <p className="text-lg font-semibold">{(result.used_threshold * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Raw Score</p>
                <p className="text-lg font-semibold">{result.raw_score.toFixed(4)}</p>
              </div>
            </motion.div>

            {/* Action Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className={cn(
                "text-center p-3 rounded-lg font-medium",
                riskLevel === 'Critical' && "bg-red-500/10 text-red-500 animate-pulse",
                riskLevel === 'High' && "bg-orange-500/10 text-orange-500",
                riskLevel === 'Moderate' && "bg-yellow-500/10 text-yellow-500",
                riskLevel === 'Low' && "bg-green-500/10 text-green-500"
              )}
            >
              Status: {riskLevel === 'Low' ? 'Safe to Proceed' : 'Action Required'}
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}