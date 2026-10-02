// Flat face tones for drawn LEGO bricks. Each set defines the custom
// properties IsoBrick and FlatBrick read: top, left, right, stud cap, edge
// highlight and outline. In dark theme the outline turns black and dark gray
// lifts one step so it stays visible on the dark page.
export type BrickColor = "green" | "white" | "lightGray" | "darkGray" | "gold";

export const brickColorClass: Record<BrickColor, string> = {
  green:
    "[--bt:#14b85a] [--bl:#0c9a49] [--br:#077a39] [--bs:#22c96a] [--be:#7fe0a8] [--bo:#055c2b] dark:[--bo:#000]",
  white:
    "[--bt:#ffffff] [--bl:#ececea] [--br:#d3d3cf] [--bs:#ffffff] [--be:#ffffff] [--bo:#b9b9b4] dark:[--bo:#000]",
  lightGray:
    "[--bt:#c4c8cc] [--bl:#a9aeb3] [--br:#8d9399] [--bs:#d3d6d9] [--be:#e6e8ea] [--bo:#6f757b] dark:[--bo:#000]",
  darkGray:
    "[--bt:#6f767d] [--bl:#596067] [--br:#454b51] [--bs:#7d848b] [--be:#9aa1a8] [--bo:#2e3236] dark:[--bt:#7a828a] dark:[--bl:#636a72] dark:[--br:#4d535a] dark:[--bs:#89919a] dark:[--be:#b0b7be] dark:[--bo:#000]",
  // Gold is reserved for coin markers.
  gold: "[--bt:#f6c22e] [--bl:#e0a812] [--br:#b8860b] [--bs:#ffd75e] [--be:#fff0b3] [--bo:#8a6408] dark:[--bo:#000]",
};
