"use client";

import { FetchPerfumeResult } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { TradablePerfume } from "@/types/perfume";
import { v4 as uuidv4 } from "uuid";

export async function FetchPerfumes(): Promise<FetchPerfumeResult> {
  try {
    const { data, error } = await supabaseClient.from("perfumes").select("*");

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred." };
  }
}

export const FetchTradablePerfume = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("tradable_perfumes")
      .select("*");

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: "An unexpected error occurred." };
  }
};

export const RemoveTradablePerfumes = async ({ id }: { id: string }) => {
  try {
    const { error } = await supabaseClient
      .from("tradable_perfumes")
      .delete()
      .eq("id", id);

    if (error) {
      return (error as any).message;
    }

    return null;
  } catch (error) {
    return "An unexpected error occurred.";
  }
};

const uploadImagesToSupabase = async (images: File[]) => {
  const imageUrls = await Promise.all(
    images.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `TradablePerfume/${fileName}`;

      try {
        const { error } = await supabaseClient.storage
          .from("IMAGES")
          .upload(filePath, file);

        if (error) {
          return null;
        }

        const { data: publicUrlData } = supabaseClient.storage
          .from("IMAGES")
          .getPublicUrl(filePath);

        if (!publicUrlData) {
          return null;
        }

        return publicUrlData.publicUrl as string;
      } catch (error) {
        return null;
      }
    })
  );

  return imageUrls.filter((url) => url !== null) as string[];
};

export const InsertTradablePerfume = async ({
  tradablePerfume,
}: {
  tradablePerfume: TradablePerfume;
}) => {
  try {
    const imageUrls = await uploadImagesToSupabase(tradablePerfume.images);
    const { data } = await supabaseClient.auth.getUser();
    const user = data.user;

    await supabaseClient.from("tradable_perfumes").insert({
      name: tradablePerfume.name,
      descriptions: tradablePerfume.descriptions,
      gender: tradablePerfume.gender,
      brand: tradablePerfume.brand,
      concentration: tradablePerfume.concentration,
      scent_type: tradablePerfume.scentType,
      price: tradablePerfume.price,
      volume: tradablePerfume.volume,
      userName: user?.email,
      images: imageUrls,
      top_note: tradablePerfume.topNotes,
      middle_note: tradablePerfume.middleNotes,
      base_note: tradablePerfume.baseNotes,
    });

    return "success fully added";
  } catch (error) {
    return (error as any).message;
  }
};
