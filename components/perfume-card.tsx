import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Perfume, TradablePerfume } from "@/types/perfume";
import { Skeleton } from "@/components/ui/skeleton";

export function Perfume_card({
  perfume,
}: {
  perfume: Perfume | TradablePerfume;
}) {
  const shuffledAccords = Array.isArray(perfume.accords)
    ? [...perfume.accords].slice(0, 4)
    : [];
  return (
    <Card className="w-full max-w-xs border border-gray-200 rounded-md shadow-md p-4 hover:shadow-lg transition-shadow">
      <CardContent className="flex flex-col aspect-square p-6">
        {/* รูปสินค้า */}
        <div className="justify-center items-center flex-1 flex flex-row w-full">
          {typeof perfume.images[0] === "string" &&
            perfume.images[0] !== "" && (
              <Image
                src={perfume.images[0]}
                alt={perfume.name}
                width={100}
                height={133}
                className="rounded-md object-cover aspect-[100/133]"
                priority
              />
            )}
        </div>
        {/* ข้อมูลสินค้า */}
        <div className="flex flex-1 flex-col w-full p-2">
          <span className="text-lg font-semibold">{perfume.name}</span>
          <span className="text-sm text-gray-500">{perfume.brand}</span>
          <span className="text-sm text-gray-700">
            {perfume.descriptions?.length > 100
              ? `${perfume.descriptions.substring(0, 100)}...`
              : perfume.descriptions || ""}
          </span>
          <div className="flex flex-row flex-wrap mt-2">
            {shuffledAccords &&
              shuffledAccords.map((accord, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 rounded-full px-2 py-1 m-1"
                >
                  {accord}
                </span>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Perfume_card_skeleton() {
  return (
    <Card className="w-full max-w-xs border border-gray-200 rounded-md shadow-md p-4">
      <CardContent className="flex flex-col aspect-square p-6">
        {/* Skeleton รูปสินค้า */}
        <div className="justify-center items-center flex-1 flex flex-row w-full">
          <Skeleton className="w-24 h-24 rounded-md" />
        </div>
        {/* Skeleton ข้อมูลสินค้า */}
        <div className="flex flex-1 flex-col w-full p-2">
          <Skeleton className="h-6 w-3/4 mb-2" /> {/* ชื่อสินค้า */}
          <Skeleton className="h-4 w-1/2 mb-2" /> {/* แบรนด์ */}
          <Skeleton className="h-4 w-full mb-2" /> {/* คำอธิบาย */}
          <div className="flex flex-row flex-wrap mt-2 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-16 rounded-full" />
            ))}{" "}
            {/* Accord Tags */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
