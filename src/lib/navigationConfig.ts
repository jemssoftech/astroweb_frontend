export interface NavLink {
  url?: string;
  icon: string;
  text: string;
  children?: NavLink[];
}

// Route configuration with icons and categories
const routeMetadata: Record<
  string,
  { icon: string; text: string; category?: string }
> = {
  // --- General / Dashboard ---
  "/playground": { icon: "mdi:home-variant-outline", text: "Home" },

  // --- Horoscopes ---
  "/playground/horoscope": {
    icon: "mdi:zodiac-aries",
    text: "Horoscope",
    category: "Horoscopes",
  },
  "/playground/daily-horoscope": {
    icon: "mdi:calendar-today",
    text: "Daily Horoscope",
    category: "Horoscopes",
  },
  "/playground/daily-nakshatra-predictions": {
    icon: "mdi:star-four-points",
    text: "Daily Nakshatra",
    category: "Horoscopes",
  },

  // --- Predictions ---
  "/playground/life-predictor": {
    icon: "mdi:timeline-text-outline",
    text: "Life Predictor",
    category: "Predictions",
  },
  "/playground/basic-astro-details": {
    icon: "mdi:card-account-details-outline",
    text: "Basic Astro Details",
    category: "Predictions",
  },
  "/playground/suggestions-and-remedies": {
    icon: "mdi:hand-coin-outline",
    text: "Remedies",
    category: "Predictions",
  },
  // --- Match Making ---
  "/playground/match-checker": {
    icon: "mdi:heart-half-full",
    text: "Match Checker",
    category: "Match Making",
  },

  // --- Numerology ---
  "/playground/numerology": {
    icon: "mdi:counter",
    text: "Birth Numerology",
    category: "Numerology",
  },
  "/playground/name-numerology": {
    icon: "mdi:alphabetical-variant",
    text: "Name Numerology",
    category: "Numerology",
  },
  "/playground/Numerology-weston": {
    icon: "mdi:earth-arrow-right",
    text: " Numerology",
    category: "Western Astrology",
  },

  // --- Astrology Systems ---
  "/playground/vimshottari-dasha": {
    icon: "mdi:av-timer",
    text: "Vimshottari Dasha",
    category: "Astrology Systems",
  },
  "/playground/lalkitab": {
    icon: "mdi:book-open-blank-variant",
    text: "Lal Kitab",
    category: "Astrology Systems",
  },
  "/playground/kp-system": {
    icon: "mdi:compass-rose",
    text: "KP System",
    category: "Astrology Systems",
  },
  "/playground/yogini-dasha": {
    icon: "mdi:star-face",
    text: "Yogini Dasha",
    category: "Astrology Systems",
  },
  "/playground/ashtakvarga": {
    icon: "mdi:matrix",
    text: "Ashtakvarga",
    category: "Astrology Systems",
  },
  "/playground/Varshaphal": {
    icon: "mdi:calendar-sync",
    text: "Varshaphal",
    category: "Astrology Systems",
  },
  // --- Western Astrology ---
  "/playground/Natal-Chart": {
    icon: "mdi:chart-pie",
    text: "Natal Chart",
    category: "Western Astrology",
  },
  "/playground/LoveCompatibilityPage": {
    icon: "mdi:heart-pulse",
    text: "Love Compatibility",
    category: "Western Astrology",
  },
  "/playground/PersonalityPage": {
    icon: "mdi:account-details",
    text: "Personality",
    category: "Western Astrology",
  },
  "/playground/TransitsPage": {
    icon: "mdi:transit-connection-variant",
    text: "Transits",
    category: "Western Astrology",
  },
  "/playground/solar-return": {
    icon: "mdi:white-balance-sunny",
    text: "Solar Return",
    category: "Western Astrology",
  },
  "/playground/moon-phases": {
    icon: "mdi:moon-waxing-crescent",
    text: "Moon Phases",
    category: "Western Astrology",
  },
  // --- Tools & Utilities ---
  "/playground/indian-calender": {
    icon: "mdi:calendar-month-outline",
    text: "Indian Calendar",
    category: "Tools",
  },

  "/playground/api-builder": {
    icon: "mdi:cloud-tags",
    text: "API Builder",
    category: "Tools",
  },

  // --- Other (Hidden/Footer) ---
  "/about": { icon: "mdi:information", text: "About" },
  "/contact-us": { icon: "mdi:email", text: "Contact Us" },
  "/donate": { icon: "mdi:hand-heart", text: "Donate" },
  "/privacy-policy": { icon: "mdi:shield-lock", text: "Privacy Policy" },
  "/terms-of-service": { icon: "mdi:file-document", text: "Terms of Service" },
};

// Category icons
const categoryIcons: Record<string, string> = {
  Horoscopes: "mdi:weather-night",
  Predictions: "mdi:crystal-ball",
  "Match Making": "mdi:heart-multiple",
  Numerology: "mdi:numeric",
  "Astrology Systems": "mdi:chart-arc",
  "Western Astrology": "mdi:zodiac-leo",
  Tools: "mdi:tools",
};

// Routes to exclude from sidebar
const excludedRoutes = [
  "/login",
  "/register-subscription",
  "/thank-you",
  "/coming-soon",
  "/api-home",
  "/made-on-earth",
  "/now-in-dwapara",
  "/add-person",
  "/edit-person",
  "/contact-us",
  "/privacy-policy",
  "/donate",
  "/remedy",
  "/terms-of-service",
  "/about",
];

/**
 * Generates navigation links from route metadata
 * This function automatically organizes routes into categories
 */
export function getNavigationLinks(): NavLink[] {
  const routes: NavLink[] = [];
  const categorizedRoutes: Record<string, NavLink[]> = {};

  // Process all routes from metadata
  Object.entries(routeMetadata).forEach(([path, metadata]) => {
    // Skip excluded routes
    if (excludedRoutes.includes(path)) {
      return;
    }

    const route: NavLink = {
      url: path,
      icon: metadata.icon,
      text: metadata.text,
    };

    // Categorize routes
    if (metadata.category) {
      if (!categorizedRoutes[metadata.category]) {
        categorizedRoutes[metadata.category] = [];
      }
      categorizedRoutes[metadata.category].push(route);
    } else {
      routes.push(route);
    }
  });

  // Add categorized routes as parent items with children
  Object.entries(categorizedRoutes).forEach(([category, children]) => {
    routes.push({
      icon: categoryIcons[category] || "mdi:folder",
      text: category,
      children: children,
    });
  });

  return routes;
}

/**
 * Add a new route to the configuration
 * Call this function when you create a new page
 */
export function addRoute(
  path: string,
  icon: string,
  text: string,
  category?: string,
) {
  routeMetadata[path] = { icon, text, category };
}
