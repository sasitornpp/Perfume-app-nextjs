import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";

interface PerfumeState {
	loading: boolean;
	error: string | null;
	tradablePerfumesPage: number;
	tradablePerfumesItemsPerPage: number;
	tradablePerfumesTotalPage: number;
	perfumesPage: number;
	perfumesItemsPerPage: number;
	perfumesTotalPage: number;
}

const initialState: PerfumeState = {
	loading: false,
	error: null,
	tradablePerfumesPage: 1,
	tradablePerfumesItemsPerPage: 20,
	tradablePerfumesTotalPage: 0,
	perfumesPage: 1,
	perfumesItemsPerPage: 20,
	perfumesTotalPage: 0,
};

// Fetch total count of table
export const fetchTotalCount = createAsyncThunk(
	"perfume/fetchTotalCount",
	async (
		{ tableName }: { tableName: "perfumes" | "tradable_perfumes" },
		{ rejectWithValue },
	) => {
		try {
			const { data: countData, error: countError } = await supabaseClient
				.rpc("get_table_count", { table_name: tableName })
				.single();
			if (countError) throw countError;
			return { totalCount: countData as number };
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

const perfumeSlice = createSlice({
	name: "perfume",
	initialState,
	reducers: {
		setPerfumesPage: (state, action: PayloadAction<number>) => {
			state.perfumesPage = action.payload;
		},
		setTradablePerfumesPage: (state, action: PayloadAction<number>) => {
			state.tradablePerfumesPage = action.payload;
		},
		nextPerfumesPage: (state) => {
			state.perfumesPage += 1;
		},
		prevPerfumesPage: (state) => {
			state.perfumesPage -= 1;
		},
		nextTradablePerfumesPage: (state) => {
			state.tradablePerfumesPage += 1;
		},
		prevTradablePerfumesPage: (state) => {
			state.tradablePerfumesPage -= 1;
		},
		clearPerfumesPage: (state) => {
			state.perfumesPage = 1;
		},
		clearTradablePerfumesPage: (state) => {
			state.tradablePerfumesPage = 1;
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
				if (action.meta.arg.tableName === "perfumes") {
					state.perfumesTotalPage = Math.ceil(
						totalCount / state.perfumesItemsPerPage,
					);
				} else if (action.meta.arg.tableName === "tradable_perfumes") {
					state.tradablePerfumesTotalPage = Math.ceil(
						totalCount / state.tradablePerfumesItemsPerPage,
					);
				}
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
	setTradablePerfumesPage,
	nextPerfumesPage,
	prevPerfumesPage,
	nextTradablePerfumesPage,
	prevTradablePerfumesPage,
	clearPerfumesPage,
	clearTradablePerfumesPage,
} = perfumeSlice.actions;
export default perfumeSlice.reducer;
