import React, { useState } from "react";
import type {
  DebugControlsProps,
  StarshipConfig,
  Vector3,
  SpeedConfig,
  SpawnZone,
} from "./types";

/**
 * Debug controls component for real-time starship configuration.
 * Provides UI controls for adjusting position, rotation, scale, and other properties.
 */
export const DebugControls: React.FC<DebugControlsProps> = ({
  instances,
  onConfigChange,
  onExportConfig,
  onToggleTrajectories,
  onToggleStats,
}) => {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  );
  const [showTrajectories, setShowTrajectories] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const selectedInstance = instances.find(
    (inst) => inst.id === selectedInstanceId
  );

  const handleInstanceSelect = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
  };

  const handleConfigUpdate = (field: keyof StarshipConfig, value: unknown) => {
    if (!selectedInstance) return;

    const updatedConfig = { ...selectedInstance.config };

    // Handle nested updates based on field type
    if (field === "scale" || field === "initialRotation") {
      updatedConfig[field] = value as Vector3;
    } else if (field === "speed") {
      updatedConfig.speed = {
        ...updatedConfig.speed,
        ...(value as Partial<SpeedConfig>),
      };
    } else if (field === "spawnZone") {
      updatedConfig.spawnZone = {
        ...updatedConfig.spawnZone,
        ...(value as Partial<SpawnZone>),
      };
    } else {
      (updatedConfig as Record<string, unknown>)[field] = value;
    }

    onConfigChange(selectedInstance.id, updatedConfig);
  };

  const handleExport = () => {
    onExportConfig();
  };

  const handleToggleTrajectories = () => {
    const newState = !showTrajectories;
    setShowTrajectories(newState);
    onToggleTrajectories();
  };

  const handleToggleStats = () => {
    const newState = !showStats;
    setShowStats(newState);
    onToggleStats();
  };

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-lg max-w-sm max-h-screen overflow-y-auto z-50">
      <h3 className="text-lg font-bold mb-4 text-blue-400">Debug Controls</h3>

      {/* Instance Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Starship:
        </label>
        <select
          value={selectedInstanceId || ""}
          onChange={(e) => handleInstanceSelect(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="">Select a starship...</option>
          {instances.map((instance) => (
            <option key={instance.id} value={instance.id}>
              {instance.config.name} ({instance.id.slice(-8)})
            </option>
          ))}
        </select>
      </div>

      {/* Configuration Controls */}
      {selectedInstance && (
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-green-400">
            Configuration
          </h4>

          {/* Scale Controls */}
          <div>
            <label className="block text-sm font-medium mb-1">Scale:</label>
            <div className="grid grid-cols-3 gap-2">
              {["X", "Y", "Z"].map((axis, index) => (
                <div key={axis}>
                  <label className="text-xs text-gray-400">{axis}:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={selectedInstance.config.scale[index]}
                    onChange={(e) => {
                      const newScale = [
                        ...selectedInstance.config.scale,
                      ] as Vector3;
                      newScale[index] = parseFloat(e.target.value) || 1;
                      handleConfigUpdate("scale", newScale);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation Controls */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Rotation:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["X", "Y", "Z"].map((axis, index) => (
                <div key={axis}>
                  <label className="text-xs text-gray-400">{axis}:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedInstance.config.initialRotation[index]}
                    onChange={(e) => {
                      const newRotation = [
                        ...selectedInstance.config.initialRotation,
                      ] as Vector3;
                      newRotation[index] = parseFloat(e.target.value) || 0;
                      handleConfigUpdate("initialRotation", newRotation);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Speed Controls */}
          <div>
            <label className="block text-sm font-medium mb-1">Speed:</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Min:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedInstance.config.speed.min}
                  onChange={(e) =>
                    handleConfigUpdate("speed", {
                      min: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Max:</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedInstance.config.speed.max}
                  onChange={(e) =>
                    handleConfigUpdate("speed", {
                      max: parseFloat(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Trajectory Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Trajectory:
            </label>
            <select
              value={selectedInstance.config.trajectory}
              onChange={(e) => handleConfigUpdate("trajectory", e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="linear">Linear</option>
              <option value="curved">Curved</option>
              <option value="spiral">Spiral</option>
              <option value="diagonal">Diagonal</option>
            </select>
          </div>
        </div>
      )}

      {/* Global Controls */}
      <div className="mt-6 space-y-2">
        <h4 className="text-md font-semibold text-yellow-400">
          Global Controls
        </h4>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-trajectories"
            checked={showTrajectories}
            onChange={handleToggleTrajectories}
            className="rounded"
          />
          <label htmlFor="show-trajectories" className="text-sm">
            Show Trajectories
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-stats"
            checked={showStats}
            onChange={handleToggleStats}
            className="rounded"
          />
          <label htmlFor="show-stats" className="text-sm">
            Show Performance Stats
          </label>
        </div>

        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Export Configuration
        </button>
      </div>

      {/* Instance Count */}
      <div className="mt-4 text-sm text-gray-400">
        Active Instances: {instances.length}
      </div>
    </div>
  );
};
