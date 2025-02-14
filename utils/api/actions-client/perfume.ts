"use client";
// บอกว่าโค้ดนี้ทำงานฝั่ง Client (หน้าเว็บ) แทนที่จะเป็น Server (หลังบ้าน)

import { FetchPerfumeResult } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { TradablePerfume } from "@/types/perfume";
import { Perfume } from "@/types/perfume";
import { v4 as uuidv4 } from "uuid";

export const RecommendPerfume = async (): Promise<Perfume[]> => {
  const { data, error } = await supabaseClient.rpc("random_perfumes", {
    num_limit: 5,
  });
  console.log("error:", error);
  console.log("Data:", data);

  if (error) {
    throw new Error(`Error fetching perfume data: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("No perfumes found");
  }

  return data;
};

export const FetchPerfume = async (
  perfumeName?: string,
  page: number = 1,
  limit: number = 20
): Promise<FetchPerfumeResult> => {
  const offset = (page - 1) * limit;

  try {
    const query = supabaseClient.from("perfumes").select("*");

    if (!perfumeName) {
      query.order("name", { ascending: true });
    } else {
      query.ilike("name", `%${perfumeName}%`);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching perfumes:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred." };
  }
};

export const FetchPerfumeWithFilters = async (
  searchQuery?: string,
  page: number = 1,
  gender?: string,
  accords?: string[],
  top_notes?: string[],
  middle_notes?: string[],
  base_notes?: string[]
): Promise<FetchPerfumeResult> => {
  try {
    const toNullIfEmpty = (array?: string[]) =>
      array && array.length > 0 ? array : null;

    const payload = {
      search_query: searchQuery || null,
      gender_filter: gender || null,
      accords_filter: toNullIfEmpty(accords),
      top_notes_filter: toNullIfEmpty(top_notes),
      middle_notes_filter: toNullIfEmpty(middle_notes),
      base_notes_filter: toNullIfEmpty(base_notes),
      page: page,
      result_limit: 20,
    };

    const { data, error } = await supabaseClient.rpc(
      "filter_perfumes",
      payload
    );

    if (error) {
      console.error("Error calling RPC filter_perfumes:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred." };
  }
};

export const FetchTradablePerfume = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("tradable_perfumes")
      .select("*");

    if (error) {
      console.error("Error fetching tradable perfumes:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
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
      console.error("Error removing tradable perfume:", error);
      return (error as any).message;
    }

    return null;
  } catch (error) {
    console.error("Unexpected error:", error);
    return "An unexpected error occurred.";
  }
};

const uploadImagesToSupabase = async (images: File[]) => {
  const imageUrls = await Promise.all(
    images.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`; // ใช้ uuidv4 ในการสร้างชื่อไฟล์
      const filePath = `TradablePerfume/${fileName}`;

      try {
        const { error } = await supabaseClient.storage
          .from("IMAGES")
          .upload(filePath, file);

        if (error) {
          console.error("Upload error:", error);
          return null;
        }

        const { data: publicUrlData } = supabaseClient.storage
          .from("IMAGES")
          .getPublicUrl(filePath);

        if (!publicUrlData) {
          console.error("Error getting public URL:");
          return null;
        }

        return publicUrlData.publicUrl as string;
      } catch (error) {
        console.error("Upload error:", error);
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
    console.log("Image URLs:", imageUrls);
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
