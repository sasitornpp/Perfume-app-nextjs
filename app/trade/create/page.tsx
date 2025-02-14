"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TradablePerfume } from "@/types/perfume";
import { X, Plus, ImagePlus } from "lucide-react";
import { InsertTradablePerfume } from "@/utils/supabase/api/perfume";
import { useRouter } from "next/navigation";

function Trade() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TradablePerfume>({
    id: "",
    name: "",
    descriptions: "",
    gender: "",
    brand: "",
    concentration: "",
    scentType: "",
    price: 0,
    volume: 0,
    topNotes: [],
    middleNotes: [],
    baseNotes: [],
    images: [],
    imagePreviews: [],
    accords: [],
    perfumer: "",
    rating: 0,
    totalVotes: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileObjects = Array.from(files);
      const fileUrls = fileObjects.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileObjects],
        imagePreviews: [...prev.imagePreviews, ...fileUrls],
      }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imagePreviews: newPreviews,
    }));

    URL.revokeObjectURL(formData.imagePreviews[index]);
  };

  const handleArrayChange = (
    type: keyof TradablePerfume,
    index: number,
    value: string
  ) => {
    const newArray = [...(formData[type] as string[])];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [type]: newArray,
    }));
  };

  const addArrayItem = (type: keyof TradablePerfume) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...(prev[type] as string[]), ""],
    }));
  };

  const removeArrayItem = (type: keyof TradablePerfume, index: number) => {
    const newArray = (formData[type] as string[]).filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [type]: newArray,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    InsertTradablePerfume({ tradablePerfume: formData });
    setLoading(false);
    router.push("/trade");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Perfume Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Perfume Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter perfume name"
                required
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.descriptions}
              onChange={handleChange}
              placeholder="Describe the perfume"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Gender</Label>
              <Select
                name="gender"
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Concentration</Label>
              <Select
                name="concentration"
                value={formData.concentration}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, concentration: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select concentration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eau_de_parfum">Eau de Parfum</SelectItem>
                  <SelectItem value="eau_de_toilette">
                    Eau de Toilette
                  </SelectItem>
                  <SelectItem value="cologne">Cologne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Scent Type</Label>
              <Select
                name="scentType"
                value={formData.scentType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, scentType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woody">Woody</SelectItem>
                  <SelectItem value="floral">Floral</SelectItem>
                  <SelectItem value="oriental">Oriental</SelectItem>
                  <SelectItem value="fresh">Fresh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (THB)</Label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <Label>Volume (ml)</Label>
              <Input
                name="volume"
                type="number"
                value={formData.volume}
                onChange={handleChange}
                placeholder="Enter volume"
                required
              />
            </div>
          </div>

          {(["topNotes", "middleNotes", "baseNotes"] as const).map(
            (noteType) => (
              <div key={noteType}>
                <Label>{noteType.replace("Notes", " Notes")}</Label>
                {formData[noteType].map((note, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={note}
                      onChange={(e) =>
                        handleArrayChange(noteType, index, e.target.value)
                      }
                      placeholder={`Enter ${noteType.replace("Notes", " note")}`}
                    />
                    {formData[noteType].length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeArrayItem(noteType, index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem(noteType)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            )
          )}

          <div>
            <Label>Images</Label>
            <div className="flex flex-wrap gap-4 mb-4">
              {formData.imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={120}
                    height={120}
                    className="object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Label
                className="flex flex-col items-center justify-center w-[120px] h-[120px] 
                           border-2 border-dashed rounded-lg cursor-pointer 
                           hover:bg-gray-100 transition"
              >
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="text-sm">Upload</span>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Creating..." : "Create Tradable Perfume"}
          </Button>
        </form>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-400 border-dashed rounded-full animate-spin"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Trade;
