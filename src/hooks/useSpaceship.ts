import { useCallback, useSyncExternalStore } from "react";

// Visitor preference for the background WebGL X-wing. Off by default and only
// switched on by an explicit click on the spaceship control.
const KEY = "spaceship";
let enabled = false;
const listeners = new Set<() => void>();

try {
  enabled = localStorage.getItem(KEY) === "on";
} catch {
  // Storage unavailable: keep the default (off).
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => enabled;

export const setSpaceshipEnabled = (next: boolean) => {
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    // Ignore: the preference just won't persist.
  }
  listeners.forEach((l) => l());
};

export function useSpaceship() {
  const on = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const toggle = useCallback(() => setSpaceshipEnabled(!getSnapshot()), []);
  return { enabled: on, toggle, setEnabled: setSpaceshipEnabled };
}
