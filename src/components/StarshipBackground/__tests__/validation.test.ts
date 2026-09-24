import {
  StarshipConfigValidator,
  configValidator,
  validateStarshipConfigs,
  sanitizeStarshipConfig,
  mergeStarshipConfigs,
} from "../utils";
import type { StarshipConfig, ValidationError } from "../types";

describe("StarshipConfigValidator", () => {
  let validator: StarshipConfigValidator;

  beforeEach(() => {
    validator = new StarshipConfigValidator();
  });

  describe("validateStarshipConfig", () => {
    const validConfig: StarshipConfig = {
      id: "x-wing",
      name: "X-Wing Fighter",
      modelPath: "/models/x-wing.glb",
      scale: [1, 1, 1] as [number, number, number],
      initialRotation: [0, 0, 0] as [number, number, number],
      speed: { min: 0.5, max: 1.5 },
      trajectory: "linear",
      spawnZone: {
        entry: [-10, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: 2,
      },
    };

    it("should validate a correct configuration", () => {
      const result = validator.validateStarshipConfig(validConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should reject missing ID", () => {
      const config: StarshipConfig = { ...validConfig, id: "" };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "id",
          code: "MISSING_ID",
        })
      );
    });

    it("should reject missing name", () => {
      const config: StarshipConfig = { ...validConfig, name: "" };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "name",
          code: "MISSING_NAME",
        })
      );
    });

    it("should reject invalid model path", () => {
      const config: StarshipConfig = {
        ...validConfig,
        modelPath: "invalid.obj",
      };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          code: "INVALID_MODEL_PATH",
        })
      );
    });

    it("should reject invalid scale values", () => {
      const config = {
        ...validConfig,
        scale: [0, 1, 1] as [number, number, number],
      };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "scale[0]",
          code: "INVALID_SCALE_VALUE",
        })
      );
    });

    it("should warn about large scale values", () => {
      const config: StarshipConfig = {
        ...validConfig,
        scale: [3, 3, 3] as [number, number, number],
      };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: "scale",
          code: "LARGE_SCALE",
        })
      );
    });

    it("should warn about high speed values", () => {
      const config = { ...validConfig, speed: { min: 0.5, max: 3.0 } };

      const result = validator.validateStarshipConfig(config);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: "speed.max",
          code: "HIGH_SPEED",
        })
      );
    });
  });

  describe("validateSpawnZone", () => {
    it("should validate a correct spawn zone", () => {
      const zone = {
        entry: [-10, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: 2,
      };

      const result = validator.validateSpawnZone(zone);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid coordinates", () => {
      const zone = {
        entry: [NaN, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: 2,
      };

      const result = validator.validateSpawnZone(zone);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "spawnZone",
          code: "INVALID_SPAWN_COORDS",
        })
      );
    });

    it("should reject negative variation", () => {
      const zone = {
        entry: [-10, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: -1,
      };

      const result = validator.validateSpawnZone(zone);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "spawnZone.variation",
          code: "NEGATIVE_VARIATION",
        })
      );
    });

    it("should warn about close spawn points", () => {
      const zone = {
        entry: [0, 0, 0] as [number, number, number],
        exit: [1, 0, 0] as [number, number, number],
        variation: 2,
      };

      const result = validator.validateSpawnZone(zone);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: "spawnZone",
          code: "CLOSE_SPAWN_POINTS",
        })
      );
    });
  });

  describe("validateSpeedConfig", () => {
    it("should validate correct speed config", () => {
      const speed = { min: 0.5, max: 1.5, rotationSpeed: 0.1 };

      const result = validator.validateSpeedConfig(speed);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid min speed", () => {
      const speed = { min: -1, max: 1.5 };

      const result = validator.validateSpeedConfig(speed);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "speed.min",
          code: "INVALID_MIN_SPEED",
        })
      );
    });

    it("should reject invalid speed range", () => {
      const speed = { min: 2.0, max: 1.0 };

      const result = validator.validateSpeedConfig(speed);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "speed",
          code: "INVALID_SPEED_RANGE",
        })
      );
    });

    it("should warn about invalid rotation speed", () => {
      const speed = { min: 0.5, max: 1.5, rotationSpeed: -1 };

      const result = validator.validateSpeedConfig(speed);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: "speed.rotationSpeed",
          code: "INVALID_ROTATION_SPEED",
        })
      );
    });
  });

  describe("validateModelPath", () => {
    it("should validate correct GLB path", async () => {
      const result = await validator.validateModelPath("/models/starship.glb");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject non-GLB files", async () => {
      const result = await validator.validateModelPath("/models/starship.obj");

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          code: "INVALID_EXTENSION",
        })
      );
    });

    it("should reject empty paths", async () => {
      const result = await validator.validateModelPath("");

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: "modelPath",
          code: "INVALID_PATH_TYPE",
        })
      );
    });
  });
});

describe("validateStarshipConfigs", () => {
  it("should validate multiple configurations", () => {
    const configs: StarshipConfig[] = [
      {
        id: "x-wing",
        name: "X-Wing",
        modelPath: "/models/x-wing.glb",
        scale: [1, 1, 1] as [number, number, number],
        initialRotation: [0, 0, 0] as [number, number, number],
        speed: { min: 0.5, max: 1.5 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 0, 0] as [number, number, number],
          exit: [10, 0, 0] as [number, number, number],
          variation: 2,
        },
      },
      {
        id: "tie-fighter",
        name: "TIE Fighter",
        modelPath: "/models/tie.glb",
        scale: [1, 1, 1] as [number, number, number],
        initialRotation: [0, 0, 0] as [number, number, number],
        speed: { min: 0.3, max: 1.2 },
        trajectory: "curved",
        spawnZone: {
          entry: [10, 0, 0] as [number, number, number],
          exit: [-10, 0, 0] as [number, number, number],
          variation: 1,
        },
      },
    ];

    const result = validateStarshipConfigs(configs);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should collect errors from multiple configs", () => {
    const configs: StarshipConfig[] = [
      {
        id: "", // Invalid
        name: "X-Wing",
        modelPath: "/models/x-wing.glb",
        scale: [1, 1, 1] as [number, number, number],
        initialRotation: [0, 0, 0] as [number, number, number],
        speed: { min: 0.5, max: 1.5 },
        trajectory: "linear",
        spawnZone: {
          entry: [-10, 0, 0] as [number, number, number],
          exit: [10, 0, 0] as [number, number, number],
          variation: 2,
        },
      },
      {
        id: "tie-fighter",
        name: "", // Invalid
        modelPath: "/models/tie.obj", // Invalid
        scale: [1, 1, 1] as [number, number, number],
        initialRotation: [0, 0, 0] as [number, number, number],
        speed: { min: 0.3, max: 1.2 },
        trajectory: "curved",
        spawnZone: {
          entry: [10, 0, 0] as [number, number, number],
          exit: [-10, 0, 0] as [number, number, number],
          variation: 1,
        },
      },
    ];

    const result = validateStarshipConfigs(configs);

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3); // id, name, modelPath errors
    expect(result.errors[0].field).toBe("configs[0].id");
    expect(result.errors[1].field).toBe("configs[1].name");
    expect(result.errors[2].field).toBe("configs[1].modelPath");
  });
});

describe("sanitizeStarshipConfig", () => {
  it("should apply defaults to missing fields", () => {
    const partialConfig = {
      id: "test-ship",
      modelPath: "/models/test.glb",
    };

    const sanitized = sanitizeStarshipConfig(partialConfig);

    expect(sanitized.id).toBe("test-ship");
    expect(sanitized.name).toBe("Unknown Starship");
    expect(sanitized.scale).toEqual([1, 1, 1]);
    expect(sanitized.speed.min).toBe(0.5);
    expect(sanitized.speed.max).toBe(1.0);
  });

  it("should clamp invalid speed values", () => {
    const config = {
      id: "test",
      modelPath: "/models/test.glb",
      speed: { min: -1, max: -2 },
    };

    const sanitized = sanitizeStarshipConfig(config);

    expect(sanitized.speed.min).toBe(0);
    expect(sanitized.speed.max).toBe(0);
  });
});

describe("mergeStarshipConfigs", () => {
  const baseConfig: StarshipConfig = {
    id: "base",
    name: "Base Ship",
    modelPath: "/models/base.glb",
    scale: [1, 1, 1] as [number, number, number],
    initialRotation: [0, 0, 0] as [number, number, number],
    speed: { min: 0.5, max: 1.5 },
    trajectory: "linear",
    spawnZone: {
      entry: [-10, 0, 0] as [number, number, number],
      exit: [10, 0, 0] as [number, number, number],
      variation: 2,
    },
  };

  it("should merge configurations correctly", () => {
    const overrides = {
      name: "Override Ship",
      speed: { min: 1.0, max: 1.5 },
    };

    const merged = mergeStarshipConfigs(baseConfig, overrides);

    expect(merged.id).toBe("base");
    expect(merged.name).toBe("Override Ship");
    expect(merged.speed.min).toBe(1.0);
    expect(merged.speed.max).toBe(1.5); // Preserved from base
  });

  it("should deeply merge nested objects", () => {
    const overrides = {
      spawnZone: {
        entry: [-10, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: 5,
      },
      speed: { min: 0.5, max: 2.0 },
    };

    const merged = mergeStarshipConfigs(baseConfig, overrides);

    expect(merged.spawnZone.entry).toEqual([-10, 0, 0]); // Preserved
    expect(merged.spawnZone.variation).toBe(5); // Overridden
    expect(merged.speed.min).toBe(0.5); // Overridden
    expect(merged.speed.max).toBe(2.0); // Overridden
  });
});

describe("configValidator singleton", () => {
  it("should be an instance of StarshipConfigValidator", () => {
    expect(configValidator).toBeInstanceOf(StarshipConfigValidator);
  });

  it("should validate configurations", () => {
    const config: StarshipConfig = {
      id: "test",
      name: "Test Ship",
      modelPath: "/models/test.glb",
      scale: [1, 1, 1] as [number, number, number],
      initialRotation: [0, 0, 0] as [number, number, number],
      speed: { min: 0.5, max: 1.5 },
      trajectory: "linear",
      spawnZone: {
        entry: [-10, 0, 0] as [number, number, number],
        exit: [10, 0, 0] as [number, number, number],
        variation: 2,
      },
    };

    const result = configValidator.validateStarshipConfig(config);

    expect(result.valid).toBe(true);
  });
});
