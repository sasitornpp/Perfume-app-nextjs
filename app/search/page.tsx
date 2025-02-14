"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiltersPerfumeValues, Filters } from "@/types/perfume";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Perfume_card } from "@/components/perfume-card";
import { useSelector } from "react-redux";
import filterPerfumes from "@/utils/functions/filter_perfume";
import { RootState } from "@/redux/Store";

function Search() {
  const perfumeState = useSelector((state: RootState) => state.perfume.perfume);
  const [searchQuery, setSearchQuery] = useState(false);
  const [filters, setFilters] = useState<Filters>(FiltersPerfumeValues);
  const [visiblePerfumes, setVisiblePerfumes] = useState(100);
  const skeletonRef = useRef<HTMLDivElement | null>(null);

  const filtersPerfume = filterPerfumes(perfumeState, filters);
  const perfumesToShow = searchQuery ? filtersPerfume : perfumeState;

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
    setVisiblePerfumes(100);
  };

  const clearFilters = () => {
    setSearchQuery(false);
    setFilters(FiltersPerfumeValues);
    setVisiblePerfumes(100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePerfumes((prev) => prev + 100);
        }
      },
      { threshold: 1.0 }
    );

    if (skeletonRef.current) {
      observer.observe(skeletonRef.current);
    }

    return () => {
      if (skeletonRef.current) {
        observer.unobserve(skeletonRef.current);
      }
    };
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal" className="mt-8">
      <ResizablePanel
        className="shadow-md rounded-lg p-6 m-6 w-64"
        defaultSize={25}
      >
        <h2 className="text-xl font-semibold mb-4">Filter By</h2>
        <div className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded-md p-2"
            placeholder="Product Name"
            value={filters.searchQuery}
            onChange={(e) => handleChange("searchQuery", e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex flex-1 h-full w-full border border-foreground">
        <ScrollArea className="w-full rounded-md border p-4">
          <div className="flex flex-wrap justify-center gap-6">
            {perfumesToShow.slice(0, visiblePerfumes).map((perfume, index) => (
              <Perfume_card key={index} perfume={perfume} />
            ))}
          </div>
          <div ref={skeletonRef} className="w-full h-1"></div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Search;

