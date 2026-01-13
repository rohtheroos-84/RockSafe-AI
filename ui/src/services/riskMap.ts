import { create } from 'zustand';

export interface RiskZone {
  id: string;
  name: string;
  risk: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
  probability: number;
  lastIncident: string;
  sensors: number;
}

interface RiskMapState {
  zones: RiskZone[];
  updateZoneRisk: (locationId: string, risk: "low" | "medium" | "high" | "critical", probability: number) => void;
  getZoneById: (id: string) => RiskZone | undefined;
}

// Initial zones data
const initialZones: RiskZone[] = [
  { 
    id: "jharia_main", 
    name: "Jharia Main Pit", 
    risk: "critical", 
    x: 20, 
    y: 30,
    probability: 92,
    lastIncident: "6 hours ago",
    sensors: 24
  },
  { 
    id: "panaji_west", 
    name: "Panaji West Block", 
    risk: "medium", 
    x: 70, 
    y: 25,
    probability: 45,
    lastIncident: "12 days ago",
    sensors: 18
  },
  { 
    id: "bellary_central", 
    name: "Bellary Central Zone", 
    risk: "high", 
    x: 45, 
    y: 80,
    probability: 78,
    lastIncident: "3 days ago",
    sensors: 20
  },
  { 
    id: "dhanbad_north", 
    name: "Dhanbad North Face", 
    risk: "low", 
    x: 15, 
    y: 60,
    probability: 15,
    lastIncident: "45 days ago",
    sensors: 16
  },
  { 
    id: "raipur_east", 
    name: "Raipur East Quarry", 
    risk: "low", 
    x: 50, 
    y: 45,
    probability: 22,
    lastIncident: "67 days ago",
    sensors: 14
  },
  { 
    id: "nagpur_south", 
    name: "Nagpur South Pit", 
    risk: "high", 
    x: 85, 
    y: 65,
    probability: 82,
    lastIncident: "2 days ago",
    sensors: 22
  },
  { 
    id: "chandrapur_main", 
    name: "Chandrapur Main Block", 
    risk: "medium", 
    x: 35, 
    y: 75,
    probability: 48,
    lastIncident: "15 days ago",
    sensors: 19
  },
  { 
    id: "singrauli_west", 
    name: "Singrauli West Zone", 
    risk: "critical", 
    x: 60, 
    y: 20,
    probability: 95,
    lastIncident: "4 hours ago",
    sensors: 26
  },
  { 
    id: "talcher_north", 
    name: "Talcher North Block", 
    risk: "medium", 
    x: 25, 
    y: 40,
    probability: 52,
    lastIncident: "10 days ago",
    sensors: 17
  },
  { 
    id: "korba_central", 
    name: "Korba Central Pit", 
    risk: "high", 
    x: 75, 
    y: 55,
    probability: 75,
    lastIncident: "5 days ago",
    sensors: 21
  }
];

// Create the store
export const useRiskMapStore = create<RiskMapState>((set, get) => ({
  zones: initialZones,
  updateZoneRisk: (locationId, risk, probability) => set((state) => ({
    zones: state.zones.map((zone) =>
      zone.id === locationId
        ? { 
            ...zone, 
            risk, 
            probability,
            lastIncident: "Just now"
          }
        : zone
    ),
  })),
  getZoneById: (id) => get().zones.find(zone => zone.id === id),
}));