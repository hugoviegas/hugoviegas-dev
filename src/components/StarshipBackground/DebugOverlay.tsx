import React from "react";
import type {
  DebugOverlayProps,
  StarshipInstance,
  PerformanceStats,
} from "./types";

/**
 * Debug overlay component that displays information over the 3D scene.
 * Shows trajectories, bounding boxes, and other debug visualizations.
 */
export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  instances,
  showTrajectories,
  showStats,
  performanceStats,
}) => {
  return (
    <>
      {/* Trajectory Lines */}
      {showTrajectories &&
        instances.map((instance) => (
          <TrajectoryLine
            key={`trajectory-${instance.id}`}
            instance={instance}
          />
        ))}

      {/* Bounding Boxes */}
      {showTrajectories &&
        instances.map((instance) => (
          <BoundingBox key={`bbox-${instance.id}`} instance={instance} />
        ))}

      {/* Position Indicators */}
      {instances.map((instance) => (
        <PositionIndicator key={`pos-${instance.id}`} instance={instance} />
      ))}

      {/* Performance Stats Overlay */}
      {showStats && (
        <StatsOverlay
          performanceStats={performanceStats}
          instanceCount={instances.length}
        />
      )}
    </>
  );
};

/**
 * Component for rendering trajectory lines
 */
const TrajectoryLine: React.FC<{ instance: StarshipInstance }> = ({
  instance,
}) => {
  const { spawnZone } = instance.config;

  // Create points for the trajectory line
  const points = [];
  const steps = 20;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = spawnZone.entry[0] + (spawnZone.exit[0] - spawnZone.entry[0]) * t;
    const y = spawnZone.entry[1] + (spawnZone.exit[1] - spawnZone.entry[1]) * t;
    const z = spawnZone.entry[2] + (spawnZone.exit[2] - spawnZone.entry[2]) * t;
    points.push(x, y, z);
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={steps + 1}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={0x00ff00} linewidth={2} />
    </line>
  );
};

/**
 * Component for rendering bounding boxes
 */
const BoundingBox: React.FC<{ instance: StarshipInstance }> = ({
  instance,
}) => {
  const { position } = instance.state;
  const { scale } = instance.config;

  // Calculate bounding box size based on scale
  const boxSize = Math.max(...scale) * 2;

  return (
    <mesh position={position}>
      <boxGeometry args={[boxSize, boxSize, boxSize]} />
      <meshBasicMaterial color={0xff0000} wireframe transparent opacity={0.3} />
    </mesh>
  );
};

/**
 * Component for rendering position indicators
 */
const PositionIndicator: React.FC<{ instance: StarshipInstance }> = ({
  instance,
}) => {
  const { position } = instance.state;

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color={0xffff00} />
    </mesh>
  );
};

/**
 * Performance stats overlay component
 */
const StatsOverlay: React.FC<{
  performanceStats: PerformanceStats;
  instanceCount: number;
}> = ({ performanceStats, instanceCount }) => {
  const fpsColor =
    performanceStats.fps >= 50
      ? "text-green-400"
      : performanceStats.fps >= 30
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded font-mono text-sm z-20">
      <div className={`font-bold ${fpsColor}`}>FPS: {performanceStats.fps}</div>
      <div>Frame Time: {performanceStats.frameTime.toFixed(2)}ms</div>
      <div>Active Ships: {instanceCount}</div>
      <div>
        Memory:{" "}
        {performanceStats.memoryUsage
          ? `${(performanceStats.memoryUsage / 1024 / 1024).toFixed(1)}MB`
          : "N/A"}
      </div>
    </div>
  );
};
