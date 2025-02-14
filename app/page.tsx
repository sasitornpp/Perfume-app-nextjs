"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Separator } from "@/components/ui/separator";
import { Perfume } from "@/types/perfume";

const Home: React.FC = () => {
  const perfumes = useSelector((state: RootState) => state.perfume.perfume);
  // console.log(perfumes);
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Carousel
        className="w-full max-w-md border rounded-lg mt-16"
        plugins={[
          Autoplay({
            delay: 2500,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {perfumes &&
            [...perfumes]
              .sort(() => 0.5 - Math.random())
              .slice(0, 5)
              .map((perfume: Perfume, index: number) => {
                const shuffledAccords: string[] = Array.isArray(perfume.accords)
                  ? [...perfume.accords]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 4)
                  : [];
                return (
                  <CarouselItem key={index} className="h-96">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col aspect-square p-6">
                          <div className="justify-center items-center flex-1 flex flex-row w-full">
                            <Image
                              src={perfume.images[0]}
                              alt="perfume"
                              width={100}
                              height={100}
                            />
                          </div>
                          <div className="flex flex-1 flex-col w-full p-2">
                            <span className="text-lg font-semibold">
                              {perfume.name}
                            </span>
                            <span className="text-sm">{perfume.brand}</span>
                            <span className="text-sm">
                              {perfume.descriptions?.length > 100
                                ? `${perfume.descriptions.substring(0, 100)}...`
                                : perfume.descriptions || ""}
                            </span>
                            <div className="flex flex-row flex-wrap">
                              {shuffledAccords.map(
                                (accord: string, index: number) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-200 rounded-full px-2 py-1 m-1"
                                  >
                                    {accord}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Separator className="my-16 w-full" />
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col p-6">
          <Button className="w-full h-12 mb-12 text-xl">
        <Link href="/survey-form">Find Your Perfect Perfume</Link>
          </Button>
          <Button className="w-full h-12 mb-4 text-xl">
        <Link href="/search">Search Perfumes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
