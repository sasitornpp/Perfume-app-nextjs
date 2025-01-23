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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Survey() {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthdate: "",
    situation: "",
    intensity: "",
    scentType: "",
    topNote: "",
    middleNote: "",
    baseNote: "",
    brand: "",
    price: "",
    volume: "",
    feeling: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-4">
      {showForm && (
        <form className="flex flex-col w-full max-w-3xl mx-auto p-6 space-y-4 rounded shadow mt-16">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              name="name"
              placeholder="ชื่อ"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="gender">เพศ</Label>
            <Select
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ชาย">ชาย</SelectItem>
                <SelectItem value="หญิง">หญิง</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
                <SelectItem value="LGBTQ+">LGBTQ+</SelectItem>
                <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="birthdate">วันเกิด</Label>
            <Input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="situation">สถานการณ์</Label>
            <Select
              onValueChange={(value) => handleSelectChange("situation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="สถานการณ์ (เช่น งานเลี้ยง, ทำงาน)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ไปข้างนอก">ไปข้างนอก</SelectItem>
                <SelectItem value="เดท">เดท</SelectItem>
                <SelectItem value="ปาร์ตี้กลางคืน">ปาร์ตี้กลางคืน</SelectItem>
                <SelectItem value="งานสุภาพ">EDC</SelectItem>
                <SelectItem value="งานศพ">Eau Fraiche</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="intensity">ความเข้มข้น</Label>
            <Select
              onValueChange={(value) => handleSelectChange("intensity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Perfume">Perfume</SelectItem>
                <SelectItem value="EDP">EDP</SelectItem>
                <SelectItem value="EDT">EDT</SelectItem>
                <SelectItem value="EDC">EDC</SelectItem>
                <SelectItem value="Eau Fraiche">Eau Fraiche</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="scentType">ประเภทกลิ่น</Label>
            <Input
              name="scentType"
              placeholder="ประเภทกลิ่น (เช่น Floral, Woody)"
              value={formData.scentType}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col space-y-1.5 flex-1">
              <Label htmlFor="topNote">Top Note</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topNote" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 flex-1">
              <Label htmlFor="middleNote">Middle Note</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topNote" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 flex-1">
              <Label htmlFor="baseNote">Base Note</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topNote" />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="brand">แบรนด์</Label>
            <Input
              name="brand"
              placeholder="แบรนด์"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="price">ราคา</Label>
            <Select
              onValueChange={(value) => handleSelectChange("price", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hight-low">สูง-ต่ำ</SelectItem>
                <SelectItem value="low-hight">ต่ำ-สูง</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="size">ขนาด</Label>
            <Input
              name="volume"
              placeholder="ขนาด ml"
              value={formData.volume}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="feeling">ความรู้สึก</Label>
            <Textarea
              name="feeling"
              placeholder="ความรู้สึก"
              value={formData.feeling}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <Link href={"/search"}>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full"
              >
                ยกเลิก
              </Button>
            </Link>
            <Link href={"/search"}>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full"
              >
                บันทึกข้อมูล
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default Survey;
