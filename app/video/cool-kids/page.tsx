"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function CoolKidsVideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] p-6">
      <div className="w-full max-w-3xl mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/video">Video</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cool Kids</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card className="w-full max-w-3xl shadow-2xl border-2 border-primary rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Cool Kids Video</CardTitle>
          <CardDescription className="text-lg mt-2">
            A fun and inspiring video for cool kids everywhere!
          </CardDescription>
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
        <CardFooter className="flex justify-end gap-2">
          <Button asChild variant="secondary">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
