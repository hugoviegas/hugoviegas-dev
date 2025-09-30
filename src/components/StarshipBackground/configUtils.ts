import type {
  StarshipConfig,
  ConfigExport,
  DebugSession,
  SpeedConfig,
  SpawnZone,
  Vector3,
  StarshipInstance,
  PerformanceStats,
} from "./types";

/**
 * Configuration export/import utilities for StarshipBackground.
 * Handles saving and loading starship configurations and debug sessions.
 */

/**
 * Export starship configurations to a JSON string
 */
export function exportConfigurations(configs: StarshipConfig[]): string {
  const exportData: ConfigExport = {
    timestamp: Date.now(),
    configs: configs.map((config) => ({ ...config })), // Deep copy
    version: "1.0.0",
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import starship configurations from a JSON string
 */
export function importConfigurations(jsonString: string): StarshipConfig[] {
  try {
    const importData: ConfigExport = JSON.parse(jsonString);

    // Validate the import data
    if (!importData.configs || !Array.isArray(importData.configs)) {
      throw new Error("Invalid configuration format: missing configs array");
    }

    if (!importData.version) {
      throw new Error("Invalid configuration format: missing version");
    }

    // Validate each configuration
    const validatedConfigs: StarshipConfig[] = [];
    for (const config of importData.configs) {
      try {
        const validatedConfig = validateImportedConfig(config);
        validatedConfigs.push(validatedConfig);
      } catch (error) {
        console.warn(`Skipping invalid configuration:`, error);
      }
    }

    return validatedConfigs;
  } catch (error) {
    throw new Error(
      `Failed to import configurations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Export a debug session with current state
 */
export function exportDebugSession(
  configs: StarshipConfig[],
  instances: StarshipInstance[],
  performanceStats: PerformanceStats
): string {
  const sessionData: DebugSession = {
    timestamp: Date.now(),
    configurations: configs.map((config) => ({ ...config })),
    activeInstances: instances.map((instance) => ({
      id: instance.id,
      config: { ...instance.config },
      state: { ...instance.state },
    })),
    performanceMetrics: { ...performanceStats },
    userNotes: `Debug session exported on ${new Date().toLocaleString()}`,
  };

  return JSON.stringify(sessionData, null, 2);
}

/**
 * Import a debug session (for replay/debugging)
 */
export function importDebugSession(jsonString: string): DebugSession {
  try {
    const sessionData: DebugSession = JSON.parse(jsonString);

    // Validate session data
    if (
      !sessionData.configurations ||
      !Array.isArray(sessionData.configurations)
    ) {
      throw new Error("Invalid debug session: missing configurations");
    }

    if (
      !sessionData.activeInstances ||
      !Array.isArray(sessionData.activeInstances)
    ) {
      throw new Error("Invalid debug session: missing active instances");
    }

    return sessionData;
  } catch (error) {
    throw new Error(
      `Failed to import debug session: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Save configurations to localStorage
 */
export function saveConfigurationsToStorage(
  key: string,
  configs: StarshipConfig[]
): void {
  try {
    const exportData = exportConfigurations(configs);
    localStorage.setItem(key, exportData);
  } catch (error) {
    console.error("Failed to save configurations to storage:", error);
  }
}

/**
 * Load configurations from localStorage
 */
export function loadConfigurationsFromStorage(
  key: string
): StarshipConfig[] | null {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    return importConfigurations(storedData);
  } catch (error) {
    console.error("Failed to load configurations from storage:", error);
    return null;
  }
}

/**
 * Download configurations as a file
 */
export function downloadConfigurations(
  configs: StarshipConfig[],
  filename = "starship-configs.json"
): void {
  try {
    const exportData = exportConfigurations(configs);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download configurations:", error);
  }
}

/**
 * Load configurations from a file input
 */
export function loadConfigurationsFromFile(
  file: File
): Promise<StarshipConfig[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const configs = importConfigurations(jsonString);
        resolve(configs);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read configuration file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate an imported configuration
 */
function validateImportedConfig(config: unknown): StarshipConfig {
  const cfg = config as Record<string, unknown>;

  // Basic validation - ensure required fields exist
  if (!cfg.id || !cfg.name || !cfg.modelPath) {
    throw new Error("Configuration missing required fields");
  }

  // Ensure arrays are properly typed
  const validatedConfig: StarshipConfig = {
    id: String(cfg.id),
    name: String(cfg.name),
    modelPath: String(cfg.modelPath),
    scale:
      Array.isArray(cfg.scale) && cfg.scale.length === 3
        ? [Number(cfg.scale[0]), Number(cfg.scale[1]), Number(cfg.scale[2])]
        : [1, 1, 1],
    initialRotation:
      Array.isArray(cfg.initialRotation) && cfg.initialRotation.length === 3
        ? [
            Number(cfg.initialRotation[0]),
            Number(cfg.initialRotation[1]),
            Number(cfg.initialRotation[2]),
          ]
        : [0, 0, 0],
    speed:
      cfg.speed && typeof cfg.speed === "object"
        ? {
            min: Number((cfg.speed as Record<string, unknown>).min) || 0.5,
            max: Number((cfg.speed as Record<string, unknown>).max) || 1.0,
            rotationSpeed: (cfg.speed as Record<string, unknown>).rotationSpeed
              ? Number((cfg.speed as Record<string, unknown>).rotationSpeed)
              : undefined,
          }
        : { min: 0.5, max: 1.0 },
    trajectory: ["linear", "curved", "spiral", "diagonal"].includes(
      cfg.trajectory as string
    )
      ? (cfg.trajectory as "linear" | "curved" | "spiral" | "diagonal")
      : "linear",
    spawnZone:
      cfg.spawnZone && typeof cfg.spawnZone === "object"
        ? {
            entry:
              Array.isArray((cfg.spawnZone as Record<string, unknown>).entry) &&
              ((cfg.spawnZone as Record<string, unknown>).entry as unknown[])
                .length === 3
                ? [
                    Number((cfg.spawnZone as Record<string, unknown>).entry[0]),
                    Number((cfg.spawnZone as Record<string, unknown>).entry[1]),
                    Number((cfg.spawnZone as Record<string, unknown>).entry[2]),
                  ]
                : [-10, 0, 0],
            exit:
              Array.isArray((cfg.spawnZone as Record<string, unknown>).exit) &&
              ((cfg.spawnZone as Record<string, unknown>).exit as unknown[])
                .length === 3
                ? [
                    Number((cfg.spawnZone as Record<string, unknown>).exit[0]),
                    Number((cfg.spawnZone as Record<string, unknown>).exit[1]),
                    Number((cfg.spawnZone as Record<string, unknown>).exit[2]),
                  ]
                : [10, 0, 0],
            variation:
              Number((cfg.spawnZone as Record<string, unknown>).variation) || 2,
          }
        : {
            entry: [-10, 0, 0],
            exit: [10, 0, 0],
            variation: 2,
          },
    materialOverrides: cfg.materialOverrides,
  };

  return validatedConfig;
}

/**
 * Create a backup of current configurations
 */
export function createConfigurationBackup(configs: StarshipConfig[]): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `starship-configs-backup-${timestamp}.json`;
  downloadConfigurations(configs, filename);
  return filename;
}

/**
 * Merge imported configurations with existing ones
 */
export function mergeConfigurations(
  existing: StarshipConfig[],
  imported: StarshipConfig[],
  overwrite: boolean = false
): StarshipConfig[] {
  const merged = [...existing];
  const existingIds = new Set(existing.map((config) => config.id));

  for (const importedConfig of imported) {
    const existingIndex = merged.findIndex(
      (config) => config.id === importedConfig.id
    );

    if (existingIndex >= 0) {
      if (overwrite) {
        merged[existingIndex] = importedConfig;
      }
      // If not overwriting, skip this config
    } else {
      merged.push(importedConfig);
    }
  }

  return merged;
}
