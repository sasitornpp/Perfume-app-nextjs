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
          <Label htmlFor="favoriteBrand">Favorite Brand</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("favoriteBrand", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chanel">Chanel</SelectItem>
              <SelectItem value="dior">Dior</SelectItem>
              <SelectItem value="tomford">Tom Ford</SelectItem>
              <SelectItem value="ysl">YSL</SelectItem>
              <SelectItem value="gucci">Gucci</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formData.favoriteBrand === "other" && (
            <Input
              name="customBrand"
              placeholder="Enter a brand..."
              value={formData.customBrand}
              onChange={handleChange}
              className="mt-2"
            />
          )}
        </div>

        {/* Favorite Scent */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="favoriteScent">Favorite Scent</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("favoriteScent", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a scent..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floral">Floral</SelectItem>
              <SelectItem value="woody">Woody</SelectItem>
              <SelectItem value="oriental">Oriental</SelectItem>
              <SelectItem value="fresh">Fresh</SelectItem>
              <SelectItem value="citrus">Citrus</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formData.favoriteScent === "other" && (
            <Input
              name="customScent"
              placeholder="Enter a scent..."
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
          <div className="text-center mt-2">{formData.rating} stars</div>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="topNotes">Top Notes</Label>
            <Select
              onValueChange={(value) => handleSelectChange("topNotes", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citrus">Citrus</SelectItem>
                <SelectItem value="lavender">Lavender</SelectItem>
                <SelectItem value="bergamot">Bergamot</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.topNotes === "other" && (
              <Input
                name="customTopNotes"
                placeholder="Enter top notes..."
                value={formData.customTopNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="middleNotes">Middle Notes</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("middleNotes", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="jasmine">Jasmine</SelectItem>
                <SelectItem value="ylangylang">Ylang-Ylang</SelectItem>
                <SelectItem value="geranium">Geranium</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.middleNotes === "other" && (
              <Input
                name="customMiddleNotes"
                placeholder="Enter middle notes..."
                value={formData.customMiddleNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="baseNotes">Base Notes</Label>
            <Select
              onValueChange={(value) => handleSelectChange("baseNotes", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vanilla">Vanilla</SelectItem>
                <SelectItem value="musk">Musk</SelectItem>
                <SelectItem value="sandalwood">Sandalwood</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.baseNotes === "other" && (
              <Input
                name="customBaseNotes"
                placeholder="Enter base notes..."
                value={formData.customBaseNotes}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Situation */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="situation">Situation</Label>
          <Select
            onValueChange={(value) => handleSelectChange("situation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a situation..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="party">Party</SelectItem>
              <SelectItem value="special">Special Occasion</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formData.situation === "other" && (
            <Input
              name="customSituation"
              placeholder="Enter a situation..."
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
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="flex-1">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PerfumePreferencesForm;
