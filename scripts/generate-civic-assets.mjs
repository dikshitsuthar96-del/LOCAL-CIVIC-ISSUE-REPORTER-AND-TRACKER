import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. OFFICIAL STATE EMBLEM OF INDIA (Ashoka Lion Capital & Seal)
// -------------------------------------------------------------
const emblemIndia = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="emblemBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f2b48" />
      <stop offset="100%" stop-color="#061626" />
    </radialGradient>
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6d365" />
      <stop offset="50%" stop-color="#fda085" />
      <stop offset="100%" stop-color="#d4af37" />
    </linearGradient>
    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffe28a" />
      <stop offset="100%" stop-color="#b8860b" />
    </linearGradient>
  </defs>

  <!-- Outer Circular Gold Seal -->
  <circle cx="200" cy="200" r="190" fill="url(#emblemBg)" stroke="url(#goldRim)" stroke-width="8" />
  <circle cx="200" cy="200" r="176" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="4,4" />

  <!-- Circular Arch Text: GOVT OF INDIA • CPGRAMS CIVIC GRIEVANCE REDRESSAL -->
  <path id="textCircle" d="M 45,200 A 155,155 0 1,1 355,200" fill="none" />
  <text fill="#ffe28a" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="2.5">
    <textPath href="#textCircle" startOffset="50%" text-anchor="middle">
      GOVERNMENT OF INDIA • PUBLIC GRIEVANCE PORTAL
    </textPath>
  </text>

  <!-- Central Ashoka Lion Capital Vector Silhouette -->
  <g transform="translate(130, 70) scale(1.4)" fill="url(#goldAccent)">
    <!-- Central Lion Head -->
    <path d="M 50,15 C 40,15 35,28 35,42 C 35,52 42,60 50,65 C 58,60 65,52 65,42 C 65,28 60,15 50,15 Z" />
    <!-- Left Lion Head -->
    <path d="M 28,26 C 20,26 15,35 15,48 C 15,56 22,62 30,65 C 33,56 34,44 32,32 Z" />
    <!-- Right Lion Head -->
    <path d="M 72,26 C 80,26 85,35 85,48 C 85,56 78,62 70,65 C 67,56 66,44 68,32 Z" />
    <!-- Lion Manes & Facial Details -->
    <circle cx="44" cy="38" r="2.5" fill="#0b2239" />
    <circle cx="56" cy="38" r="2.5" fill="#0b2239" />
    <polygon points="50,42 46,47 54,47" fill="#0b2239" />
    <path d="M 45,52 Q 50,56 55,52" stroke="#0b2239" stroke-width="2" fill="none" />

    <!-- Abacus Base -->
    <rect x="18" y="66" width="64" height="12" rx="2" fill="url(#goldRim)" />
    
    <!-- Dharma Chakra in Abacus -->
    <circle cx="50" cy="72" r="5" fill="none" stroke="#0b2239" stroke-width="1.5" />
    <line x1="50" y1="67" x2="50" y2="77" stroke="#0b2239" stroke-width="1" />
    <line x1="45" y1="72" x2="55" y2="72" stroke="#0b2239" stroke-width="1" />

    <!-- Bull & Horse reliefs -->
    <ellipse cx="32" cy="72" rx="4" ry="2.5" fill="#0b2239" />
    <ellipse cx="68" cy="72" rx="4" ry="2.5" fill="#0b2239" />

    <!-- Bell-shaped Inverted Lotus Base -->
    <path d="M 24,80 C 30,95 70,95 76,80 Z" fill="url(#goldRim)" />
    <rect x="20" y="93" width="60" height="4" rx="1" fill="#d4af37" />
  </g>

  <!-- Devanagari Motto: सत्यमेव जयते -->
  <text x="200" y="270" fill="#ffffff" font-family="'Noto Sans Devanagari', Arial, sans-serif" font-size="19" font-weight="bold" text-anchor="middle" letter-spacing="1">
    सत्यमेव जयते
  </text>
  <text x="200" y="292" fill="#d4af37" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="3">
    SATYAMEVA JAYATE
  </text>

  <!-- Bottom Official Verification Ribbon -->
  <rect x="70" y="322" width="260" height="28" rx="14" fill="#ff9933" stroke="#ffffff" stroke-width="1.5" />
  <text x="200" y="341" fill="#08182b" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="1">
    MUNICIPAL CITIZEN ASSURANCE
  </text>
</svg>`;

// -------------------------------------------------------------
// 2. HERO CIVIC CITY SMART INFRASTRUCTURE BANNER (16:9)
// -------------------------------------------------------------
const heroCivicCity = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#05101e" />
      <stop offset="40%" stop-color="#0a1d36" />
      <stop offset="75%" stop-color="#14345c" />
      <stop offset="100%" stop-color="#244d7e" />
    </linearGradient>
    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e2430" />
      <stop offset="100%" stop-color="#0d1117" />
    </linearGradient>
    <linearGradient id="streetGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 220, 150, 0.4)" />
      <stop offset="100%" stop-color="rgba(255, 220, 150, 0)" />
    </linearGradient>
    <linearGradient id="saffronStripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF9933" />
      <stop offset="100%" stop-color="#e67e17" />
    </linearGradient>
  </defs>

  <!-- Deep Twilight Sky -->
  <rect width="1920" height="1080" fill="url(#skyGrad)" />

  <!-- Stars & Constellations in Upper Sky -->
  <g fill="#ffffff" opacity="0.6">
    <circle cx="150" cy="80" r="1.5" />
    <circle cx="340" cy="140" r="1" />
    <circle cx="560" cy="90" r="2" />
    <circle cx="820" cy="60" r="1.5" />
    <circle cx="1120" cy="120" r="1" />
    <circle cx="1400" cy="70" r="2" />
    <circle cx="1680" cy="110" r="1.5" />
    <circle cx="1820" cy="80" r="1" />
  </g>

  <!-- Distant Mountain / Ridge Silhouette -->
  <path d="M 0,620 Q 350,560 700,610 T 1400,590 T 1920,630 L 1920,720 L 0,720 Z" fill="#091b30" />

  <!-- City Skyline Silhouette: Municipal Secretariat, Towers, Bridges -->
  <g fill="#0e233d">
    <!-- Left Commercial Hub -->
    <rect x="80" y="440" width="90" height="260" />
    <rect x="190" y="480" width="70" height="220" />
    <rect x="280" y="410" width="110" height="290" />
    <!-- Center Left Bridge Towers -->
    <polygon points="420,700 440,380 460,700" />
    <polygon points="490,700 510,380 530,700" />
    <line x1="400" y1="520" x2="550" y2="520" stroke="#163861" stroke-width="4" />
    <!-- Central Municipal Corporation Secretariat Building -->
    <rect x="740" y="320" width="440" height="380" rx="4" fill="#132c4c" />
    <!-- Classical Dome atop Municipal Secretariat -->
    <path d="M 910,320 C 910,240 1010,240 1010,320 Z" fill="#1a3b63" />
    <!-- Ashoka Stambh / Flagpole atop the Municipal Dome -->
    <line x1="960" y1="240" x2="960" y2="160" stroke="#d4af37" stroke-width="4" />
    <!-- Indian National Tricolor Flag waving -->
    <rect x="960" y="160" width="70" height="15" fill="#FF9933" />
    <rect x="960" y="175" width="70" height="15" fill="#FFFFFF" />
    <rect x="960" y="190" width="70" height="15" fill="#138808" />
    <circle cx="995" cy="182" r="5" fill="#000080" />

    <!-- Illuminated Windows in Municipal Secretariat -->
    <g fill="#ffd778" opacity="0.85">
      <rect x="770" y="350" width="20" height="30" rx="2" />
      <rect x="810" y="350" width="20" height="30" rx="2" />
      <rect x="850" y="350" width="20" height="30" rx="2" />
      <rect x="890" y="350" width="20" height="30" rx="2" />
      <rect x="1030" y="350" width="20" height="30" rx="2" />
      <rect x="1070" y="350" width="20" height="30" rx="2" />
      <rect x="1110" y="350" width="20" height="30" rx="2" />
      <rect x="1150" y="350" width="20" height="30" rx="2" />
      <!-- Middle Row -->
      <rect x="770" y="410" width="20" height="30" rx="2" />
      <rect x="810" y="410" width="20" height="30" rx="2" />
      <rect x="850" y="410" width="20" height="30" rx="2" />
      <rect x="1070" y="410" width="20" height="30" rx="2" />
      <rect x="1110" y="410" width="20" height="30" rx="2" />
      <rect x="1150" y="410" width="20" height="30" rx="2" />
    </g>

    <!-- Right Side Modern Smart City Tech Park -->
    <rect x="1220" y="440" width="80" height="260" />
    <rect x="1320" y="390" width="100" height="310" />
    <rect x="1440" y="470" width="90" height="230" />
    <rect x="1560" y="420" width="130" height="280" />
    <rect x="1710" y="460" width="120" height="240" />
  </g>

  <!-- Translucent Digital Smart-Grid Overlay -->
  <g stroke="rgba(56, 189, 248, 0.15)" stroke-width="1" fill="none">
    <line x1="0" y1="700" x2="1920" y2="700" />
    <line x1="200" y1="500" x2="400" y2="700" />
    <line x1="600" y1="450" x2="800" y2="700" />
    <line x1="1300" y1="450" x2="1100" y2="700" />
    <line x1="1700" y1="500" x2="1500" y2="700" />
    <!-- Node points -->
    <circle cx="400" cy="700" r="4" fill="#38bdf8" />
    <circle cx="800" cy="700" r="4" fill="#38bdf8" />
    <circle cx="1100" cy="700" r="4" fill="#38bdf8" />
    <circle cx="1500" cy="700" r="4" fill="#38bdf8" />
  </g>

  <!-- Foreground: 4-Lane Modern Municipal Avenue & Boulevard -->
  <polygon points="0,1080 1920,1080 1450,700 470,700" fill="url(#roadGrad)" />

  <!-- Road Center Median & Thermoplastic Yellow Markings -->
  <polygon points="950,1080 970,1080 962,700 958,700" fill="#facc15" />
  <!-- White Broken Lane Dividers with Perspective -->
  <polygon points="680,1080 700,1080 740,930 732,930" fill="#ffffff" />
  <polygon points="760,890 774,890 790,820 784,820" fill="#ffffff" />
  <polygon points="805,790 815,790 825,745 820,745" fill="#ffffff" />

  <polygon points="1240,1080 1220,1080 1180,930 1188,930" fill="#ffffff" />
  <polygon points="1160,890 1146,890 1130,820 1136,820" fill="#ffffff" />
  <polygon points="1115,790 1105,790 1095,745 1100,745" fill="#ffffff" />

  <!-- Modern Dual-Arm LED Municipal Streetlight Poles -->
  <!-- Left Streetlight Pole -->
  <g>
    <line x1="380" y1="700" x2="330" y2="460" stroke="#cbd5e1" stroke-width="6" />
    <path d="M 330,460 Q 320,430 360,420" fill="none" stroke="#cbd5e1" stroke-width="5" />
    <ellipse cx="365" cy="422" rx="15" ry="6" fill="#fef08a" />
    <!-- Warm Illumination Beam onto Road -->
    <polygon points="365,425 200,900 580,900" fill="url(#streetGlow)" />
  </g>

  <!-- Right Streetlight Pole -->
  <g>
    <line x1="1540" y1="700" x2="1590" y2="460" stroke="#cbd5e1" stroke-width="6" />
    <path d="M 1590,460 Q 1600,430 1560,420" fill="none" stroke="#cbd5e1" stroke-width="5" />
    <ellipse cx="1555" cy="422" rx="15" ry="6" fill="#fef08a" />
    <!-- Warm Illumination Beam onto Road -->
    <polygon points="1555,425 1340,900 1720,900" fill="url(#streetGlow)" />
  </g>

  <!-- Bottom National Pride Accent Strip -->
  <rect x="0" y="1068" width="1920" height="12" fill="url(#saffronStripe)" />
</svg>`;

// -------------------------------------------------------------
// 3. POTHOLE BEFORE: REAL HAZARDOUS CRACKED ASPHALT ROAD (4:3)
// -------------------------------------------------------------
const potholeBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="holeDepth" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0a0a0c" />
      <stop offset="60%" stop-color="#16181d" />
      <stop offset="90%" stop-color="#2a2e38" />
      <stop offset="100%" stop-color="#3d4350" />
    </radialGradient>
    <pattern id="asphaltGrain" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#353b47" />
      <circle cx="5" cy="12" r="1.5" fill="#252a33" />
      <circle cx="18" cy="8" r="1" fill="#4f5666" />
      <circle cx="28" cy="24" r="2" fill="#20242c" />
      <circle cx="12" cy="32" r="1.5" fill="#464d5c" />
      <circle cx="34" cy="16" r="1" fill="#1c2028" />
    </pattern>
  </defs>

  <!-- Background: Asphalt Road Surface -->
  <rect width="800" height="600" fill="url(#asphaltGrain)" />

  <!-- Road White Striping (Severely Cracked) -->
  <polygon points="120,0 200,0 170,600 90,600" fill="#e2e8f0" opacity="0.8" />
  <!-- Crack across the white stripe -->
  <path d="M 120,240 L 150,270 L 140,310 L 180,340" stroke="#1c2028" stroke-width="4" fill="none" />

  <!-- The Severe Pothole Cavity (Irregular, Fractured Edges) -->
  <path d="M 280,220 C 350,180 520,190 580,240 C 640,290 650,380 590,440 C 530,500 380,510 300,460 C 230,410 210,310 280,220 Z" fill="url(#holeDepth)" stroke="#1a1d24" stroke-width="6" />

  <!-- Broken Asphalt Fragments & Exposed Aggregate inside hole -->
  <ellipse cx="430" cy="350" rx="140" ry="80" fill="#121418" />
  <g fill="#5a6273">
    <polygon points="340,320 360,310 355,335 335,330" />
    <polygon points="480,280 510,275 500,305 475,295" />
    <polygon points="410,400 440,390 435,420 405,415" />
    <polygon points="530,360 550,350 545,380 525,375" />
    <polygon points="310,380 330,370 325,400 305,390" />
  </g>
  <!-- Deep Crevice Shadows -->
  <path d="M 320,260 Q 440,290 540,260" stroke="#000000" stroke-width="8" fill="none" />
  <path d="M 300,370 Q 420,430 560,390" stroke="#000000" stroke-width="6" fill="none" />

  <!-- Severe Stress Fractures Spreading outward into Road -->
  <g stroke="#1a1d24" stroke-width="3" fill="none">
    <path d="M 280,220 L 220,160 L 160,180" />
    <path d="M 580,240 L 670,180 L 720,200" />
    <path d="M 590,440 L 680,500 L 740,490" />
    <path d="M 300,460 L 230,520 L 180,510" />
  </g>

  <!-- Official High-Visibility Hazard Traffic Cone -->
  <g transform="translate(620, 320)">
    <ellipse cx="40" cy="140" rx="35" ry="12" fill="#1e2430" />
    <polygon points="40,20 15,135 65,135" fill="#f97316" />
    <!-- Reflective White Bands -->
    <polygon points="33,55 47,55 52,80 28,80" fill="#ffffff" />
    <polygon points="25,95 55,95 60,118 20,118" fill="#ffffff" />
    <polygon points="40,15 37,25 43,25" fill="#ea580c" />
  </g>

  <!-- Technical Defect Measurement & Inspection Overlay -->
  <g transform="translate(20, 20)">
    <rect width="360" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">
      ⚠️ CIVIC DEFECT EVIDENCE • PWD WARD 12
    </text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Hazardous Asphalt Pothole & Bitumen Cavity
    </text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">
      DEPTH: 180mm | RADIUS: ~1.2m | PRIORITY: HIGH
    </text>
  </g>

  <!-- Red "BEFORE REPAIR" Banner -->
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      BEFORE REPAIR
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 4. POTHOLE AFTER: FRESHLY PAVED COMPACTED ASPHALT ROAD (4:3)
// -------------------------------------------------------------
const potholeAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="freshAsphalt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181a20" />
      <stop offset="50%" stop-color="#232730" />
      <stop offset="100%" stop-color="#14161b" />
    </linearGradient>
    <pattern id="roadBase" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill="#383e4a" />
      <circle cx="5" cy="12" r="1.5" fill="#252a33" />
      <circle cx="18" cy="8" r="1" fill="#4f5666" />
      <circle cx="28" cy="24" r="2" fill="#20242c" />
    </pattern>
    <linearGradient id="compactorTexture" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="50%" stop-color="rgba(0,0,0,0.15)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)" />
    </linearGradient>
  </defs>

  <!-- Base Existing Road -->
  <rect width="800" height="600" fill="url(#roadBase)" />

  <!-- Road White Marking Striping (Restored & Fresh) -->
  <polygon points="120,0 200,0 170,600 90,600" fill="#f8fafc" />

  <!-- The Fresh Hot-Mix Asphalt Patch (Smooth, Roller-Compacted) -->
  <path d="M 240,160 C 400,140 560,150 640,210 C 710,270 700,430 620,490 C 530,550 340,540 250,480 C 180,420 170,220 240,160 Z" fill="url(#freshAsphalt)" stroke="#0f1115" stroke-width="4" />

  <!-- Roller Compaction Lap Marks (Demonstrating Professional PWD Execution) -->
  <g stroke="rgba(255, 255, 255, 0.05)" stroke-width="20" fill="none">
    <line x1="220" y1="240" x2="660" y2="240" />
    <line x1="200" y1="310" x2="680" y2="310" />
    <line x1="210" y1="380" x2="670" y2="380" />
    <line x1="240" y1="450" x2="640" y2="450" />
  </g>

  <!-- Bitumen Joint Sealing Line along Patch Perimeter -->
  <path d="M 240,160 C 400,140 560,150 640,210 C 710,270 700,430 620,490 C 530,550 340,540 250,480 C 180,420 170,220 240,160 Z" fill="none" stroke="#000000" stroke-width="6" opacity="0.6" stroke-dasharray="8,4" />

  <!-- Restored Crisp Thermoplastic Lane Alignment Line across the Patch -->
  <polygon points="175,200 195,200 182,450 162,450" fill="#ffffff" />

  <!-- Official PWD Certified Proof of Work Stamp -->
  <g transform="translate(420, 360)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <!-- Gold/Green Certification Seal -->
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">OFFICIAL</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">VERIFIED</text>

    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">
      CERTIFIED PROOF OF WORK
    </text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Road Re-surfaced & Leveled
    </text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">
      MATERIAL: VG-30 Bitumen + 20mm Stone
    </text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">
      ENGINEER: Er. Rajesh V. Sharma (EXEC-449)
    </text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">
      QUALITY: Compaction Passed 98.4%
    </text>
  </g>

  <!-- Green "AFTER: REPAIRED & VERIFIED" Banner -->
  <g transform="translate(520, 20)">
    <rect width="260" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="130" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      ✓ AFTER: REPAIRED &amp; VERIFIED
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 5. GARBAGE BEFORE: OVERFLOWING MUNICIPAL WASTE CONTAINER (4:3)
// -------------------------------------------------------------
const garbageBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="binGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="50%" stop-color="#166534" />
      <stop offset="100%" stop-color="#0f3d1f" />
    </linearGradient>
    <linearGradient id="sidewalkTile" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
  </defs>

  <!-- Background: Municipal Park Walkway & Pavement -->
  <rect width="800" height="600" fill="#cbd5e1" />
  <!-- Concrete Pavers Grid Lines -->
  <line x1="0" y1="420" x2="800" y2="420" stroke="#94a3b8" stroke-width="4" />
  <line x1="200" y1="420" x2="200" y2="600" stroke="#94a3b8" stroke-width="3" />
  <line x1="450" y1="420" x2="450" y2="600" stroke="#94a3b8" stroke-width="3" />
  <line x1="700" y1="420" x2="700" y2="600" stroke="#94a3b8" stroke-width="3" />
  <!-- Park Grass Verge in background -->
  <rect x="0" y="0" width="800" height="340" fill="#4d7c0f" />

  <!-- Overflowing Municipal Garbage Dumpster -->
  <g transform="translate(240, 160)">
    <!-- Bin Shadow -->
    <ellipse cx="160" cy="300" rx="190" ry="30" fill="rgba(15, 23, 42, 0.4)" />

    <!-- Green Commercial Dumpster Body -->
    <rect x="20" y="110" width="280" height="180" rx="6" fill="url(#binGreen)" stroke="#052e16" stroke-width="4" />
    <!-- Swachh Bharat / Municipal Sanitation Logo Stencil on Bin -->
    <circle cx="160" cy="200" r="35" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.85" />
    <text x="160" y="196" fill="#ffffff" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">DSWM</text>
    <text x="160" y="212" fill="#ffffff" font-family="Arial, sans-serif" font-size="9" text-anchor="middle">MUNICIPAL</text>

    <!-- Bin Wheels & Steel Reinforcements -->
    <rect x="40" y="280" width="30" height="25" rx="4" fill="#1e293b" />
    <rect x="250" y="280" width="30" height="25" rx="4" fill="#1e293b" />
    <line x1="20" y1="160" x2="300" y2="160" stroke="#052e16" stroke-width="3" />

    <!-- Open/Jammed Dumpster Lid angled backward -->
    <polygon points="10,110 310,110 330,70 30,70" fill="#15803d" stroke="#052e16" stroke-width="3" />

    <!-- Mountain of Spilled Waste Bags & Food Cartons Overflowing -->
    <!-- Black and White plastic bags bulging out -->
    <ellipse cx="90" cy="90" rx="45" ry="35" fill="#0f172a" />
    <ellipse cx="160" cy="70" rx="55" ry="40" fill="#f1f5f9" stroke="#94a3b8" />
    <ellipse cx="230" cy="85" rx="50" ry="35" fill="#334155" />
    <ellipse cx="130" cy="40" rx="40" ry="30" fill="#e2e8f0" stroke="#94a3b8" />
    <ellipse cx="190" cy="45" rx="45" ry="32" fill="#1e293b" />
  </g>

  <!-- Litter Scattered across Sidewalk Floor -->
  <g fill="#475569">
    <!-- Crushed Cardboard Cartons -->
    <polygon points="120,460 170,440 210,480 150,500" fill="#b45309" stroke="#78350f" stroke-width="2" />
    <polygon points="130,510 180,500 170,530 120,535" fill="#d97706" />
    <!-- Spilled plastic bags on floor -->
    <ellipse cx="200" cy="480" rx="35" ry="20" fill="#0f172a" />
    <ellipse cx="570" cy="470" rx="45" ry="25" fill="#f8fafc" stroke="#94a3b8" />
    <ellipse cx="640" cy="500" rx="40" ry="20" fill="#334155" />
    <!-- Discarded cans and bottles -->
    <rect x="520" y="510" width="30" height="12" rx="3" fill="#ef4444" transform="rotate(25, 520, 510)" />
    <rect x="180" y="530" width="28" height="10" rx="3" fill="#3b82f6" transform="rotate(-15, 180, 530)" />
  </g>

  <!-- Top Left Hazard Banner -->
  <g transform="translate(20, 20)">
    <rect width="370" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">
      ⚠️ CIVIC DEFECT EVIDENCE • SANITATION
    </text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Overflowing Municipal Waste Receptacle
    </text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">
      LOCATION: Riverside Park East | OVERFLOW: ~80KG
    </text>
  </g>

  <!-- Red "BEFORE REPAIR" Banner -->
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      BEFORE CLEANUP
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 6. GARBAGE AFTER: CLEANED, SANITIZED & RESTORED RECEPTACLE (4:3)
// -------------------------------------------------------------
const garbageAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="binClean" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#15803d" />
      <stop offset="50%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
    <linearGradient id="washedPavement" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>

  <!-- Clean Washed Walkway Surface -->
  <rect width="800" height="600" fill="url(#washedPavement)" />
  <line x1="0" y1="420" x2="800" y2="420" stroke="#94a3b8" stroke-width="4" />
  <line x1="200" y1="420" x2="200" y2="600" stroke="#94a3b8" stroke-width="3" />
  <line x1="450" y1="420" x2="450" y2="600" stroke="#94a3b8" stroke-width="3" />
  <line x1="700" y1="420" x2="700" y2="600" stroke="#94a3b8" stroke-width="3" />

  <!-- Clean Groomed Park Lawn in background -->
  <rect x="0" y="0" width="800" height="340" fill="#65a30d" />
  <!-- Neat Decorative Hedge Row -->
  <ellipse cx="120" cy="340" rx="90" ry="25" fill="#4d7c0f" />
  <ellipse cx="280" cy="340" rx="90" ry="25" fill="#4d7c0f" />
  <ellipse cx="440" cy="340" rx="90" ry="25" fill="#4d7c0f" />
  <ellipse cx="600" cy="340" rx="90" ry="25" fill="#4d7c0f" />
  <ellipse cx="740" cy="340" rx="90" ry="25" fill="#4d7c0f" />

  <!-- Sparkling Clean Sanitized Dumpster (Lid Tightly Closed) -->
  <g transform="translate(240, 160)">
    <!-- Bin Shadow -->
    <ellipse cx="160" cy="300" rx="190" ry="30" fill="rgba(15, 23, 42, 0.25)" />

    <!-- Gleaming Green Dumpster Body -->
    <rect x="20" y="110" width="280" height="180" rx="6" fill="url(#binClean)" stroke="#14532d" stroke-width="4" />
    
    <!-- Fresh Heavy-Duty 100L Blue Liner Cuffed Neatly at Rim -->
    <rect x="18" y="106" width="284" height="14" rx="3" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />

    <!-- Clean Closed Lid with Padlock Latch -->
    <rect x="14" y="94" width="292" height="16" rx="4" fill="#14532d" stroke="#052e16" stroke-width="2" />
    <rect x="150" y="110" width="20" height="25" rx="3" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />

    <!-- Swachh Bharat & Sanitation Seal Stencil -->
    <circle cx="160" cy="200" r="35" fill="#ffffff" opacity="0.95" />
    <circle cx="160" cy="200" r="32" fill="none" stroke="#15803d" stroke-width="2" />
    <text x="160" y="196" fill="#15803d" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">CLEAN</text>
    <text x="160" y="210" fill="#15803d" font-family="Arial, sans-serif" font-size="9" text-anchor="middle">DSWM-9904</text>

    <!-- Sparkling Clean Wheels -->
    <circle cx="55" cy="295" r="14" fill="#1e293b" />
    <circle cx="265" cy="295" r="14" fill="#1e293b" />
  </g>

  <!-- Moisture Disinfection Sheen on Pavement (Showing Pressure-Washing) -->
  <ellipse cx="400" cy="490" rx="300" ry="40" fill="rgba(56, 189, 248, 0.12)" />
  <g fill="#ffffff" opacity="0.8">
    <!-- Sparkle Stars -->
    <path d="M 180,480 L 183,488 L 191,491 L 183,494 L 180,502 L 177,494 L 169,491 L 177,488 Z" />
    <path d="M 590,470 L 593,478 L 601,481 L 593,484 L 590,492 L 587,484 L 579,481 L 587,478 Z" />
  </g>

  <!-- Official Sanitation Certificate Stamp -->
  <g transform="translate(420, 360)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">CLEAN</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">PASSED</text>

    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">
      SANITATION PROOF OF WORK
    </text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Cleared &amp; Bio-Disinfected
    </text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">
      SUPERVISOR: Rajesh Sharma (DSWM-9904)
    </text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">
      EQUIPMENT: High-Pressure Wash + Liner
    </text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">
      CERTIFICATE: POW-MUNI-982104
    </text>
  </g>

  <!-- Green "AFTER: CLEANED & SANITIZED" Banner -->
  <g transform="translate(500, 20)">
    <rect width="280" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="140" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      ✓ AFTER: CLEANED &amp; SANITIZED
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 7. STREETLIGHT BEFORE: DAMAGED UNLIT POLE IN DARK (4:3)
// -------------------------------------------------------------
const streetlightBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050d18" />
      <stop offset="100%" stop-color="#0f1f33" />
    </linearGradient>
  </defs>

  <!-- Dark Night Sky -->
  <rect width="800" height="600" fill="url(#nightSky)" />

  <!-- Roadway & Dark Crosswalk -->
  <polygon points="0,600 800,600 650,420 150,420" fill="#111827" />
  <!-- Faded unlit crosswalk zebra stripes -->
  <g fill="#374151">
    <rect x="240" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="320" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="400" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="480" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="560" y="470" width="30" height="90" transform="skewX(-20)" />
  </g>

  <!-- Municipal Steel Streetlight Pole -->
  <g transform="translate(380, 40)">
    <!-- Base Concrete Plinth -->
    <rect x="-30" y="480" width="60" height="30" rx="4" fill="#4b5563" />
    <!-- Tapered Steel Mast -->
    <polygon points="-12,480 12,480 8,120 -8,120" fill="#9ca3af" stroke="#4b5563" stroke-width="2" />

    <!-- Open/Damaged Electrical Inspection Hatch at base -->
    <rect x="-8" y="400" width="16" height="35" fill="#1f2937" stroke="#ef4444" stroke-width="2" />
    <!-- Dangling wire spark -->
    <path d="M 0,420 Q 8,435 -4,445" stroke="#f59e0b" stroke-width="2" fill="none" />

    <!-- Curved Luminaire Arm -->
    <path d="M 0,120 Q 0,40 -90,30" fill="none" stroke="#9ca3af" stroke-width="12" />

    <!-- Luminaire Head (DARK, EXTINGUISHED, BROKEN COB) -->
    <path d="M -130,45 L -70,25 L -65,38 L -125,58 Z" fill="#374151" stroke="#1f2937" stroke-width="2" />
    <ellipse cx="-95" cy="46" rx="28" ry="8" fill="#111827" stroke="#4b5563" stroke-width="1" />
  </g>

  <!-- Danger Electrical Warning Symbol near Hatch -->
  <polygon points="380,480 370,498 390,498" fill="#facc15" stroke="#000" stroke-width="1.5" />
  <text x="380" y="495" fill="#000" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">!</text>

  <!-- Top Left Defect Evidence Banner -->
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">
      ⚠️ CIVIC DEFECT EVIDENCE • ELECTRICAL
    </text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Dark Streetlight Luminaire Outage
    </text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">
      POLE ID: LP-W1-14 | ILLUMINATION: 0 LUX (DEAD)
    </text>
  </g>

  <!-- Red "BEFORE REPAIR" Banner -->
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      BEFORE REPAIR
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 8. STREETLIGHT AFTER: REPAIRED & BRIGHTLY ILLUMINATED (4:3)
// -------------------------------------------------------------
const streetlightAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a1829" />
      <stop offset="100%" stop-color="#142c4c" />
    </linearGradient>
    <linearGradient id="ledBeam" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(254, 240, 138, 0.7)" />
      <stop offset="60%" stop-color="rgba(254, 240, 138, 0.3)" />
      <stop offset="100%" stop-color="rgba(254, 240, 138, 0)" />
    </linearGradient>
    <radialGradient id="crosswalkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(254, 240, 138, 0.45)" />
      <stop offset="100%" stop-color="rgba(254, 240, 138, 0)" />
    </radialGradient>
  </defs>

  <!-- Background Sky -->
  <rect width="800" height="600" fill="url(#nightSky2)" />

  <!-- Roadway & Brightly Illuminated Crosswalk -->
  <polygon points="0,600 800,600 650,420 150,420" fill="#1f2937" />

  <!-- LED Light Cone Beaming Downward -->
  <polygon points="285,85 50,600 620,600" fill="url(#ledBeam)" />
  <ellipse cx="330" cy="530" rx="260" ry="60" fill="url(#crosswalkGlow)" />

  <!-- Crisp Illuminated White Crosswalk Zebra Stripes -->
  <g fill="#f8fafc">
    <rect x="240" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="320" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="400" y="470" width="30" height="90" transform="skewX(-20)" />
    <rect x="480" y="470" width="30" height="90" transform="skewX(-20)" />
  </g>

  <!-- Municipal Steel Streetlight Pole (Repaired & Secured) -->
  <g transform="translate(380, 40)">
    <!-- Base Concrete Plinth -->
    <rect x="-30" y="480" width="60" height="30" rx="4" fill="#64748b" stroke="#334155" stroke-width="2" />
    <!-- Tapered Steel Mast -->
    <polygon points="-12,480 12,480 8,120 -8,120" fill="#cbd5e1" stroke="#64748b" stroke-width="2" />

    <!-- Inspection Hatch Secured with Safety Seal -->
    <rect x="-8" y="400" width="16" height="35" rx="2" fill="#94a3b8" stroke="#16a34a" stroke-width="2" />
    <rect x="-4" y="415" width="8" height="6" rx="1" fill="#22c55e" />

    <!-- Curved Luminaire Arm -->
    <path d="M 0,120 Q 0,40 -90,30" fill="none" stroke="#cbd5e1" stroke-width="12" />

    <!-- Brand New 120W High-Efficiency LED Luminaire Head -->
    <path d="M -130,45 L -70,25 L -65,38 L -125,58 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
    <!-- Glowing Luminaire Lens -->
    <ellipse cx="-95" cy="46" rx="28" ry="8" fill="#fef08a" stroke="#ffffff" stroke-width="2" />
    <ellipse cx="-95" cy="46" rx="20" ry="5" fill="#ffffff" />
  </g>

  <!-- Official Electrical Dept Proof Stamp -->
  <g transform="translate(430, 360)">
    <rect x="-10" y="-10" width="340" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">TESTED</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">ACTIVE</text>

    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">
      ELECTRICAL PROOF OF WORK
    </text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      120W LED Fixture Restored
    </text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">
      POLE: LP-W1-14 | ILLUMINATION: 52 LUX
    </text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">
      CREW: Electrical Sub-Division Line-04
    </text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">
      SAFETY: Hatch Sealed &amp; Grounded
    </text>
  </g>

  <!-- Green "AFTER: RESTORED & TESTED" Banner -->
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      ✓ AFTER: RESTORED &amp; TESTED
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 9. WATER LEAK BEFORE: RUPTURED UNDERGROUND MAIN & FLOODING (4:3)
// -------------------------------------------------------------
const waterLeakBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="waterSpray" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#bae6fd" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <radialGradient id="waterPool" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="70%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </radialGradient>
  </defs>

  <!-- Road & Concrete Curb Background -->
  <rect width="800" height="600" fill="#334155" />
  <!-- Concrete Curb Slab -->
  <rect x="0" y="160" width="800" height="60" fill="#94a3b8" stroke="#64748b" stroke-width="3" />
  <!-- Sidewalk Walkway -->
  <rect x="0" y="0" width="800" height="160" fill="#cbd5e1" />

  <!-- Ruptured Joint Hole in Curb -->
  <ellipse cx="400" cy="220" rx="80" ry="30" fill="#0f172a" />

  <!-- Massive Gushing Water Jet Spraying into Air -->
  <path d="M 370,220 Q 340,60 395,20 Q 420,60 430,220 Z" fill="url(#waterSpray)" opacity="0.85" />
  <!-- Spray Droplets and Plumes -->
  <ellipse cx="395" cy="30" rx="35" ry="20" fill="#ffffff" opacity="0.9" />
  <ellipse cx="360" cy="70" rx="25" ry="15" fill="#e0f2fe" opacity="0.8" />
  <ellipse cx="430" cy="80" rx="25" ry="15" fill="#e0f2fe" opacity="0.8" />

  <!-- Flooding Water Pool Spread across Roadway Surface -->
  <ellipse cx="420" cy="380" rx="320" ry="140" fill="url(#waterPool)" opacity="0.75" />
  <!-- Water Surface Ripple Rings -->
  <ellipse cx="400" cy="290" rx="90" ry="25" fill="none" stroke="#e0f2fe" stroke-width="3" opacity="0.8" />
  <ellipse cx="400" cy="330" rx="170" ry="45" fill="none" stroke="#bae6fd" stroke-width="2" opacity="0.6" />
  <ellipse cx="400" cy="390" rx="260" ry="70" fill="none" stroke="#7dd3fc" stroke-width="1.5" opacity="0.5" />

  <!-- Top Left Defect Evidence Banner -->
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">
      ⚠️ CIVIC DEFECT EVIDENCE • WATER &amp; SEWAGE
    </text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      Ruptured Water Main Pipeline Leak
    </text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">
      PRESSURE: 6.5 BAR | ESTIMATED LOSS: 1200L/HR
    </text>
  </g>

  <!-- Red "BEFORE REPAIR" Banner -->
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      BEFORE REPAIR
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 10. WATER LEAK AFTER: REPAIRED VALVE COUPLING & DRY ROAD (4:3)
// -------------------------------------------------------------
const waterLeakAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <!-- Dry Restored Road & Concrete Curb Background -->
  <rect width="800" height="600" fill="#475569" />
  <rect x="0" y="160" width="800" height="60" fill="#cbd5e1" stroke="#94a3b8" stroke-width="3" />
  <rect x="0" y="0" width="800" height="160" fill="#e2e8f0" />

  <!-- Clean Neatly Backfilled & Sealed Valve Pit -->
  <rect x="300" y="170" width="200" height="140" rx="8" fill="#1e293b" stroke="#334155" stroke-width="3" />

  <!-- New Cast Iron Heavy-Duty Municipal Valve Cover & Flange -->
  <circle cx="400" cy="240" r="50" fill="#0f172a" stroke="#d97706" stroke-width="4" />
  <!-- Municipal Water Board Inscription -->
  <text x="400" y="236" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">MUNICIPAL</text>
  <text x="400" y="252" fill="#ffffff" font-family="Arial, sans-serif" font-size="9" text-anchor="middle">WATER BOARD</text>
  <!-- Flange Hex Bolts -->
  <circle cx="400" cy="200" r="4" fill="#fbbf24" />
  <circle cx="440" cy="240" r="4" fill="#fbbf24" />
  <circle cx="400" cy="280" r="4" fill="#fbbf24" />
  <circle cx="360" cy="240" r="4" fill="#fbbf24" />

  <!-- Dry Asphalt Surface with Fresh Bitumen Seal around Pit -->
  <rect x="290" y="160" width="220" height="160" rx="12" fill="none" stroke="#0f172a" stroke-width="6" opacity="0.7" />

  <!-- Official Water Dept Proof of Work Stamp -->
  <g transform="translate(420, 360)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">LEAK</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">SEALED</text>

    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">
      WATER WORKS PROOF OF WORK
    </text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
      150mm Flange Coupling Replaced
    </text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">
      PRESSURE TESTED: 6.5 BAR (STABLE)
    </text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">
      STATUS: Zero Leakage, Road Dry
    </text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">
      CERTIFICATE: POW-WATER-2026-0914
    </text>
  </g>

  <!-- Green "AFTER: SEALED & RESTORED" Banner -->
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
      ✓ AFTER: SEALED &amp; RESTORED
    </text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 11. TRAFFIC SIGNAL BEFORE & AFTER
// -------------------------------------------------------------
const trafficSignalBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#1e293b" />
  <rect x="340" y="100" width="120" height="320" rx="20" fill="#0f172a" stroke="#475569" stroke-width="4" />
  <circle cx="400" cy="160" r="38" fill="#450a0a" stroke="#7f1d1d" stroke-width="2" />
  <circle cx="400" cy="260" r="38" fill="#451a03" stroke="#78350f" stroke-width="2" />
  <circle cx="400" cy="360" r="38" fill="#022c22" stroke="#064e3b" stroke-width="2" />
  <polygon points="400,240 375,280 425,280" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
  <text x="400" y="275" fill="#000000" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">!</text>
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">⚠️ CIVIC DEFECT EVIDENCE • TRAFFIC</text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Intersection Signal Malfunction</text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">JUNCTION: 5th & Main | STATUS: DARK / UNRESPONSIVE</text>
  </g>
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">BEFORE REPAIR</text>
  </g>
</svg>`;

const trafficSignalAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#0f172a" />
  <rect x="340" y="100" width="120" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="4" />
  <circle cx="400" cy="160" r="38" fill="#450a0a" />
  <circle cx="400" cy="260" r="38" fill="#451a03" />
  <circle cx="400" cy="360" r="38" fill="#22c55e" stroke="#86efac" stroke-width="4" />
  <circle cx="400" cy="360" r="50" fill="rgba(34, 197, 94, 0.3)" />
  <g transform="translate(420, 360)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">SIGNAL</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">ONLINE</text>
    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">TRAFFIC DIVISION PROOF</text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">LED Logic Controller Restored</text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">TIMING: Cycle Sync 90s (Active)</text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">SAFETY: Conflict Monitor OK</text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">CERTIFICATE: POW-TRAF-2026-8831</text>
  </g>
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ AFTER: SYNCHRONIZED &amp; ONLINE</text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 12. SIDEWALK BEFORE & AFTER
// -------------------------------------------------------------
const sidewalkBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#94a3b8" />
  <rect x="100" y="150" width="600" height="350" fill="#cbd5e1" stroke="#64748b" stroke-width="4" />
  <path d="M 220,150 L 320,300 L 280,420 L 350,500" stroke="#0f172a" stroke-width="6" fill="none" />
  <path d="M 450,150 L 320,300 L 480,380 L 520,500" stroke="#0f172a" stroke-width="5" fill="none" />
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">⚠️ CIVIC DEFECT EVIDENCE • PEDESTRIAN</text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Cracked Concrete Pavement Trip Hazard</text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">DISPLACEMENT: 45mm | PEDESTRIAN RISK: HIGH</text>
  </g>
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">BEFORE REPAIR</text>
  </g>
</svg>`;

const sidewalkAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#cbd5e1" />
  <rect x="100" y="150" width="600" height="350" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3" />
  <rect x="100" y="440" width="600" height="60" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
  <g fill="#ca8a04">
    <circle cx="150" cy="470" r="6" /><circle cx="200" cy="470" r="6" /><circle cx="250" cy="470" r="6" />
    <circle cx="300" cy="470" r="6" /><circle cx="350" cy="470" r="6" /><circle cx="400" cy="470" r="6" />
    <circle cx="450" cy="470" r="6" /><circle cx="500" cy="470" r="6" /><circle cx="550" cy="470" r="6" />
    <circle cx="600" cy="470" r="6" /><circle cx="650" cy="470" r="6" />
  </g>
  <g transform="translate(420, 200)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PAVED</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">LEVEL</text>
    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">PUBLIC WORKS PROOF</text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Re-cast Concrete &amp; Tactile Pavers</text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">STANDARD: ADA / Accessibility Guideline Compliant</text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">GRADE: M-25 Concrete Screed</text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">CERTIFICATE: POW-SIDE-2026-4412</text>
  </g>
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ AFTER: RE-POURED &amp; ACCESSIBLE</text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 13. TREE HAZARD BEFORE & AFTER
// -------------------------------------------------------------
const treeHazardBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#334155" />
  <rect x="0" y="380" width="800" height="220" fill="#1e293b" />
  <path d="M 680,600 C 660,350 580,250 500,200 L 480,180" stroke="#451a03" stroke-width="48" fill="none" />
  <path d="M 500,200 L 220,380 L 160,420" stroke="#78350f" stroke-width="28" fill="none" />
  <ellipse cx="200" cy="400" rx="90" ry="50" fill="#14532d" opacity="0.9" />
  <ellipse cx="280" cy="380" rx="70" ry="40" fill="#166534" opacity="0.8" />
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">⚠️ CIVIC DEFECT EVIDENCE • HORTICULTURE</text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Fallen Storm Limb Blocking Roadway</text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">HAZARD: 2-Lane Obstruction | CREW: URGENT</text>
  </g>
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">BEFORE CLEARANCE</text>
  </g>
</svg>`;

const treeHazardAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#334155" />
  <rect x="0" y="380" width="800" height="220" fill="#1e293b" />
  <polygon points="380,600 420,600 410,400 390,400" fill="#ffffff" />
  <path d="M 680,600 C 660,350 580,250 500,200" stroke="#451a03" stroke-width="48" fill="none" />
  <ellipse cx="560" cy="180" rx="140" ry="110" fill="#15803d" />
  <ellipse cx="640" cy="140" rx="110" ry="90" fill="#16a34a" />
  <g transform="translate(420, 360)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">TREES</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">CLEARED</text>
    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">HORTICULTURE DEPT PROOF</text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Canopy Pruned &amp; Road Cleared</text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">DEBRIS: Chipped &amp; Recycled</text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">ROAD STATUS: 100% Clear &amp; Safe</text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">CERTIFICATE: POW-TREE-2026-3021</text>
  </g>
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ AFTER: PRUNED &amp; CLEARED</text>
  </g>
</svg>`;

// -------------------------------------------------------------
// 14. GRAFFITI / PUBLIC PROPERTY BEFORE & AFTER
// -------------------------------------------------------------
const graffitiBefore = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#64748b" />
  <rect x="80" y="100" width="640" height="420" fill="#94a3b8" stroke="#475569" stroke-width="4" />
  <path d="M 160,260 Q 240,160 360,260 T 560,240" stroke="#dc2626" stroke-width="14" fill="none" />
  <path d="M 220,340 Q 340,390 440,320 T 600,380" stroke="#7c3aed" stroke-width="12" fill="none" />
  <g transform="translate(20, 20)">
    <rect width="380" height="74" rx="4" fill="rgba(11, 34, 57, 0.92)" stroke="#e11d48" stroke-width="2" />
    <text x="14" y="24" fill="#f43f5e" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1">⚠️ CIVIC DEFECT EVIDENCE • PUBLIC WALL</text>
    <text x="14" y="44" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Defaced Public Property / Wall Tagging</text>
    <text x="14" y="62" fill="#94a3b8" font-family="monospace" font-size="11">AREA: 8.5m² Defacement | PROPERTY: MUNI CORRIDOR</text>
  </g>
  <g transform="translate(610, 20)">
    <rect width="170" height="38" rx="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
    <text x="85" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">BEFORE CLEANUP</text>
  </g>
</svg>`;

const graffitiAfter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#64748b" />
  <rect x="80" y="100" width="640" height="420" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" />
  <rect x="80" y="470" width="640" height="50" fill="#0b2239" />
  <g transform="translate(420, 320)">
    <rect x="-10" y="-10" width="350" height="150" rx="8" fill="rgba(6, 78, 59, 0.95)" stroke="#34d399" stroke-width="2.5" />
    <circle cx="45" cy="65" r="36" fill="#047857" stroke="#fbbf24" stroke-width="2.5" />
    <text x="45" y="60" fill="#fbbf24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">PAINT</text>
    <text x="45" y="75" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
    <text x="45" y="88" fill="#fbbf24" font-family="Arial, sans-serif" font-size="8" font-weight="bold" text-anchor="middle">RESTORED</text>
    <text x="96" y="28" fill="#34d399" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">CIVIC BEAUTIFICATION PROOF</text>
    <text x="96" y="50" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Pressure-Washed &amp; Repainted</text>
    <text x="96" y="70" fill="#a7f3d0" font-family="monospace" font-size="11">COAT: Weather-Resistant Exterior Acrylic</text>
    <text x="96" y="88" fill="#a7f3d0" font-family="monospace" font-size="11">ANTI-GRAFFITI: Protective Sealant Applied</text>
    <text x="96" y="106" fill="#6ee7b7" font-family="monospace" font-size="10">CERTIFICATE: POW-WALL-2026-1180</text>
  </g>
  <g transform="translate(510, 20)">
    <rect width="270" height="38" rx="4" fill="#059669" stroke="#ffffff" stroke-width="1.5" />
    <text x="135" y="24" fill="#ffffff" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✓ AFTER: PRESSURE-WASHED &amp; PAINTED</text>
  </g>
</svg>`;

// Write all files into public/images
const files = {
  'emblem-india.svg': emblemIndia,
  'hero-civic-city.svg': heroCivicCity,
  'pothole-before.svg': potholeBefore,
  'pothole-after.svg': potholeAfter,
  'garbage-before.svg': garbageBefore,
  'garbage-after.svg': garbageAfter,
  'streetlight-before.svg': streetlightBefore,
  'streetlight-after.svg': streetlightAfter,
  'waterleak-before.svg': waterLeakBefore,
  'waterleak-after.svg': waterLeakAfter,
  'trafficsignal-before.svg': trafficSignalBefore,
  'trafficsignal-after.svg': trafficSignalAfter,
  'sidewalk-before.svg': sidewalkBefore,
  'sidewalk-after.svg': sidewalkAfter,
  'treehazard-before.svg': treeHazardBefore,
  'treehazard-after.svg': treeHazardAfter,
  'graffiti-before.svg': graffitiBefore,
  'graffiti-after.svg': graffitiAfter,
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim(), 'utf-8');
  console.log(`Generated: public/images/${filename}`);
}
