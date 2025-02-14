"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProfile } from "@/utils/supabase/api/profiles";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import Link from "next/link";

function UserProfileForm() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.userAuth);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    gender: "",
    image: null as File | null,
    userId: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createProfile({
      userId: formData.userId,
      name: formData.username,
      bio: formData.bio,
      gender: formData.gender,
      imgFiles: formData.image,
    });
    router.push("/survey-form/for-you");
  };

  return user ? (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded shadow p-6">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <div
            onClick={handleImageClick}
            className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center bg-gray-50"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-500">
                <p>Click to upload</p>
                <p className="text-sm">or drag and drop</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Username Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        {/* Bio Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        {/* Gender Field */}
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
              <SelectItem value="lgbtq">LGBTQ+</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row space-x-4">
          <Link href="/search" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button className="flex-1" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </form>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default UserProfileForm;
