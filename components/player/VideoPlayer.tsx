"use client";

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

export default function VideoPlayer({
  src,
  poster,
}: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-black shadow-2xl border border-zinc-800">
      <video
        className="aspect-video w-full"
        controls
        controlsList="nodownload"
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}