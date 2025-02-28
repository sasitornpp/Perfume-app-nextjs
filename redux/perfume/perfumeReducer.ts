import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
	Perfume,
	TradablePerfumeForInsert,
	TradablePerfume,
} from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { Profile } from "@/types/profile";
import {
	uploadImagesToSupabase,
	rollbackUploadedFiles,
} from "@/utils/supabase/api/perfume";

interface PerfumeState {
	perfumes: Perfume[];
	tradablePerfumes: TradablePerfume[];
	loading: boolean;
	error: string | null;
}

const initialState: PerfumeState = {
	perfumes: [],
	tradablePerfumes: [],
	loading: false,
	error: null,
};

export const fetchPerfumes = createAsyncThunk(
	"perfume/fetchPerfumes",
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabaseClient
				.from("perfumes")
				.select("*");
			if (error) throw error;
			return data as Perfume[];
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const fetchTradablePerfumes = createAsyncThunk(
	"perfume/fetchTradablePerfumes",
	async (_, { rejectWithValue }) => {
		try {
			const { data, error } = await supabaseClient
				.from("tradable_perfumes")
				.select("*");
			if (error) throw error;
			return data as TradablePerfume[];
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const addTradablePerfume = createAsyncThunk(
	"perfume/addTradablePerfume",
	async (
		{
			perfumeData,
			userProfile,
		}: { perfumeData: TradablePerfumeForInsert; userProfile: Profile },
		{ rejectWithValue },
	) => {
		let uploadedImages = null;

		try {
			if (!userProfile) throw new Error("User profile not found");
			if (perfumeData.imagesFiles?.length) {
				uploadedImages = await uploadImagesToSupabase(
					"TradablePerfume",
					perfumeData.imagesFiles,
				);
				if (!uploadedImages?.uploadedFiles) {
					throw new Error("Image upload failed");
				}
				perfumeData.images = uploadedImages.uploadedFiles.map(
					(file) => file.publicUrl,
				);
			}
			const { imagePreviews, imagesFiles, ...perfumeDataToInsert } =
				perfumeData;
			const { data, error } = await supabaseClient
				.from("tradable_perfumes")
				.insert([
					{
						...perfumeDataToInsert,
						user_name: userProfile.name,
						user_id: userProfile.id,
						images: perfumeData.images ?? [],
					},
				])
				.select()
				.single();

			if (error) {
				if (uploadedImages) {
					await rollbackUploadedFiles(
						uploadedImages.uploadedFiles.map(
							(file) => file.filePath,
						),
					);
				}
				throw error;
			}

			// Fetch updated tradable perfumes after insert
			const { data: updatedData, error: fetchError } =
				await supabaseClient.from("tradable_perfumes").select("*");

			if (fetchError) throw fetchError;
			return updatedData as TradablePerfume[];
		} catch (error: any) {
			console.error("Error adding tradable perfume:", error);
			if (uploadedImages) {
				await rollbackUploadedFiles(
					uploadedImages.uploadedFiles.map((file) => file.filePath),
				);
			}
			return rejectWithValue(error.message);
		}
	},
);

const perfumeSlice = createSlice({
	name: "perfume",
	initialState,
	reducers: {
		setPerfumes: (state, action: PayloadAction<Perfume[]>) => {
			state.perfumes = action.payload;
		},
		addPerfumes: (state, action: PayloadAction<Perfume[]>) => {
			const newPerfumes = action.payload.filter(
				(perfume) => !state.perfumes.some((p) => p.id === perfume.id),
			);
			state.perfumes = [...state.perfumes, ...newPerfumes];
		},
		addTradablePerfumes: (
			state,
			action: PayloadAction<TradablePerfume[]>,
		) => {
			const newTradablePerfumes = action.payload.filter(
				(perfume) =>
					!state.tradablePerfumes.some((p) => p.id === perfume.id),
			);
			state.tradablePerfumes = [
				...state.tradablePerfumes,
				...newTradablePerfumes,
			];
		},
		removeTradablePerfume: (state, action: PayloadAction<string>) => {
			state.tradablePerfumes = state.tradablePerfumes.filter(
				(item) => item.id !== action.payload,
			);
		},
	},
	extraReducers: (builder) => {
		builder
			// fetchPerfumes
			.addCase(fetchPerfumes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPerfumes.fulfilled, (state, action) => {
				state.perfumes = action.payload;
				state.loading = false;
			})
			.addCase(fetchPerfumes.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			// fetchTradablePerfumes
			.addCase(fetchTradablePerfumes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTradablePerfumes.fulfilled, (state, action) => {
				state.tradablePerfumes = action.payload;
				state.loading = false;
			})
			.addCase(fetchTradablePerfumes.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			.addCase(addTradablePerfume.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addTradablePerfume.fulfilled, (state, action) => {
				state.tradablePerfumes = action.payload;
				state.loading = false;
			})
			.addCase(addTradablePerfume.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			});
	},
});

export const {
	setPerfumes,
	addPerfumes,
	addTradablePerfumes,
	removeTradablePerfume,
} = perfumeSlice.actions;
export default perfumeSlice.reducer;
