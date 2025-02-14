"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";

function PerfumePreferencesForm() {
  const [formData, setFormData] = useState({
    favoriteScent: "",
    customScent: "",
    favoriteBrand: "",
    customBrand: "",
    rating: 3,
    topNotes: "",
    customTopNotes: "",
    middleNotes: "",
    customMiddleNotes: "",
    baseNotes: "",
    customBaseNotes: "",
    situation: "",
    customSituation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({ ...formData, rating: value[0] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded shadow p-6">
        {/* Favorite Brand */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="favoriteBrand">แบรนด์ที่ชอบ</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("favoriteBrand", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกแบรนด์..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chanel">Chanel</SelectItem>
              <SelectItem value="dior">Dior</SelectItem>
              <SelectItem value="tomford">Tom Ford</SelectItem>
              <SelectItem value="ysl">YSL</SelectItem>
              <SelectItem value="gucci">Gucci</SelectItem>
              <SelectItem value="other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {formData.favoriteBrand === "other" && (
            <Input
              name="customBrand"
              placeholder="ระบุแบรนด์ที่ชอบ"
              value={formData.customBrand}
              onChange={handleChange}
              className="mt-2"
            />
          )}
        </div>

        {/* Favorite Scent */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="favoriteScent">กลิ่นที่ชอบ</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("favoriteScent", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภทกลิ่น..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floral">Floral (กลิ่นดอกไม้)</SelectItem>
              <SelectItem value="woody">Woody (กลิ่นไม้)</SelectItem>
              <SelectItem value="oriental">Oriental (กลิ่นตะวันออก)</SelectItem>
              <SelectItem value="fresh">Fresh (กลิ่นสดชื่น)</SelectItem>
              <SelectItem value="citrus">Citrus (กลิ่นส้ม)</SelectItem>
              <SelectItem value="other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {formData.favoriteScent === "other" && (
            <Input
              name="customScent"
              placeholder="ระบุกลิ่นที่ชอบ"
              value={formData.customScent}
              onChange={handleChange}
              className="mt-2"
            />
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col space-y-1.5">
          <Label>Rating (1-5)</Label>
          <div className="pt-4">
            <Slider
              defaultValue={[3]}
              max={5}
              min={1}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>
          <div className="text-center mt-2">{formData.rating} ดาว</div>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="topNotes">Top Notes ที่ชอบ</Label>
            <Select
              onValueChange={(value) => handleSelectChange("topNotes", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citrus">Citrus (ผลไม้ตระกูลส้ม)</SelectItem>
                <SelectItem value="lavender">Lavender (ลาเวนเดอร์)</SelectItem>
                <SelectItem value="bergamot">Bergamot (มะกรูด)</SelectItem>
                <SelectItem value="mint">Mint (มิ้นต์)</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
            {formData.topNotes === "other" && (
              <Input
                name="customTopNotes"
                placeholder="ระบุ Top Notes ที่ชอบ"
                value={formData.customTopNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="middleNotes">Middle Notes ที่ชอบ</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("middleNotes", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">Rose (กุหลาบ)</SelectItem>
                <SelectItem value="jasmine">Jasmine (มะลิ)</SelectItem>
                <SelectItem value="ylangylang">
                  Ylang Ylang (กระดังงา)
                </SelectItem>
                <SelectItem value="geranium">Geranium (เจอราเนียม)</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
            {formData.middleNotes === "other" && (
              <Input
                name="customMiddleNotes"
                placeholder="ระบุ Middle Notes ที่ชอบ"
                value={formData.customMiddleNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="baseNotes">Base Notes ที่ชอบ</Label>
            <Select
              onValueChange={(value) => handleSelectChange("baseNotes", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vanilla">Vanilla (วานิลา)</SelectItem>
                <SelectItem value="musk">Musk (มัสก์)</SelectItem>
                <SelectItem value="sandalwood">
                  Sandalwood (ไม้จันทน์)
                </SelectItem>
                <SelectItem value="amber">Amber (อำพัน)</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
            {formData.baseNotes === "other" && (
              <Input
                name="customBaseNotes"
                placeholder="ระบุ Base Notes ที่ชอบ"
                value={formData.customBaseNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Situation */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="situation">สถานการณ์ที่จะใช้</Label>
          <Select
            onValueChange={(value) => handleSelectChange("situation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานการณ์..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">ใช้ประจำวัน</SelectItem>
              <SelectItem value="work">ไปทำงาน</SelectItem>
              <SelectItem value="date">ไปเดท</SelectItem>
              <SelectItem value="party">ปาร์ตี้/งานสังสรรค์</SelectItem>
              <SelectItem value="special">โอกาสพิเศษ</SelectItem>
              <SelectItem value="other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {formData.situation === "other" && (
            <Input
              name="customSituation"
              placeholder="ระบุสถานการณ์"
              value={formData.customSituation}
              onChange={handleChange}
              className="mt-2"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row space-x-4">
          <Link href="/search" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              ยกเลิก
            </Button>
          </Link>
          <Button type="submit" className="flex-1">
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PerfumePreferencesForm;
