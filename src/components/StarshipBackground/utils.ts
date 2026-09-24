import type {
  StarshipConfig,
  SpawnZone,
  SpeedConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ConfigValidator,
} from "./types";

/**
 * Configuration validation utilities for StarshipBackground.
 * Provides comprehensive validation for all starship configurations.
 */
export class StarshipConfigValidator implements ConfigValidator {
  validateStarshipConfig(config: StarshipConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate ID
    if (!config.id || config.id.trim().length === 0) {
      errors.push({
        field: "id",
        message: "Starship ID is required",
        severity: "error",
        code: "MISSING_ID",
      });
    }

    // Validate name
    if (!config.name || config.name.trim().length === 0) {
      errors.push({
        field: "name",
        message: "Starship name is required",
        severity: "error",
        code: "MISSING_NAME",
      });
    }

    // Validate model path
    if (!config.modelPath || !config.modelPath.endsWith(".glb")) {
      errors.push({
        field: "modelPath",
        message: "Model path must be a valid GLB file",
        severity: "error",
        code: "INVALID_MODEL_PATH",
      });
    }

    // Validate scale
    const scaleErrors = this.validateScale(config.scale);
    errors.push(...scaleErrors);

    // Validate initial rotation
    if (config.initialRotation.some(isNaN)) {
      errors.push({
        field: "initialRotation",
        message: "Initial rotation must contain valid numbers",
        severity: "error",
        code: "INVALID_ROTATION",
      });
    }

    // Validate speed config
    const speedResult = this.validateSpeedConfig(config.speed);
    errors.push(...speedResult.errors);
    warnings.push(
      ...speedResult.warnings.map((w: ValidationError) => ({
        ...w,
        severity: w.severity ?? "warning",
        code: w.code ?? "SPEED_WARNING",
      }))
    );

    // Validate spawn zone
    const spawnResult = this.validateSpawnZone(config.spawnZone);
    errors.push(...spawnResult.errors);
    warnings.push(
      ...spawnResult.warnings.map((w: ValidationError) => ({
        ...w,
        severity: w.severity ?? "warning",
        code: w.code ?? "SPAWN_WARNING",
      }))
    );

    // Performance warnings
    if (config.scale.some((s) => s > 2.0)) {
      warnings.push({
        field: "scale",
        message: "Large scale values may impact performance",
        severity: "warning",
        code: "LARGE_SCALE",
      });
    }

    if (config.speed.max > 2.0) {
      warnings.push({
        field: "speed.max",
        message: "High speed values may cause jerky movement",
        severity: "warning",
        code: "HIGH_SPEED",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateSpawnZone(zone: SpawnZone): ValidationResult {
    const errors: ValidationError[] = [];

    // Check for valid vectors
    if (zone.entry.some(isNaN) || zone.exit.some(isNaN)) {
      errors.push({
        field: "spawnZone",
        message: "Spawn zone entry and exit must contain valid coordinates",
        severity: "error",
        code: "INVALID_SPAWN_COORDS",
      });
    }

    // Check variation
    if (zone.variation < 0) {
      errors.push({
        field: "spawnZone.variation",
        message: "Spawn zone variation must be non-negative",
        severity: "error",
        code: "NEGATIVE_VARIATION",
      });
    }

    // Check if entry and exit are too close
    const distance = Math.sqrt(
      Math.pow(zone.exit[0] - zone.entry[0], 2) +
        Math.pow(zone.exit[1] - zone.entry[1], 2) +
        Math.pow(zone.exit[2] - zone.entry[2], 2)
    );

    const warnings: ValidationError[] = [];
    if (distance < 5) {
      warnings.push({
        field: "spawnZone",
        message: "Spawn zone entry and exit are too close (minimum 5 units)",
        severity: "warning",
        code: "CLOSE_SPAWN_POINTS",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateSpeedConfig(speed: SpeedConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (typeof speed.min !== "number" || isNaN(speed.min) || speed.min < 0) {
      errors.push({
        field: "speed.min",
        message: "Minimum speed must be a non-negative number",
        severity: "error",
        code: "INVALID_MIN_SPEED",
      });
    }

    if (typeof speed.max !== "number" || isNaN(speed.max) || speed.max < 0) {
      errors.push({
        field: "speed.max",
        message: "Maximum speed must be a non-negative number",
        severity: "error",
        code: "INVALID_MAX_SPEED",
      });
    }

    if (speed.min >= speed.max) {
      errors.push({
        field: "speed",
        message: "Minimum speed must be less than maximum speed",
        severity: "error",
        code: "INVALID_SPEED_RANGE",
      });
    }

    if (
      speed.rotationSpeed !== undefined &&
      (isNaN(speed.rotationSpeed) || speed.rotationSpeed < 0)
    ) {
      warnings.push({
        field: "speed.rotationSpeed",
        message: "Rotation speed must be a non-negative number",
        severity: "warning",
        code: "INVALID_ROTATION_SPEED",
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async validateModelPath(path: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Basic path validation
    if (!path || typeof path !== "string") {
      errors.push({
        field: "modelPath",
        message: "Model path must be a non-empty string",
        severity: "error",
        code: "INVALID_PATH_TYPE",
      });
      return { valid: false, errors, warnings: [] };
    }

    // Check file extension
    if (!path.toLowerCase().endsWith(".glb")) {
      errors.push({
        field: "modelPath",
        message: "Model path must end with .glb extension",
        severity: "error",
        code: "INVALID_EXTENSION",
      });
    }

    // Note: In a real implementation, you might check if the file exists
    // For now, we just do basic validation

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  private validateScale(scale: [number, number, number]): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!Array.isArray(scale) || scale.length !== 3) {
      errors.push({
        field: "scale",
        message: "Scale must be an array of 3 numbers",
        severity: "error",
        code: "INVALID_SCALE_FORMAT",
      });
      return errors;
    }

    scale.forEach((value, index) => {
      if (typeof value !== "number" || isNaN(value) || value <= 0) {
        errors.push({
          field: `scale[${index}]`,
          message: `Scale value at index ${index} must be a positive number`,
          severity: "error",
          code: "INVALID_SCALE_VALUE",
        });
      }
    });

    return errors;
  }
}

/**
 * Singleton instance of the validator
 */
export const configValidator = new StarshipConfigValidator();

/**
 * Utility function to validate an array of starship configurations
 */
export function validateStarshipConfigs(
  configs: StarshipConfig[]
): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  configs.forEach((config, index) => {
    const result = configValidator.validateStarshipConfig(config);

    // Prefix field names with config index for clarity
    const prefixedErrors = result.errors.map((error) => ({
      ...error,
      field: `configs[${index}].${error.field}`,
    }));

    // Ensure warnings conform to ValidationError shape by providing defaults
    const prefixedWarnings = result.warnings.map(
      (warning: ValidationWarning) => ({
        field: `configs[${index}].${warning.field}`,
        message: warning.message,
        severity: "warning" as const,
        code: "CONFIG_WARNING",
        suggestion: warning.suggestion,
      })
    );

    allErrors.push(...prefixedErrors);
    allWarnings.push(...prefixedWarnings);
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Utility function to sanitize a starship configuration
 * Applies default values and clamps invalid values
 */
export function sanitizeStarshipConfig(
  config: Partial<StarshipConfig>
): StarshipConfig {
  return {
    id: config.id || `starship-${Date.now()}`,
    name: config.name || "Unknown Starship",
    modelPath: config.modelPath || "",
    scale: config.scale || [1, 1, 1],
    initialRotation: config.initialRotation || [0, 0, 0],
    speed: {
      min: Math.max(0, config.speed?.min ?? 0.5),
      max: Math.max(
        0,
        Math.max(config.speed?.min ?? 0.5, config.speed?.max ?? 1.0)
      ),
      rotationSpeed: config.speed?.rotationSpeed,
    },
    trajectory: config.trajectory || "linear",
    spawnZone: config.spawnZone || {
      entry: [-10, 0, 0],
      exit: [10, 0, 0],
      variation: 2,
    },
    materialOverrides: config.materialOverrides,
  };
}

/**
 * Utility function to merge starship configurations
 * Useful for applying overrides
 */
export function mergeStarshipConfigs(
  base: StarshipConfig,
  overrides: Partial<StarshipConfig>
): StarshipConfig {
  return {
    ...base,
    ...overrides,
    speed: { ...base.speed, ...overrides.speed },
    spawnZone: { ...base.spawnZone, ...overrides.spawnZone },
    materialOverrides: {
      ...base.materialOverrides,
      ...overrides.materialOverrides,
    },
  };
}
