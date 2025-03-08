import { supabaseClient } from "../client";
import { Perfume, Album } from "@/types/perfume";

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
	return data;
};

export const fetchAlbumById = async ({
	id,
	userId,
}: {
	id: string;
	userId: string;
}) => {
	const { data, error } = await supabaseClient
		.from("albums")
		.select()
		.eq("id", id)
		.single();

	// console.log(data);

	if (data.user_id !== userId) {
		return null;
	}

	if (error) {
		throw new Error(error.message);
	}
	if (!data || data.length === 0) {
		throw new Error("Perfume not found");
	}

	const perfumes = await Promise.all(
		data.perfumes_id.map((perfume_id: string) =>
			getPerfumeById({ id: perfume_id }),
		),
	);

	return { ...data, perfumes };
};
