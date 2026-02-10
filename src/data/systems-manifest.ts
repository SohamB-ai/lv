import { LucideIcon, Zap, Wind, Cog, Battery, Ruler, Activity, Server, Droplets, Workflow, Microscope, Laptop } from "lucide-react";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SensorConfig {
    id: string;
    label: string;
    unit: string;
    placeholder: string;
    defaultValue?: string;
}

export interface CognitiveEvent {
    time: string;
    description: string;
    type: "normal" | "warning" | "critical" | "inference";
    details?: string;
}

export interface DegradationDriver {
    factor: string;
    direction: "up" | "down" | "stable";
    impact: "strong" | "moderate" | "neutral";
}

export interface DecisionConfig {
    action: string;
    why: string[];
    consequences: {
        text: string;
        impact: string;
    }[];
}

export interface SystemProfile {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
    location: string;
    digitalIdentity: {
        age: string;
        regime: string;
        model: string;
        lastMaintenance: string;
    };
    sensors: SensorConfig[];
    cognitiveTimeline: CognitiveEvent[];
    degradationDrivers: DegradationDriver[];
    precursor: {
        probability: number;
        status: "Detected" | "Not Detected";
        explanation: string;
    };
    dataDrift: {
        detected: boolean;
        severity: "Low" | "Medium" | "High";
        explanation: string;
    };
    failureCluster: {
        id: string;
        label: string;
        description: string;
    };
    economics: {
        potentialCost: string;
        downtimeCost: string;
    };
    defaultDecision: DecisionConfig;
}

export const systemsManifest: Record<string, SystemProfile> = {
    "power-transformers": {
        id: "power-transformers",
        title: "Power Transformer",
        icon: Zap,
        description: "Critical Grid Infrastructure",
        location: "Substation Alpha-7, Detroit",
        digitalIdentity: {
            age: "14.2 Years",
            regime: "Base Load (Continuous)",
            model: "Tx-Net-v4.2 (DGA)",
            lastMaintenance: "3 Months Ago"
        },
        sensors: [
            { id: "oilTemp", label: "Oil Temperature", unit: "°C", placeholder: "20-100", defaultValue: "85" },
            { id: "windingTemp", label: "Winding Temperature", unit: "°C", placeholder: "40-130", defaultValue: "92" },
            { id: "loadCurrent", label: "Load Current", unit: "A", placeholder: "0-2000", defaultValue: "1450" },
            { id: "hydrogen", label: "Hydrogen Gas", unit: "ppm", placeholder: "0-1000", defaultValue: "120" },
            { id: "partialDischarge", label: "Partial Discharge", unit: "pC", placeholder: "0-500", defaultValue: "45" },
        ],
        cognitiveTimeline: [
            { time: "-2h 15m", description: "Gas generation slope increased", type: "warning", details: "Rate: +18%" },
            { time: "-45m", description: "Thermal margin reduced below safe envelope", type: "inference", details: "Margin: < 5°C" },
            { time: "-12m", description: "Failure cluster shift", type: "critical", details: "Normal → Insulation Degradation" },
            { time: "Now", description: "RUL revised due to accelerated gas evolution", type: "inference", details: "-420 Cycles" },
        ],
        degradationDrivers: [
            { factor: "Hydrogen Gas", direction: "up", impact: "strong" },
            { factor: "Winding Temp", direction: "up", impact: "moderate" },
            { factor: "Partial Discharge", direction: "up", impact: "strong" },
            { factor: "Load Current", direction: "stable", impact: "neutral" },
        ],
        precursor: {
            probability: 0.82,
            status: "Detected",
            explanation: "High-frequency gas evolution pattern matches early-stage insulation failure."
        },
        dataDrift: {
            detected: true,
            severity: "Medium",
            explanation: "Input load distributions have shifted 15% from training baseline."
        },
        failureCluster: {
            id: "CL-992",
            label: "Dielectric Breakdown",
            description: "Similar to 2022 failure in Ohio unit."
        },
        economics: {
            potentialCost: "$450,000",
            downtimeCost: "$42,000 / hr"
        },
        defaultDecision: {
            action: "Schedule Oil Analysis & Load Reduction",
            why: [
                "Hydrogen gas generation > 100ppm/day",
                "Insulation life impact: -14%",
                "Confirmed thermal stress pattern"
            ],
            consequences: [
                { text: "Catastrophic Dielectric Failure Probability", impact: "42%" },
                { text: "Est. Replacement Cost", impact: "$2.4M" }
            ]
        }
    },
    "wind-turbines": {
        id: "wind-turbines",
        title: "Wind Turbine",
        icon: Wind,
        description: "Renewable Energy Unit",
        location: "Offshore Block B, North Sea",
        digitalIdentity: {
            age: "6.5 Years",
            regime: "Variable (High Wind)",
            model: "Aero-Dyn-v9 (Vib)",
            lastMaintenance: "6 Months Ago"
        },
        sensors: [
            { id: "gearboxVib", label: "Gearbox Vibration", unit: "Hz", placeholder: "0-50", defaultValue: "28" },
            { id: "rotorSpeed", label: "Rotor Speed", unit: "RPM", placeholder: "0-20", defaultValue: "14" },
            { id: "genTemp", label: "Generator Temperature", unit: "°C", placeholder: "20-120", defaultValue: "98" },
            { id: "acoustic", label: "Acoustic Emission", unit: "dB", placeholder: "0-100", defaultValue: "72" }
        ],
        cognitiveTimeline: [
            { time: "-4h 30m", description: "Vibration spectral shift detected", type: "inference", details: "Harmonic: 3x" },
            { time: "-1h 20m", description: "Acoustic Forsee Probability crossed 0.7", type: "warning", details: "Threshold: 0.65" },
            { time: "-10m", description: "Failure cluster: Healthy → Gearbox Bearing Wear", type: "critical", details: "Confidence: 92%" }
        ],
        degradationDrivers: [
            { factor: "Gearbox Vibration", direction: "up", impact: "strong" },
            { factor: "Acoustic Emission", direction: "up", impact: "strong" },
            { factor: "Generator Temp", direction: "up", impact: "moderate" }
        ],
        precursor: {
            probability: 0.74,
            status: "Detected",
            explanation: "Harmonic vibration levels are tracking gearbox fatigue signatures."
        },
        dataDrift: {
            detected: false,
            severity: "Low",
            explanation: "Model inputs remain within training bounds."
        },
        failureCluster: {
            id: "CL-441",
            label: "Gearbox Bearing Wear",
            description: "Signature matches G-Series fatigue patterns."
        },
        economics: {
            potentialCost: "$120,000",
            downtimeCost: "$1,500 / hr"
        },
        defaultDecision: {
            action: "Schedule Bearing Replacement Window",
            why: [
                "Vibration RMS > ISO limit",
                "Acoustic signature matches 'Inner Race Defect'",
                "RUL < 30 days"
            ],
            consequences: [
                { text: "Gearbox Seizure Risk", impact: "High" },
                { text: "Crane Deployment Cost", impact: "+$45k" }
            ]
        }
    },
    "industrial-motors": {
        id: "industrial-motors",
        title: "Industrial Motor",
        icon: Cog,
        description: "HVAC & Manufacturing Driver",
        location: "Assembly Line 4, Factory 12",
        digitalIdentity: {
            age: "3.1 Years",
            regime: "Cyclic Start/Stop",
            model: "Induct-X-v2",
            lastMaintenance: "1 Month Ago"
        },
        sensors: [
            { id: "vibration", label: "Vibration", unit: "mm/s", placeholder: "0-25", defaultValue: "8" },
            { id: "statorCurrent", label: "Stator Current", unit: "A", placeholder: "0-500", defaultValue: "320" },
            { id: "temperature", label: "Motor Temperature", unit: "°C", placeholder: "20-100", defaultValue: "78" },
            { id: "rpm", label: "RPM", unit: "rpm", placeholder: "0-3600", defaultValue: "1750" }
        ],
        cognitiveTimeline: [
            { time: "-5h", description: "Power factor drift detected", type: "inference", details: "Delta: 0.05" },
            { time: "-2h", description: "Vibration RMS slope increased", type: "warning", details: "Slope: +5%/hr" },
            { time: "Now", description: "Failure cluster: Normal → Bearing Inner Race Wear", type: "critical", details: "Simulated" }
        ],
        degradationDrivers: [
            { factor: "Vibration", direction: "up", impact: "strong" },
            { factor: "Motor Temp", direction: "up", impact: "moderate" },
            { factor: "Stator Current", direction: "up", impact: "moderate" }
        ],
        precursor: {
            probability: 0.65,
            status: "Detected",
            explanation: "Vibration envelope acceleration suggests bearing inner race wear."
        },
        dataDrift: {
            detected: true,
            severity: "Low",
            explanation: "Slight drift in power factor correlations."
        },
        failureCluster: {
            id: "CL-102",
            label: "Inner Race Wear",
            description: "Consistent with high-duty cycle motors."
        },
        economics: {
            potentialCost: "$15,000",
            downtimeCost: "$5,000 / hr (Line Stop)"
        },
        defaultDecision: {
            action: "Inspect Bearings & Lubrication",
            why: [
                "Vibration envelope high in 2kHz band",
                " Motor temperature rise correlates with load",
                "Forsee Probability > 60%"
            ],
            consequences: [
                { text: "Catastrophic Seizure Probability", impact: "35%" },
                { text: "Production Halt Risk", impact: "Critical" }
            ]
        }
    },
    "icu-monitoring": {
        id: "icu-monitoring",
        title: "ICU Patient Monitor",
        icon: Activity,
        description: "Critical Care Telemetry",
        location: "Unit 4, Mercy Hospital",
        digitalIdentity: {
            age: "N/A",
            regime: "Triage: Critical",
            model: "Bio-Sense-AI-v1",
            lastMaintenance: "Daily Calib"
        },
        sensors: [
            { id: "ecg", label: "ECG Variability", unit: "ms", placeholder: "0-100", defaultValue: "45" },
            { id: "spo2", label: "SpO2", unit: "%", placeholder: "70-100", defaultValue: "94" },
            { id: "hr", label: "Heart Rate", unit: "bpm", placeholder: "40-200", defaultValue: "112" },
            { id: "resp", label: "Respiration Rate", unit: "bpm", placeholder: "10-40", defaultValue: "28" }
        ],
        cognitiveTimeline: [
            { time: "-15m", description: "Heart rate variability decreased", type: "warning", details: "Signs of stress" },
            { time: "-8m", description: "Oxygen saturation trend worsening", type: "critical", details: "Slope -2%" },
            { time: "-2m", description: "Failure cluster: Stable → Respiratory Risk", type: "critical", details: "Code Blue Risk" }
        ],
        degradationDrivers: [
            { factor: "SpO2", direction: "down", impact: "strong" },
            { factor: "Respiration Rate", direction: "up", impact: "moderate" },
            { factor: "ECG Variability", direction: "down", impact: "strong" }
        ],
        precursor: {
            probability: 0.88,
            status: "Detected",
            explanation: "Sepsis onset pattern identified via cardiac-respiratory decoupling."
        },
        dataDrift: {
            detected: false,
            severity: "Low",
            explanation: "Clinical baseline stable."
        },
        failureCluster: {
            id: "CL-BIO",
            label: "Respiratory Failure",
            description: "Matches acute decompensation cluster."
        },
        economics: {
            potentialCost: "Patient Safety Incident",
            downtimeCost: "Critical Life Risk"
        },
        defaultDecision: {
            action: "Escalate Monitoring / Clinical Intervention",
            why: [
                "Respiratory decompensation pattern detected",
                "SpO2/HR decoupling",
                "Sepsis Forsee Probability > 0.8"
            ],
            consequences: [
                { text: "Acute Event Probability", impact: "High" },
                { text: "Response Window", impact: "< 10 min" }
            ]
        }
    },
    "servers": {
        id: "servers",
        title: "Data Center Server",
        icon: Server,
        description: "High-Performance Compute Node",
        location: "Rack 42, Data Center East",
        digitalIdentity: {
            age: "1.5 Years",
            regime: "Peak Load",
            model: "Blade-X9",
            lastMaintenance: "2 Weeks Ago"
        },
        sensors: [
            { id: "cpuTemp", label: "CPU Temperature", unit: "°C", placeholder: "20-100", defaultValue: "88" },
            { id: "gpuTemp", label: "GPU Temperature", unit: "°C", placeholder: "20-100", defaultValue: "92" },
            { id: "fanSpeed", label: "Fan Speed", unit: "RPM", placeholder: "0-10000", defaultValue: "8500" },
            { id: "power", label: "Power Draw", unit: "W", placeholder: "0-2000", defaultValue: "1200" }
        ],
        cognitiveTimeline: [
            { time: "-1h", description: "Cooling efficiency dropped", type: "warning", details: "Delta T decreased" },
            { time: "-30m", description: "Thermal headroom reduced", type: "inference", details: "< 5% margin" },
            { time: "Now", description: "Failure probability increased under peak load", type: "critical", details: "Throttling imminent" }
        ],
        degradationDrivers: [
            { factor: "CPU Temp", direction: "up", impact: "strong" },
            { factor: "Fan Speed", direction: "up", impact: "moderate" },
            { factor: "Power Draw", direction: "up", impact: "moderate" }
        ],
        precursor: {
            probability: 0.68,
            status: "Detected",
            explanation: "Cooling saturation curve approaching critical thermal limit."
        },
        dataDrift: {
            detected: true,
            severity: "High",
            explanation: "Workload distribution has shifted significantly from model training."
        },
        failureCluster: {
            id: "CL-SRV",
            label: "Thermal Shutdown",
            description: "Matches peak-load overheating events."
        },
        economics: {
            potentialCost: "$12,000 (Hardware)",
            downtimeCost: "$80,000 / hr (SLA Breach)"
        },
        defaultDecision: {
            action: "Redistribute Load & Schedule Cooling Maintenance",
            why: [
                "Junction temp nearing T-max",
                "Fan duty cycle at 100%",
                "Efficiency curve degrading"
            ],
            consequences: [
                { text: "Thermal Shutdown Probability", impact: "65%" },
                { text: "Service Degradation", impact: "Likely" }
            ]
        }
    },
    "laptops": {
        id: "laptops",
        title: "Laptop Health & Intelligence",
        icon: Laptop,
        description: "Enterprise Computing Device",
        location: "Mobile / Remote Unit",
        digitalIdentity: {
            age: "1.2 Years",
            regime: "Developer Workload",
            model: "ThinkPad-X1-Carbon-G10",
            lastMaintenance: "3 Months Ago"
        },
        sensors: [
            { id: "cpu_temperature", label: "CPU Temperature", unit: "°C", placeholder: "30-100", defaultValue: "78" },
            { id: "battery_health", label: "Battery Health", unit: "%", placeholder: "0-100", defaultValue: "86" },
            { id: "fan_speed", label: "Fan Speed", unit: "RPM", placeholder: "0-6000", defaultValue: "5200" },
            { id: "cpu_usage", label: "CPU Usage", unit: "%", placeholder: "0-100", defaultValue: "82" },
            { id: "ram_usage", label: "RAM Usage", unit: "%", placeholder: "0-100", defaultValue: "68" }
        ],
        cognitiveTimeline: [
            { time: "-45m", description: "Thermal throttling detected", type: "warning", details: "CPU > 95°C" },
            { time: "-20m", description: "Battery discharge rate abnormal", type: "inference", details: "-15% in 15m" },
            { time: "Now", description: "Sustained high load risk", type: "critical", details: "Projected shutdown in 20m" }
        ],
        degradationDrivers: [
            { factor: "CPU Temperature", direction: "up", impact: "strong" },
            { factor: "Battery Cycles", direction: "up", impact: "moderate" },
            { factor: "Fan Efficiency", direction: "down", impact: "strong" }
        ],
        precursor: {
            probability: 0.72,
            status: "Detected",
            explanation: "Thermal throttling duration exceeding safety envelope."
        },
        dataDrift: {
            detected: false,
            severity: "Low",
            explanation: "Baseline usage within normal bounds."
        },
        failureCluster: {
            id: "CL-LT-1",
            label: "Thermal Throttling",
            description: "Matches dust-accumulation profiles."
        },
        economics: {
            potentialCost: "$2,500 (Replacement)",
            downtimeCost: "$150 / hr (Productivity)"
        },
        defaultDecision: {
            action: "Cooling System Maintenance",
            why: [
                "Dust accumulation likely",
                "Thermal paste degradation suspect",
                "Airflow obstruction detected"
            ],
            consequences: [
                { text: "Hardware Failure Risk", impact: "High" },
                { text: "Performance Throttling", impact: "Severe" }
            ]
        }
    },
    // Add placeholders for remaining systems to keep the file manageable but extensible
    "bridges": {
        id: "bridges",
        title: "Suspension Bridge",
        icon: Workflow,
        description: "Strategic Transport Link",
        location: "Golden Gate Bridge, SF",
        digitalIdentity: { age: "42 Years", regime: "Heavy Traffic", model: "Civil-Struct-v1", lastMaintenance: "1 Year Ago" },
        sensors: [{ id: "strain", label: "Strain", unit: "µE", placeholder: "0-1000", defaultValue: "450" }, { id: "crack", label: "Crack Width", unit: "mm", placeholder: "0-5", defaultValue: "1.2" }],
        cognitiveTimeline: [{ time: "Now", description: "Crack growth acceleration", type: "warning" }],
        degradationDrivers: [{ factor: "Strain", direction: "up", impact: "strong" }],
        precursor: { probability: 0.45, status: "Not Detected", explanation: "No immediate fatigue precursors detected." },
        dataDrift: { detected: false, severity: "Low", explanation: "Environmental baseline stable." },
        failureCluster: { id: "CL-CIV", label: "Fatigue Crack", description: "Matches 2018 structural drift." },
        economics: { potentialCost: "Structural Integrity", downtimeCost: "Strategic Blockage" },
        defaultDecision: { action: "Structural Inspection & Load Restriction", why: ["Fatigue capability check failed"], consequences: [{ text: "Safety Factor", impact: "Reduced" }] }
    },
    "cnc-machines": {
        id: "cnc-machines",
        title: "CNC Machining Center",
        icon: Cog,
        description: "Precision Manufacturing",
        location: "Factory Floor 2, Ohio",
        digitalIdentity: { age: "4 Years", regime: "24/7 Ops", model: "Precision-X", lastMaintenance: "2 Weeks Ago" },
        sensors: [{ id: "spindleVib", label: "Spindle Vib", unit: "mm/s", placeholder: "0-10", defaultValue: "4.5" }, { id: "toolWear", label: "Tool Wear", unit: "%", placeholder: "0-100", defaultValue: "85" }],
        cognitiveTimeline: [{ time: "Now", description: "Tool wear acceleration", type: "warning" }],
        degradationDrivers: [{ factor: "Tool Wear", direction: "up", impact: "strong" }],
        precursor: { probability: 0.89, status: "Detected", explanation: "Acoustic emission spikes match tool breakage precursors." },
        dataDrift: { detected: true, severity: "Medium", explanation: "Material hardness variance detected." },
        failureCluster: { id: "CL-CNC", label: "Tool Breakage", description: "Matches high-feed rate failures." },
        economics: { potentialCost: "$2,000 (Tool)", downtimeCost: "Scrap Batch Risk" },
        defaultDecision: { action: "Schedule Tool Change", why: ["Surface finish risk"], consequences: [{ text: "Quality Rejection", impact: "High" }] }
    },
    "hvac-systems": { // Mapped to Pipelines conceptually or kept separate
        id: "hvac-systems",
        title: "HVAC System",
        icon: Wind,
        description: "Building Climate Control",
        location: "Tower HQ, New York",
        digitalIdentity: { age: "8 Years", regime: "Cyclic", model: "Cool-Master", lastMaintenance: "4 Months Ago" },
        sensors: [{ id: "pressure", label: "Compressor Pressure", unit: "PSI", placeholder: "0-500", defaultValue: "420" }],
        cognitiveTimeline: [{ time: "Now", description: "Efficiency drop detected", type: "warning" }],
        degradationDrivers: [{ factor: "Pressure", direction: "up", impact: "moderate" }],
        precursor: { probability: 0.55, status: "Detected", explanation: "Pressure oscillations suggest refrigerant leak onset." },
        dataDrift: { detected: false, severity: "Low", explanation: "Weather patterns within expected regime." },
        failureCluster: { id: "CL-HVAC", label: "Compressor Stall", description: "Matches low-refrigerant profiles." },
        economics: { potentialCost: "$8,000", downtimeCost: "Comfort / Compliance" },
        defaultDecision: { action: "Filter & Coil Cleaning", why: ["Delta-T reduced"], consequences: [{ text: "Energy Cost", impact: "+15%" }] }
    },
    "pipelines": { // Explicitly adding pipelines even if route might not exist, for completeness
        id: "pipelines",
        title: "Oil & Gas Pipeline",
        icon: Droplets,
        description: "Critical Transport Infrastructure",
        location: "Kirkuk-Ceyhan Sector 4",
        digitalIdentity: { age: "22 Years", regime: "Continuous Flow", model: "Pipe-Net-v3", lastMaintenance: "6 Months Ago" },
        sensors: [{ id: "pressure", label: "Pressure", unit: "PSI", placeholder: "0-1000", defaultValue: "850" }, { id: "acoustic", label: "Acoustic Leak", unit: "dB", placeholder: "0-100", defaultValue: "20" }],
        cognitiveTimeline: [{ time: "Now", description: "Acoustic anomaly detected", type: "critical" }],
        degradationDrivers: [{ factor: "Pressure Drop", direction: "down", impact: "strong" }],
        precursor: { probability: 0.94, status: "Detected", explanation: "Transient pressure waves match pinhole leak acoustic profile." },
        dataDrift: { detected: false, severity: "Low", explanation: "Crude viscosity stable." },
        failureCluster: { id: "CL-PIPE", label: "Micro-Leak", description: "Matches corrosion-pitting patterns." },
        economics: { potentialCost: "Environmental Spill", downtimeCost: "$150,000 / hr" },
        defaultDecision: { action: "Emergency Valve Shutoff & Inspection", why: ["Leak probability > 99%"], consequences: [{ text: "Spill Volume", impact: "Escalating" }] }
    },
    "semiconductor-tools": {
        id: "semiconductor-tools",
        title: "Lithography Scanner",
        icon: Microscope,
        description: "Nanofabrication Tool",
        location: "Cleanroom 1, Hsinchu",
        digitalIdentity: { age: "2 Years", regime: "High Precision", model: "Nano-Lith-X", lastMaintenance: "1 Week Ago" },
        sensors: [{ id: "alignment", label: "Alignment Error", unit: "nm", placeholder: "0-20", defaultValue: "8" }, { id: "stageVib", label: "Stage Vib", unit: "nm", placeholder: "0-10", defaultValue: "3" }],
        cognitiveTimeline: [{ time: "Now", description: "Alignment drift detect", type: "warning" }],
        degradationDrivers: [{ factor: "Alignment Error", direction: "up", impact: "strong" }],
        precursor: { probability: 0.42, status: "Not Detected", explanation: "Optical alignment drift within control limits." },
        dataDrift: { detected: true, severity: "Low", explanation: "Slight photoresist chemical variance." },
        failureCluster: { id: "CL-SEMI", label: "Optics Drift", description: "Matches normal wear trajectory." },
        economics: { potentialCost: "$500,000 (Yield)", downtimeCost: "$20,000 / hr" },
        defaultDecision: { action: "Recalibration & Optics Cleaning", why: ["Yield impact risk"], consequences: [{ text: "Wafer Scrap", impact: "High" }] }
    }
};

// Start logic for systems not explicitly in nav but required by manifest
// Ensure navigation/routing handles these if they are selectable
