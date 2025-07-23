/**
 * Configuration management for Smart Stock Analyzer
 */

// Application configuration
export const AppConfig = {
  // Application metadata
  name: "Smart Stock Analyzer",
  version: "1.0.0",
  description: "AI-Powered Financial Insights",

  // API configuration
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    endpoints: {
      stocks: "https://polygon-api-worker.guil-9d2.workers.dev",
      ai: "https://openai-api-worker.guil-9d2.workers.dev",
    },
  },

  // UI configuration
  ui: {
    maxTickers: 3,
    minTickerLength: 1,
    maxTickerLength: 10,
    debounceDelay: 300,
    animationDuration: 300,
  },

  // Date configuration
  dates: {
    lookbackDays: 5,
    endDateOffset: 1,
  },

  // Feature flags
  features: {
    enableAnalytics: false,
    enableAdvancedCharts: false,
    enableExport: false,
  },

  // Theme configuration
  theme: {
    defaultMode: "light",
    enableDarkMode: false,
  },
};

// Environment-specific overrides
const environment = import.meta.env.MODE || "development";

if (environment === "development") {
  AppConfig.api.timeout = 60000; // Longer timeout for development
  AppConfig.features.enableAnalytics = false;
}

if (environment === "production") {
  AppConfig.features.enableAnalytics = true;
}

// Freeze configuration to prevent accidental modifications
Object.freeze(AppConfig);

export default AppConfig;
