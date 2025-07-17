"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CoolKidsVideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] p-6">
      <Card className="w-full max-w-4xl border border-border shadow-lg rounded-xl">
        <CardHeader />
        <CardContent
          className="relative bg-black rounded-lg overflow-hidden p-0"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            className="w-full h-full absolute top-0 left-0"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </CardContent>
      </Card>
    </div>
  );
}
