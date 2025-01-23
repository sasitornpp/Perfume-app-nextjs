"use client";

import React, { useState } from "react";
import { FetchPerfumeWithFilters } from "@/utils/api/actions-client/perfume";

function Test() {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSearch = async () => {
    // แยกคำใน input
    const keywords = inputValue.split(",").map((item) => item.trim());

    // กำหนด filters
    const genderKeywords = ["Male", "Female", "Unisex"];
    const filters = {
      searchQuery: keywords.join(" "),
      gender: keywords.find((keyword) => genderKeywords.includes(keyword)),
      accords: keywords.filter((keyword) =>
        ["woody", "floral", "spicy"].includes(keyword.toLowerCase())
      ),
      top_notes: keywords.filter((keyword) =>
        ["citrus", "fresh"].includes(keyword.toLowerCase())
      ),
      middle_notes: keywords.filter((keyword) =>
        ["rose", "jasmine"].includes(keyword.toLowerCase())
      ),
      base_notes: keywords.filter((keyword) =>
        ["vanilla", "amber", "musk"].includes(keyword.toLowerCase())
      ),
    };

    // Log filters
    console.log("Filters to API:", filters);

    // เรียกใช้งาน FetchPerfumeWithFilters
    const result = await FetchPerfumeWithFilters(
      filters.searchQuery,
      1,
      10,
      {
        gender: filters.gender,
        accords: filters.accords,
        top_notes: filters.top_notes,
        middle_notes: filters.middle_notes,
        base_notes: filters.base_notes,
      }
    );

    // แสดงผลลัพธ์ใน console
    console.log("Result from FetchPerfumeWithFilters:", result);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ค้นหาน้ำหอม</h1>
      <div>
        <label htmlFor="searchInput" className="block mb-2 font-medium">
          คำค้นหา (เช่น: Dior, Unisex, woody, citrus):
        </label>
        <input
          type="text"
          id="searchInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
          placeholder="ป้อนคำค้นหาทั้งหมด เช่น Dior, Unisex, woody"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        ค้นหา
      </button>
    </div>
  );
}

export default Test;
