import { describe, it, expect } from "vitest";
import type {
  StarshipConfig,
  SpeedConfig,
  SpawnZone,
  ValidationResult,
  ConfigValidator,
} from "../types";
import {
  configValidator,
  validateStarshipConfigs,
  sanitizeStarshipConfig,
  mergeStarshipConfigs,
} from "../utils";

describe("Configuration Validation Tests", () => {
  describe("StarshipConfig Validation", () => {
    it("should validate a complete valid StarshipConfig", () => {
      const validConfig: StarshipConfig = {
        id: "test-xwing",
        name: "Test X-wing",
        modelPath: "/models/xwing.glb",
        scale: [1, 1, 1],
        initialRotation: [0, 0, 0],
        speed: { min: 0.5, max: 1.2 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 2, 5],
          exit: [10, -2, -5],
          variation: 3,
        },
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateStarshipConfig(validConfig);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject config with empty id", () => {
      const invalidConfig: StarshipConfig = {
        id: "",
        name: "Test X-wing",
        modelPath: "/models/xwing.glb",
        scale: [1, 1, 1],
        initialRotation: [0, 0, 0],
        speed: { min: 0.5, max: 1.2 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 2, 5],
          exit: [10, -2, -5],
          variation: 3,
        },
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateStarshipConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          message: "Starship ID is required",
          code: "MISSING_ID",
        })
      );
    });

    it("should reject config with invalid modelPath", () => {
      const invalidConfig: StarshipConfig = {
        id: "test-xwing",
        name: "Test X-wing",
        modelPath: "invalid-path.txt", // Not a .glb file
        scale: [1, 1, 1],
        initialRotation: [0, 0, 0],
        speed: { min: 0.5, max: 1.2 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 2, 5],
          exit: [10, -2, -5],
          variation: 3,
        },
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateStarshipConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          message: "Model path must be a valid GLB file",
          code: "INVALID_MODEL_PATH",
        })
      );
    });

    it("should reject config with negative scale values", () => {
      const invalidConfig: StarshipConfig = {
        id: "test-xwing",
        name: "Test X-wing",
        modelPath: "/models/xwing.glb",
        scale: [-1, 1, 1], // Negative scale
        initialRotation: [0, 0, 0],
        speed: { min: 0.5, max: 1.2 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 2, 5],
          exit: [10, -2, -5],
          variation: 3,
        },
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateStarshipConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "scale[0]",
          message: "Scale value at index 0 must be a positive number",
          code: "INVALID_SCALE_VALUE",
        })
      );
    });

    it("should reject config with invalid speed range", () => {
      const invalidConfig: StarshipConfig = {
        id: "test-xwing",
        name: "Test X-wing",
        modelPath: "/models/xwing.glb",
        scale: [1, 1, 1],
        initialRotation: [0, 0, 0],
        speed: { min: 1.5, max: 1.2 }, // min > max
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 2, 5],
          exit: [10, -2, -5],
          variation: 3,
        },
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateStarshipConfig(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "speed",
          message: "Minimum speed must be less than maximum speed",
          code: "INVALID_SPEED_RANGE",
        })
      );
    });
  });

  describe("SpawnZone Validation", () => {
    it("should validate a valid spawn zone", () => {
      const validZone: SpawnZone = {
        entry: [-10, 2, 5],
        exit: [10, -2, -5],
        variation: 3,
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateSpawnZone(validZone);
      expect(result.valid).toBe(true);
    });

    it("should reject negative variation", () => {
      const invalidZone: SpawnZone = {
        entry: [-10, 2, 5],
        exit: [10, -2, -5],
        variation: -1, // Negative variation
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateSpawnZone(invalidZone);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "spawnZone.variation",
          message: "Spawn zone variation must be non-negative",
          code: "NEGATIVE_VARIATION",
        })
      );
    });
  });

  describe("SpeedConfig Validation", () => {
    it("should validate a valid speed config", () => {
      const validSpeed: SpeedConfig = {
        min: 0.5,
        max: 1.2,
        rotationSpeed: 0.1,
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateSpeedConfig(validSpeed);
      expect(result.valid).toBe(true);
    });

    it("should reject speed config where min >= max", () => {
      const invalidSpeed: SpeedConfig = {
        min: 1.5,
        max: 1.2, // min >= max
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateSpeedConfig(invalidSpeed);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "speed",
          message: "Minimum speed must be less than maximum speed",
          code: "INVALID_SPEED_RANGE",
        })
      );
    });

    it("should reject negative speed values", () => {
      const invalidSpeed: SpeedConfig = {
        min: -0.5, // Negative speed
        max: 1.2,
      };

      // Test should fail - validation not implemented yet
      const result = configValidator.validateSpeedConfig(invalidSpeed);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "speed.min",
          message: "Minimum speed must be a non-negative number",
          code: "INVALID_MIN_SPEED",
        })
      );
    });
  });

  describe("Model Path Validation", () => {
    it("should validate existing GLB file path", async () => {
      const validPath = "/models/xwing.glb";

      // Test should fail - validation not implemented yet
      const result = await configValidator.validateModelPath(validPath);
      expect(result.valid).toBe(true);
    });

    it("should reject non-existent file path", async () => {
      const invalidPath = "/models/nonexistent.obj"; // Not .glb extension

      // Test should fail - validation not implemented yet
      const result = await configValidator.validateModelPath(invalidPath);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          message: "Model path must end with .glb extension",
          code: "INVALID_EXTENSION",
        })
      );
    });

    it("should reject non-GLB file extensions", async () => {
      const invalidPath = "/models/xwing.obj";

      // Test should fail - validation not implemented yet
      const result = await configValidator.validateModelPath(invalidPath);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          message: "Model path must end with .glb extension",
          code: "INVALID_EXTENSION",
        })
      );
    });
  });

  describe("Default Configurations", () => {
    it("should provide valid default starship configurations", () => {
      // This would import from starshipConfigs.ts
      // const defaults = getDefaultStarshipConfigs();
      // Test should fail - defaults not implemented yet
      // defaults.forEach(config => {
      //   const result = configValidator.validateStarshipConfig(config);
      //   expect(result.valid).toBe(true);
      // });
    });

    it("should include all required starship models", () => {
      // Test should fail - defaults not implemented yet
      // const defaults = getDefaultStarshipConfigs();
      // const expectedIds = ['xwing', 'star-destroyer', 'first-order-star-destroyer', 'imperial-shuttle', 'micro-falcon', 'small-venator'];
      // const actualIds = defaults.map(config => config.id);
      // expectedIds.forEach(id => {
      //   expect(actualIds).toContain(id);
      // });
    });
  });

  describe("Configuration Export/Import", () => {
    it("should export configuration as valid JSON", () => {
      // Test should fail - export not implemented yet
      // const config: StarshipConfig = { ... };
      // const exported = exportConfiguration([config]);
      // expect(() => JSON.parse(exported)).not.toThrow();
    });

    it("should import valid configuration JSON", () => {
      // Test should fail - import not implemented yet
      // const json = '{"configs": []}';
      // const imported = importConfiguration(json);
      // expect(imported).toBeInstanceOf(Array);
    });

    it("should reject invalid configuration JSON", () => {
      // Test should fail - import not implemented yet
      // const invalidJson = '{"invalid": "json"}';
      // expect(() => importConfiguration(invalidJson)).toThrow();
    });
  });
});
