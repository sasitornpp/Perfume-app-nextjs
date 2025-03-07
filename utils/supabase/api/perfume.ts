import { supabaseClient } from "../client";
import { Perfume } from "@/types/perfume";

export const getPerfumeById = async ({ id }: { id: string }) => {
	const { data, error } = await supabaseClient
		.from("perfumes")
		.select()
		.eq("id", id)
		.single();
	if (error) {
		throw new Error(error.message);
	}
	if (!data || data.length === 0) {
		throw new Error("Perfume not found");
	}
	return data[0];
};
