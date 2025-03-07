import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";

export interface PaginationState {
	loading: boolean;
	error: string | null;
	perfumesPage: number;
	perfumesItemsPerPage: number;
	perfumesTotalPage: number;
}

const initialState: PaginationState = {
	loading: false,
	error: null,
	perfumesPage: 1,
	perfumesItemsPerPage: 20,
	perfumesTotalPage: 0,
};

// Fetch total count of table
export const fetchTotalCount = createAsyncThunk(
	"perfume/fetchTotalCount",
	async (_, { rejectWithValue }) => {
		try {
			const { data: countData, error: countError } = await supabaseClient
				.rpc("get_perfumes_count")
				.single();
			if (countError) throw countError;
			return { totalCount: countData as number };
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

const paginationSlice = createSlice({
	name: "pagination",
	initialState,
	reducers: {
		setPerfumesPage: (state, action: PayloadAction<number>) => {
			state.perfumesPage = action.payload;
		},
		nextPerfumesPage: (state) => {
			state.perfumesPage += 1;
		},
		prevPerfumesPage: (state) => {
			state.perfumesPage -= 1;
		},
		clearPerfumesPage: (state) => {
			state.perfumesPage = 1;
		},
        addNewTotalPage: (state, action: PayloadAction<number>) => {
            state.perfumesTotalPage = action.payload;
        },
	},
	extraReducers: (builder) => {
		// extraReducers
		builder
			// fetchTotalCount
			.addCase(fetchTotalCount.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchTotalCount.fulfilled, (state, action) => {
				const { totalCount } = action.payload;
				state.perfumesTotalPage = Math.ceil(
					totalCount / state.perfumesItemsPerPage,
				);
				state.loading = false;
			})
			.addCase(fetchTotalCount.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			});
	},
});

export const {
	setPerfumesPage,
	nextPerfumesPage,
	prevPerfumesPage,
	clearPerfumesPage,
    addNewTotalPage
} = paginationSlice.actions;
export default paginationSlice.reducer;
