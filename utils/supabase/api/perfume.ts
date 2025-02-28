"use client";

import { FetchPerfumeResult } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { TradablePerfumeForInsert } from "@/types/perfume";
import { v4 as uuidv4 } from "uuid";
import { c } from "framer-motion/dist/types.d-6pKw1mTI";

export async function FetchPerfumes(): Promise<FetchPerfumeResult> {
	try {
		const { data, error } = await supabaseClient
			.from("perfumes")
			.select("*");

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

export const uploadImagesToSupabase = async (
	folder_name: string,
	images: File[],
) => {
	const uploadedFiles: { filePath: string; publicUrl: string }[] = [];

	try {
		const results = await Promise.all(
			images.map(async (file) => {
				const fileExt = file.name.split(".").pop();
				const fileName = `${uuidv4()}.${fileExt}`;
				const filePath = `${folder_name}/${fileName}`;

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

					uploadedFiles.push({
						filePath,
						publicUrl: publicUrlData.publicUrl,
					});
					return { filePath, publicUrl: publicUrlData.publicUrl };
				} catch (error) {
					return null;
				}
			}),
		);

		return {
			uploadedFiles,
			results: results.filter(
				(result): result is { filePath: string; publicUrl: string } =>
					result !== null,
			),
		};
	} catch (error) {
		await rollbackUploadedFiles(uploadedFiles.map((file) => file.filePath));
		return { uploadedFiles: [], results: [] };
	}
};

export const rollbackUploadedFiles = async (filePaths: string[]) => {
	try {
		if (filePaths.length === 0) return;
        console.log(filePaths);
		await supabaseClient.storage.from("IMAGES").remove(filePaths);
	} catch (error) {
		console.error("Error during rollback:", error);
	}
};
