/**
 * Centralized Civic Asset Registry
 *
 * Ensures all visual media in the application is strictly 100% relevant to
 * municipal and civic administration governance (road repairs, sanitation,
 * streetlights, water mains, traffic systems, public works).
 */

export interface CivicImagePair {
  before: string;
  after: string;
  label: string;
}

export interface CivicCategoryItem {
  id: string;
  name: string;
  department: string;
  image: string;
  description: string;
}

export const CIVIC_CATEGORY_ITEMS: CivicCategoryItem[] = [
  {
    id: 'pothole',
    name: 'Road & Pothole',
    department: 'Roads & Highways Department',
    image: '/assets/civic/pothole.jpg',
    description: 'Potholes, asphalt cracks, damaged road surfaces, and cave-ins',
  },
  {
    id: 'streetlight',
    name: 'Broken Streetlight',
    department: 'Electrical & Lighting Department',
    image: '/assets/civic/streetlight.jpg',
    description: 'Unlit streetlamps, damaged luminaires, exposed electrical wires',
  },
  {
    id: 'garbage',
    name: 'Garbage & Sanitation',
    department: 'Solid Waste Management',
    image: '/assets/civic/garbage.jpg',
    description: 'Overflowing dustbins, uncollected community waste, litter heaps',
  },
  {
    id: 'water-leakage',
    name: 'Water Supply / Leakage',
    department: 'Water Supply & Sewerage Board',
    image: '/assets/civic/water-leakage.jpg',
    description: 'Burst pipelines, leaking valves, contamination, water loss',
  },
  {
    id: 'drainage',
    name: 'Drainage / Waterlogging',
    department: 'Stormwater & Drainage Division',
    image: '/assets/civic/drainage.jpg',
    description: 'Flooded streets, choked monsoon drains, stagnating rainwater',
  },
  {
    id: 'public-toilet',
    name: 'Public Toilet',
    department: 'Public Health & Sanitation',
    image: '/assets/civic/public-toilet.jpg',
    description: 'Unsanitary public latrines, broken plumbing, lack of water',
  },
  {
    id: 'road-sign',
    name: 'Damaged Traffic / Road Sign',
    department: 'Traffic Engineering Cell',
    image: '/assets/civic/road-sign.jpg',
    description: 'Fallen or vandalized street name boards, missing road signs',
  },
  {
    id: 'illegal-dumping',
    name: 'Illegal Garbage Dumping',
    department: 'Sanitation Enforcement Division',
    image: '/assets/civic/illegal-dumping.jpg',
    description: 'Unauthorized commercial dumping, debris, hazardous waste piles',
  },
  {
    id: 'stray-animals',
    name: 'Stray Animals',
    department: 'Veterinary & Animal Welfare',
    image: '/assets/civic/stray-animals.jpg',
    description: 'Aggressive stray packs, injured cattle or dogs needing rescue',
  },
  {
    id: 'other-civic',
    name: 'Other Civic Issue',
    department: 'Municipal Administration Triage',
    image: '/assets/civic/other-civic.jpg',
    description: 'Open drains, public property defects, general civic grievances',
  },
];

export const CIVIC_ASSETS = {
  heroBanner: '/images/hero-civic-city.svg',
  officialEmblem: '/images/emblem-india.svg',
  categories: {
    pothole: {
      before: '/assets/civic/pothole.jpg',
      after: '/images/pothole-after.svg',
      label: 'Road Paving & Bitumen Hot-Mix',
    },
    garbage: {
      before: '/assets/civic/garbage.jpg',
      after: '/images/garbage-after.svg',
      label: 'Sanitation Waste Clearance & Disinfection',
    },
    streetlight: {
      before: '/assets/civic/streetlight.jpg',
      after: '/images/streetlight-after.svg',
      label: '120W LED Street Luminaire Restoration',
    },
    water_leak: {
      before: '/assets/civic/water-leakage.jpg',
      after: '/images/waterleak-after.svg',
      label: 'Water Main Pipeline Flange Replacement',
    },
    drainage: {
      before: '/assets/civic/drainage.jpg',
      after: '/images/waterleak-after.svg',
      label: 'Monsoon Stormwater Drain Desilting & Pumping',
    },
    public_toilet: {
      before: '/assets/civic/public-toilet.jpg',
      after: '/images/garbage-after.svg',
      label: 'Public Facility Deep Sanitization & Plumbing Fix',
    },
    road_sign: {
      before: '/assets/civic/road-sign.jpg',
      after: '/images/trafficsignal-after.svg',
      label: 'Municipal Signboard & Traffic Indicator Realignment',
    },
    illegal_dumping: {
      before: '/assets/civic/illegal-dumping.jpg',
      after: '/images/garbage-after.svg',
      label: 'Heavy Machine Debris Clearing & Enforcement Action',
    },
    stray_animals: {
      before: '/assets/civic/stray-animals.jpg',
      after: '/images/hero-civic-city.svg',
      label: 'Veterinary Care & Animal Shelter Relocation',
    },
    traffic_signal: {
      before: '/assets/civic/road-sign.jpg',
      after: '/images/trafficsignal-after.svg',
      label: 'Intersection Signal Synchronization',
    },
    sidewalk: {
      before: '/assets/civic/pothole.jpg',
      after: '/images/sidewalk-after.svg',
      label: 'Pedestrian Tactile Paving & Curb Leveling',
    },
    tree_hazard: {
      before: '/assets/civic/other-civic.jpg',
      after: '/images/treehazard-after.svg',
      label: 'Storm Hazard Pruning & Road Clearance',
    },
    graffiti: {
      before: '/assets/civic/other-civic.jpg',
      after: '/images/graffiti-after.svg',
      label: 'Public Property Pressure-Washing & Recoating',
    },
    other: {
      before: '/assets/civic/other-civic.jpg',
      after: '/images/pothole-after.svg',
      label: 'Municipal Infrastructure General Maintenance',
    },
  } as Record<string, CivicImagePair>,
};

export function getCivicBeforeImage(category?: string): string {
  if (!category) return CIVIC_ASSETS.categories.pothole.before;
  const match = CIVIC_ASSETS.categories[category];
  return match ? match.before : CIVIC_ASSETS.categories.other.before;
}

export function getCivicAfterImage(category?: string): string {
  if (!category) return CIVIC_ASSETS.categories.pothole.after;
  const match = CIVIC_ASSETS.categories[category];
  return match ? match.after : CIVIC_ASSETS.categories.other.after;
}
