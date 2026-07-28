"use client";

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

function getYouTubeVideoId(value: string) {
  if (!value) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").split("?")[0];
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
      }

      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export default function VideoPlayer({
  src,
}: VideoPlayerProps) {
  const videoId = getYouTubeVideoId(src);

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 px-6 text-center shadow-2xl">
        <p className="text-sm text-zinc-400">
          O vídeo desta aula ainda não está disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="Vídeo da aula"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}