"use client"; // Since Carousel is a client component

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function CarouselTest() {
  return (
    <div className="p-4">
      <h1>Test Carousel</h1>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          <CarouselItem>
            <div className="p-4 bg-blue-100">Slide 1</div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-4 bg-red-100">Slide 2</div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-4 bg-green-100">Slide 3</div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
