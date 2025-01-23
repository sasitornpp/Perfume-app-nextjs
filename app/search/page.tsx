"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FetchPerfumeWithFilters } from "@/utils/api/actions-client/perfume";
import { FiltersPerfumeValues, Perfume, Filters } from "@/types/perfume";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Perfume_card, Perfume_card_skeleton } from "@/components/perfume-card";

function Search() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(false);
  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const [filtersPerfume, setfiltersPerfume] = useState<Perfume[]>([]);
  const [filters, setFilters] = useState<Filters>(FiltersPerfumeValues);

  // console.log("filtersPerfume", filtersPerfume);
  // console.log("perfume", perfumes);
  // console.log("filters", filters);
  console.log(searchQuery && filters.searchQuery !== "");

  // ฟังก์ชันสำหรับดึงข้อมูล
  const fetchData = useCallback(
    async (page: number) => {
      try {
        const { data: perfumesResult } = await FetchPerfumeWithFilters(
          filters.searchQuery,
          page,
          filters.gender,
          filters.accords,
          filters.top_notes,
          filters.middle_notes,
          filters.base_notes
        );
        if (perfumesResult && perfumesResult.length > 0) {
          if (searchQuery) {
            setfiltersPerfume(perfumesResult || []);
          } else {
            setPerfumes((prev) => [...prev, ...(perfumesResult || [])]);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching perfumes:", error);
      }
    },
    [filters, searchQuery]
  );

  useEffect(() => {
    // console.log("fetching data");
    fetchData(page);
  }, [page, fetchData, filters]);

  useEffect(() => {
    if (!skeletonRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1); // เพิ่มหน้าถัดไปเมื่อ Skeleton เข้าหน้าจอ
        }
      },
      { threshold: 0.1 } // ตรวจจับเมื่อ Skeleton ทั้งหมดเข้ามาในมุมมอง
    );

    observer.observe(skeletonRef.current);

    return () => {
      if (skeletonRef.current) {
        observer.unobserve(skeletonRef.current);
      }
    };
  }, [hasMore]);

  type HandleChange = (key: keyof Filters, value: string | string[]) => void;

  const handleChange: HandleChange = (key, value) => {
    setSearchQuery(true);
    setHasMore(true);
    setPage(1);
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
    setHasMore(true);
    setPage(1);
    setFilters(FiltersPerfumeValues);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Search Filters */}
      <ResizablePanel
        className="shadow-md rounded-lg p-6 m-6 w-64"
        defaultSize={25}
      >
        <h2 className="text-xl font-semibold mb-4">กรองโดย</h2>
        <div className="flex flex-col gap-4">
          {/* ชื่อสินค้า */}
          <input
            className="border border-gray-300 rounded-md p-2"
            placeholder="ชื่อสินค้า"
            value={filters.searchQuery}
            onChange={(e) => handleChange("searchQuery", e.target.value)}
          />

          {/* เพศ */}
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">เพศ</option>
            <option value="women">หญิง</option>
            <option value="men">ชาย</option>
            <option value="for women and men">Unisex</option>
          </select>

          {/* แบรนด์ */}
          <select
            className="border border-gray-300 rounded-md p-2"
            value={filters.band}
            onChange={(e) => handleChange("band", e.target.value)}
          >
            <option value="">แบรนด์</option>
            <option value="แบรนด์ A">แบรนด์ A</option>
            <option value="แบรนด์ B">แบรนด์ B</option>
            <option value="แบรนด์ C">แบรนด์ C</option>
          </select>
        </div>

        {/* ปุ่มล้าง */}
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={clearFilters}
        >
          ล้างทั้งหมด
        </button>

        {/* Debug แสดงข้อมูลแบบเรียลไทม์ */}
        <div className="mt-4 p-2 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium">ข้อมูลแบบเรียลไทม์:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      {/* Product List */}
      <ResizablePanel className="flex flex-1 h-full w-full border border-foreground">
        <ScrollArea className="w-full rounded-md border p-4">
          <div className="flex flex-wrap justify-center gap-6">
            {searchQuery
              ? filtersPerfume.map((perfume, index) => (
                  <Perfume_card key={index} perfume={perfume} />
                ))
              : perfumes.map((perfume, index) => (
                  <Perfume_card key={index} perfume={perfume} />
                ))}
            {hasMore && <Perfume_card_skeleton />}
          </div>
          <div ref={skeletonRef} className="w-full h-1"></div>
          {!hasMore && (
            <div className="text-center text-sm text-gray-500 mt-4">
              ไม่มีข้อมูลเพิ่มเติมแล้ว
            </div>
          )}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Search;
