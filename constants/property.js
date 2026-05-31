import {
  Home,
  Briefcase,
  Layers,
  TreePine,
  Building2,
  Factory,
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "residential",
    label: "Residential",
    icon: Home,
    types: [
      "1RK / Studio",
      "1 BHK",
      "1.5 BHK",
      "2 BHK",
      "2.5 BHK",
      "3 BHK",
      "3.5 BHK",
      "4 BHK",
      "5 BHK",
      "Penthouse",
      "Duplex",
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: Briefcase,
    types: [
      "Office Space",
      "Shop / Retail",
      "Showroom",
      "Warehouse / Godown",
      "F&B Space",
      "Co-working Space",
    ],
  },
  {
    id: "plots",
    label: "Plots",
    icon: Layers,
    types: [
      "Agricultural Plot",
      "Residential Plot (Pakka)",
      "Residential Plot (Kacha)",
      "Gated Community Plot",
      "SCO Plot",
      "Industrial Plot",
    ],
  },
  {
    id: "farmland",
    label: "Farmland & Plantations",
    icon: TreePine,
    types: [
      "Orchard",
      "Tea Farm",
      "Coffee Farm",
      "Mango Farm",
      "Coconut Farm",
      "Rubber Farm",
      "Banana Farm",
      "Cashew Farm",
      "Apple Farm",
      "Aqua Industry (Fish)",
      "Aqua Industry (Prawns)",
    ],
  },
  {
    id: "built",
    label: "Built Properties",
    icon: Building2,
    types: [
      "Villa",
      "Bungalow",
      "Rowhouse",
      "Townhouse",
      "Apartment Building",
      "Independent House",
    ],
  },
  {
    id: "industrial",
    label: "Industrial Plots",
    icon: Factory,
    types: [
      "Light Industrial",
      "Heavy Industrial",
      "Electronics Cluster",
      "Defence Cluster",
      "Logistics & Warehousing",
      "Govt Park",
      "Private Industrial Park",
    ],
  },
];

export const CITIES = [
  "Gurgaon",
  "Noida",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Delhi",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Lucknow",
];

export const BANKS = [
  "SBI",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Punjab National Bank",
  "LIC Housing Finance",
  "Bajaj Housing Finance",
  "Other",
];

export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Farmhouse",
  "Plot",
];

export const USE_OPTIONS = [
  "Self-staying",
  "Rented",
  "Vacant",
  "Investment Portfolio",
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const YEARS = Array.from({ length: 12 }, (_, i) =>
  (new Date().getFullYear() + i).toString(),
);

export const YEARS_PAST = Array.from({ length: 20 }, (_, i) =>
  (new Date().getFullYear() - i).toString(),
);

export const YEARS_FUTURE = Array.from({ length: 10 }, (_, i) =>
  (new Date().getFullYear() + i).toString(),
);
