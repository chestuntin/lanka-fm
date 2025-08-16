// app/page.tsx  (assuming /app dir setup)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Youtube, Twitter, Globe, Music } from "lucide-react";
import Link from "next/link";

export default function LinksPage() {
  const links = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/kultjur.lk",
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@kultjur",
      icon: <Music className="w-5 h-5" />,
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/kultjur",
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@kultjurrr",
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      name: "Website",
      url: "https://kultjur.lk",
      icon: <Globe className="w-5 h-5" />,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-8">KULTJUR®</h1>
      <div className="w-full max-w-sm flex flex-col gap-4">
        {links.map((link) => (
          <Card key={link.name} className="bg-zinc-900 border border-zinc-700">
            <CardContent className="p-0">
              <Link
                href={link.url}
                target="_blank"
                className="flex items-center gap-3 p-4 hover:bg-zinc-800 rounded-xl transition"
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-xs text-zinc-500">
        © {new Date().getFullYear()} KULTJUR
      </p>
    </main>
  );
}
