import { CIVIC_ASSETS } from './civicImages.js';

export interface SampleIssuePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  photoUrl: string;
}

export const SAMPLE_ISSUES: SampleIssuePreset[] = [
  {
    id: 'pothole-sample',
    title: 'Severe Road Pothole',
    category: 'pothole',
    description: 'Deep pothole on the center asphalt lane causing hazardous swerving for two-wheelers and buses.',
    location: '412 West Elm Street, Ward 3',
    photoUrl: '/assets/civic/pothole.jpg',
  },
  {
    id: 'streetlight-sample',
    title: 'Broken Street Light Luminaire',
    category: 'streetlight',
    description: 'Public street light fixture broken and bent with wiring exposed. Junction completely unlit after sunset.',
    location: 'Corner of 5th Ave & Feijenoord Way, Ward 1',
    photoUrl: '/assets/civic/streetlight.jpg',
  },
  {
    id: 'garbage-sample',
    title: 'Sanitation Waste Overflow',
    category: 'garbage',
    description: 'Large community garbage pile overflowing into pedestrian walkway emitting noxious odor near residential homes.',
    location: 'Near Market Square, Ward 7',
    photoUrl: '/assets/civic/garbage.jpg',
  },
  {
    id: 'water-sample',
    title: 'Water Main Pipe Burst',
    category: 'water-leakage',
    description: 'Pressurized water gushing from damaged distribution pipe flange, flooding sidewalk and wasting clean drinking water.',
    location: 'Corner of Oak Boulevard & 12th St, Ward 2',
    photoUrl: '/assets/civic/water-leakage.jpg',
  },
  {
    id: 'drainage-sample',
    title: 'Monsoon Waterlogging & Flooding',
    category: 'drainage',
    description: 'Stormwater drain severely clogged with silt; entire street submerged in 1.5 feet of muddy rainwater.',
    location: 'Tatanagar Main Road, Ward 5',
    photoUrl: '/assets/civic/drainage.jpg',
  },
  {
    id: 'toilet-sample',
    title: 'Damaged Public Latrine',
    category: 'public-toilet',
    description: 'Public community toilet facility with broken door fixtures, no running water supply, and severe hygiene hazard.',
    location: 'Ullalu Slum Colony Community Block, Ward 9',
    photoUrl: '/assets/civic/public-toilet.jpg',
  },
  {
    id: 'road-sign-sample',
    title: 'Damaged Public Road Signboard',
    category: 'road-sign',
    description: 'Official street name signboard is damaged, bent, and unreadable, causing confusion for emergency vehicles.',
    location: 'Mahesh Choudhury Lane Crossroad, Ward 4',
    photoUrl: '/assets/civic/road-sign.jpg',
  },
  {
    id: 'illegal-dumping-sample',
    title: 'Illegal Commercial Garbage Dumping',
    category: 'illegal-dumping',
    description: 'Unauthorized commercial dumping of building rubble and plastic waste on public roadside.',
    location: 'Sector 14 Bypass Link Road, Ward 11',
    photoUrl: '/assets/civic/illegal-dumping.jpg',
  },
  {
    id: 'stray-animals-sample',
    title: 'Injured Stray Animals Requiring Care',
    category: 'stray-animals',
    description: 'Pack of stray street dogs near municipal intersection requiring veterinary health check and care.',
    location: 'Hill Cart Road Junction, Ward 8',
    photoUrl: '/assets/civic/stray-animals.jpg',
  },
  {
    id: 'other-civic-sample',
    title: 'Hazardous Open Hospital Drain',
    category: 'other-civic',
    description: 'Uncovered open municipal drainage ditch near public hospital perimeter posing imminent health and fall hazard.',
    location: 'District Hospital Outer Gate, Ward 6',
    photoUrl: '/assets/civic/other-civic.jpg',
  },
];
