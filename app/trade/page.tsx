"use client";

import React, { useState, useRef } from "react";
import { FiltersPerfumeValues, Perfume, Filters } from "@/types/perfume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Perfume_card } from "@/components/perfume-card";
import { useSelector } from "react-redux";
import filterPerfumes from "@/utils/functions/filter_perfume";
import { RootState } from "@/redux/Store";
import Link from "next/link";

function Trade() {
  const perfumeState = useSelector(
    (state: RootState) => state.perfume.tradeable_perfume
  );
  const [searchQuery, setSearchQuery] = useState(false);
  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<Filters>(FiltersPerfumeValues);
  const filtersPerfume = filterPerfumes(perfumeState, filters);

  type HandleChange = (key: keyof Filters, value: string | string[]) => void;

  const handleChange: HandleChange = (key, value) => {
    setSearchQuery(true);
    if (filters.searchQuery === "") {
      setSearchQuery(false);
    }
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setSearchQuery(false);
    setFilters(FiltersPerfumeValues);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="mt-8">
      <ResizablePanel
        className="shadow-md rounded-lg p-6 m-6 w-64 h-full"
        defaultSize={25}
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">กรองโดย</h2>
          <div className="flex flex-col gap-4">
            <input
              className="border border-gray-300 rounded-md p-2"
              placeholder="ชื่อสินค้า"
              value={filters.searchQuery}
              onChange={(e) => handleChange("searchQuery", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Link href={"trade/create"}>
            <Button onClick={clearFilters} className="w-full mt-16">
              ลงสินค้า
            </Button>
          </Link>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex flex-1 h-full w-full border border-foreground">
        <ScrollArea className="w-full rounded-md border p-4 h-screen">
          {filtersPerfume.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              ไม่มีข้อมูลเพิ่มเติมแล้ว
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {searchQuery
                ? filtersPerfume.map((perfume, index) => (
                    <Perfume_card key={index} perfume={perfume} />
                  ))
                : perfumeState.map((perfume, index) => (
                    <Perfume_card key={index} perfume={perfume} />
                  ))}
            </div>
          )}
          <div ref={skeletonRef} className="w-full h-1"></div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Trade;
