import React, { useState } from "react";
import StarshipBackground from "../components/StarshipBackground";
import type { StarshipConfig } from "../components/StarshipBackground/types";

/**
 * StarshipDemo page - Dedicated demo page for testing the StarshipBackground component.
 * Provides controls for testing different configurations and debug features.
 */
export default function StarshipDemo() {
  const [maxConcurrent, setMaxConcurrent] = useState(3); // Reduced from 6
  const [debugMode, setDebugMode] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const [customConfigs, setCustomConfigs] = useState<
    StarshipConfig[] | undefined
  >(undefined);

  const handleStarshipClick = (id: string) => {
    console.log("Starship clicked:", id);
  };

  const handleLoadingChange = (loading: boolean) => {
    console.log("Loading state changed:", loading);
  };

  const handleError = (error: Error) => {
    console.error("Starship error:", error);
  };

  const resetToDefaults = () => {
    setMaxConcurrent(6);
    setDebugMode(false);
    setBackgroundOpacity(0.3);
    setCustomConfigs(undefined);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Star Wars Starship Background Demo
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Experience animated Star Wars starships flying across the
            background. Use the controls below to customize the experience.
          </p>

          {/* Control Panel */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Demo Controls
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Max Concurrent */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Concurrent Ships: {maxConcurrent}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5" // Reduced from 8
                  value={maxConcurrent}
                  onChange={(e) => setMaxConcurrent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Background Opacity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Opacity: {(backgroundOpacity * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={backgroundOpacity}
                  onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Debug Mode */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="debug-mode"
                  checked={debugMode}
                  onChange={(e) => setDebugMode(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="debug-mode"
                  className="text-sm font-medium text-gray-300"
                >
                  Debug Mode
                </label>
              </div>

              {/* Reset Button */}
              <div>
                <button
                  onClick={resetToDefaults}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Debug Mode Info */}
            {debugMode && (
              <div className="mt-4 p-3 bg-yellow-900 bg-opacity-50 rounded border border-yellow-600">
                <p className="text-yellow-200 text-sm">
                  <strong>Debug Mode Enabled:</strong> Use the control panel in
                  the top-right to adjust individual starship configurations.
                  Click on starships to select them. Performance stats are shown
                  in the top-left.
                </p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              About This Demo
            </h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>
                • Features 6 different Star Wars starship models with unique
                configurations
              </p>
              <p>
                • Models include X-wing, Star Destroyer, Imperial Shuttle, and
                more
              </p>
              <p>
                • Each starship follows randomized flight patterns and speeds
              </p>
              <p>• Performance optimized for smooth 60fps animation</p>
              <p>• Responsive design adapts to different screen sizes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Starship Background */}
      <StarshipBackground
        configs={customConfigs}
        maxConcurrent={maxConcurrent}
        debugMode={debugMode}
        backgroundOpacity={backgroundOpacity}
        onStarshipClick={handleStarshipClick}
        onLoadingChange={handleLoadingChange}
        onError={handleError}
        className="fixed inset-0"
      />

      {/* Footer */}
      <div className="relative z-10 p-6 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Built with React Three Fiber • Models from Lego Star Wars collection
          </p>
        </div>
      </div>
    </div>
  );
}
