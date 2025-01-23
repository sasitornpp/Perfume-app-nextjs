"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // นำเข้าปุ่มจากที่ที่คุณกำหนด
import { AlignJustify } from "lucide-react"; // นำเข้าไอคอน AlignJustify

export default function OpenSidebar({
  handleClick_Sidebar,
}: Readonly<{
  handleClick_Sidebar: () => void;
}>) {
  return (
    <Button type="button" variant={"outline"} onClick={handleClick_Sidebar}>
      <AlignJustify />
    </Button>
  );
}
