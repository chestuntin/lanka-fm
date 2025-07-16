"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CoolKidsVideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] p-6">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Cool Kids Video</CardTitle>
        </CardHeader>
        <CardContent className="aspect-video bg-black rounded-lg overflow-hidden p-0">
          <iframe
            className="w-full h-full"
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
