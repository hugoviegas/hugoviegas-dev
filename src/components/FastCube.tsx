type CubeProps = { w?: number; h?: number };

export default function FastCube({ w = 250, h = 250 }: CubeProps) {
  const src = `https://ruwix.com/widget/3d/?flags=startsolved&alg=R`;
  return (
    <iframe
      src={src}
      width={w}
      height={h}
      loading="lazy"
      style={{ border: 0, background: "transparent" }}
      scrolling="no"
      title="Rubik's Cube"
      className="rounded-xl shadow-lg"
    />
  );
}
