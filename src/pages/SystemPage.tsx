import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { systemDomains } from "@/components/home/SystemsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SensorInput } from "@/components/dashboard/SensorInput";
import { RiskLevel } from "@/components/dashboard/RiskBadge";
import NeuralBackground from "@/components/ui/flow-field-background";
import { MachineThinking } from "@/components/ui/machine-thinking";
import { systemsManifest } from "@/data/systems-manifest";
import { AssetIdentity } from "@/components/dashboard/AssetIdentity";
import UnifiedIntelligenceDashboard from "@/components/dashboard/UnifiedIntelligenceDashboard";

interface PredictionResult {
  rul: number;
  healthIndex: number;
  riskLevel: RiskLevel;
  precursorProb: number;
  confidence: number;
  failureMode: string;
  topSensors: { name: string; weight: number }[];
  action: string;
  driftDetected: boolean;
}

export default function SystemPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Load system profile from manifest
  const systemProfile = systemsManifest[slug || ""] || systemsManifest["wind-turbines"];
  const [sensorValues, setSensorValues] = useState<Record<string, string>>({});

  // Initialize default sensor values
  if (Object.keys(sensorValues).length === 0 && systemProfile) {
    const defaults: Record<string, string> = {};
    systemProfile.sensors.forEach(s => defaults[s.id] = s.defaultValue || "");
    setSensorValues(defaults);
  }

  if (!systemProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-muted-foreground">System profile not found.</p>
      </div>
    );
  }

  const handleRunPrediction = async () => {
    setIsLoading(true);
    // Simulate initial delay for "System Handshake"
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Wait for MachineThinking animation (simulated here, but the component does its own timeline)
    // We navigate AFTER a delay to let the animation play out a bit
    setTimeout(() => {
      const getMockResult = () => {
        if (slug === 'laptops') {
          // Realistic laptop fake prediction as requested
          return {
            rul: 270, // ~9 months in days
            healthIndex: 62,
            riskLevel: "MEDIUM" as RiskLevel,
            precursorProb: 0.71,
            confidence: 0.89,
            failureMode: "Thermal Degradation",
            topSensors: [
              { name: "CPU Temp", weight: 45 },
              { name: "Battery Cycles", weight: 30 },
              { name: "Fan Speed", weight: 25 }
            ],
            action: "Reduce sustained high-load usage and inspect cooling system within 2 weeks",
            driftDetected: true,
          };
        }

        const firstValue = parseFloat(Object.values(sensorValues)[0] || "0");
        const healthIndex = Math.max(0, Math.min(100, 85 - firstValue * 0.1)); // Adjusted multiplier for generic mock
        const riskLevel: RiskLevel =
          healthIndex >= 70 ? "LOW" :
            healthIndex >= 50 ? "MEDIUM" :
              healthIndex >= 30 ? "HIGH" : "CRITICAL";

        return {
          rul: Math.round(healthIndex * 1.2),
          healthIndex: Math.round(healthIndex),
          riskLevel,
          precursorProb: Math.round((100 - healthIndex) / 100 * 100) / 100,
          confidence: 0.87,
          failureMode: healthIndex < 50 ? "Degradation Detected" : "Normal Operation",
          topSensors: systemProfile.sensors.slice(0, 4).map((s, i) => ({
            name: s.label,
            weight: Math.max(10, 40 - i * 8 + Math.random() * 10),
          })),
          action: healthIndex < 50
            ? systemProfile.defaultDecision.action
            : `Continue normal operation. Next scheduled maintenance in ${Math.round(healthIndex / 2)} days.`,
          driftDetected: healthIndex < 40,
        };
      };

      const result = getMockResult();

      setIsLoading(false);
      navigate("/output-preview", {
        state: {
          result,
          inputs: sensorValues,
          systemInfo: {
            id: slug,
            name: systemProfile.title,
          }
        }
      });
    }, 2500); // 2.5s total thinking time
  };

  return (
    <div id={`system-page-${slug}`} className="min-h-screen relative overflow-hidden bg-background">
      <MachineThinking isThinking={isLoading} />

      {/* Light mode gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50 to-purple-100/50 dark:from-black dark:via-black dark:to-black pointer-events-none transition-all duration-500" />

      {/* Background - Purple Currents (highly vibrant in dark, adjusted for light) */}
      <div className="fixed inset-0 z-0 dark:opacity-100 opacity-40 transition-opacity duration-500">
        <NeuralBackground
          color="#9d4edd" // More vibrant purple
          speed={0.5}
          trailOpacity={0.2}
          particleCount={600}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Shifted down to avoid navbar overlap */}
        <div className="pt-32 px-6 sm:px-12 relative">
          <button
            onClick={() => navigate("/systems")}
            className="absolute left-6 sm:left-12 top-32 flex items-center justify-center w-10 h-10 rounded-full bg-card/50 border border-border text-foreground/70 hover:text-foreground hover:bg-card shadow-lg transition-all"
            aria-label="Back to Systems"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex justify-center">
            <AssetIdentity systemName={systemProfile.title} className="items-center text-center" />
          </div>
        </div>

        {/* Centered Input Card */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 pb-20 w-full">

          <div className="w-full max-w-xl">
            <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.05] to-transparent pointer-events-none" />

              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="text-2xl font-semibold text-foreground tracking-tight">System Input</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Configure {systemProfile.title.toLowerCase()} parameters for analysis
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <div className="grid gap-5">
                  {systemProfile.sensors.map((sensor) => (
                    <SensorInput
                      key={sensor.id}
                      id={sensor.id}
                      label={sensor.label}
                      unit={sensor.unit}
                      value={sensorValues[sensor.id] || ""}
                      onChange={(value) =>
                        setSensorValues((prev) => ({ ...prev, [sensor.id]: value }))
                      }
                      placeholder={sensor.placeholder}
                    />
                  ))}
                </div>

                <Button
                  id="runPredictBtn"
                  onClick={handleRunPrediction}
                  disabled={isLoading}
                  className="mt-8 w-full bg-[#8B4BFF] hover:bg-[#7a3ee3] text-white font-semibold h-12 text-lg shadow-[0_0_20px_rgba(139,75,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,75,255,0.3)] hover:-translate-y-0.5 active:scale-98 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Run Health Prediction"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Intelligence Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
              <Zap className="w-3 h-3" />
              <span>System Intelligence Layout</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center">
              Enterprise Dashboard Preview
            </h3>
            <p className="text-muted-foreground text-sm mt-2 text-center max-w-lg">
              Below is the intelligence matrix structure that will be generated for the {systemProfile.title}.
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-md border border-border rounded-[2rem] overflow-hidden shadow-2xl relative">
            <UnifiedIntelligenceDashboard systemId={slug || ""} isPreview={true} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
