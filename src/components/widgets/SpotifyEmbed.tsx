import React from "react";

type Props = {
  playlistId: string;
  height?: number;
  title?: string;
  // if true, iframe loads when it becomes visible; otherwise user must click to load
  autoLoad?: boolean;
};

const SpotifyEmbed: React.FC<Props> = ({ playlistId, height = 352, title = "Spotify Playlist", autoLoad = true }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!autoLoad) return;
    if (!ref.current) return;

    const el = ref.current;
    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setLoaded(true);
              observer?.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      );
      observer.observe(el);
    } else {
      // fallback: load immediately
      setLoaded(true);
    }

    return () => observer?.disconnect();
  }, [autoLoad]);

  const src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(
    playlistId
  )}?utm_source=generator&theme=0`;

  return (
    <div ref={ref} className="w-full">
      {!loaded ? (
        <div className="w-full h-[352px] flex items-center justify-center bg-muted/5 rounded-xl">
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-3 justify-center">
              <button
                className="btn btn-primary"
                onClick={() => setLoaded(true)}
                aria-label="Load Spotify playlist"
              >
                Load playlist
              </button>
              <span className="text-xs text-muted-foreground">Click to load player</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl overflow-hidden">
          <iframe
            data-testid="embed-iframe"
            title={title}
            style={{ borderRadius: 12 }}
            src={src}
            width="100%"
            height={height}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default SpotifyEmbed;
