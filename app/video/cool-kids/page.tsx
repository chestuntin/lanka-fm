"use client";

export default function CoolKidsVideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Cool Kids Video</h1>
      <div className="w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
