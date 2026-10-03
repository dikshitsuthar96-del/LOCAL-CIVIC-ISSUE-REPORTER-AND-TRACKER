/**
 * Centralized Civic Asset Registry (Server-side)
 */

export const CIVIC_ASSETS = {
  heroBanner: '/images/hero-civic-city.svg',
  officialEmblem: '/images/emblem-india.svg',
  categories: {
    pothole: {
      before: '/images/pothole-before.svg',
      after: '/images/pothole-after.svg',
      label: 'Road Paving & Bitumen Hot-Mix',
    },
    garbage: {
      before: '/images/garbage-before.svg',
      after: '/images/garbage-after.svg',
      label: 'Sanitation Waste Clearance & Disinfection',
    },
    streetlight: {
      before: '/images/streetlight-before.svg',
      after: '/images/streetlight-after.svg',
      label: '120W LED Street Luminaire Restoration',
    },
    water_leak: {
      before: '/images/waterleak-before.svg',
      after: '/images/waterleak-after.svg',
      label: 'Water Main Pipeline Flange Replacement',
    },
    traffic_signal: {
      before: '/images/trafficsignal-before.svg',
      after: '/images/trafficsignal-after.svg',
      label: 'Intersection Signal Synchronization',
    },
    sidewalk: {
      before: '/images/sidewalk-before.svg',
      after: '/images/sidewalk-after.svg',
      label: 'Pedestrian Tactile Paving & Curb Leveling',
    },
    tree_hazard: {
      before: '/images/treehazard-before.svg',
      after: '/images/treehazard-after.svg',
      label: 'Storm Hazard Pruning & Road Clearance',
    },
    graffiti: {
      before: '/images/graffiti-before.svg',
      after: '/images/graffiti-after.svg',
      label: 'Public Property Pressure-Washing & Recoating',
    },
    other: {
      before: '/images/pothole-before.svg',
      after: '/images/pothole-after.svg',
      label: 'Municipal Infrastructure General Maintenance',
    },
  } as Record<string, { before: string; after: string; label: string }>,
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
