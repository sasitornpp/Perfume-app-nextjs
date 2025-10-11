import {
	createSlice,
	createAsyncThunk,
	PayloadAction,
	Dispatch,
} from "@reduxjs/toolkit";
import { Perfume } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";
import { PaginationState } from "@/redux/pagination/paginationReducer";
import {
	setPerfumesPage,
	addNewTotalPage,
} from "@/redux/pagination/paginationReducer";
import { RootState } from "@/redux/Store";

export interface Filters {
	search_query: string | null;
	brand_filter: string[];
	gender_filter: string | null;
	accords_filter: string[];
	top_notes_filter: string[];
	middle_notes_filter: string[];
	base_notes_filter: string[];
	is_tradable_filter: boolean;
}

export const initialValues: Filters = {
	search_query: null,
	brand_filter: [],
	gender_filter: null,
	accords_filter: [],
	top_notes_filter: [],
	middle_notes_filter: [],
	base_notes_filter: [],
	is_tradable_filter: false,
};

interface FilterPerfumesState {
	perfumes: { [key: string]: Perfume[] };
	Filters: Filters | null;
	suggestions: {name:string}[];
	error: string | null;
	loading: boolean;
}

const initialState: FilterPerfumesState = {
	perfumes: {},
	Filters: null,
	suggestions: [],
	error: null,
	loading: false,
};

export const areFiltersEqual = (
	f1: Filters | null,
	f2: Filters | null,
): boolean => {
	if (f1 === null || f2 === null) return f1 === f2;
	return (
		f1.search_query === f2.search_query &&
		f1.brand_filter === f2.brand_filter &&
		f1.gender_filter === f2.gender_filter &&
		JSON.stringify(f1.accords_filter.sort()) ===
		JSON.stringify(f2.accords_filter.sort()) &&
		JSON.stringify(f1.top_notes_filter.sort()) ===
		JSON.stringify(f2.top_notes_filter.sort()) &&
		JSON.stringify(f1.middle_notes_filter.sort()) ===
		JSON.stringify(f2.middle_notes_filter.sort()) &&
		JSON.stringify(f1.base_notes_filter.sort()) ===
		JSON.stringify(f2.base_notes_filter.sort())
	);
};

export const setFiltersAndFetch = createAsyncThunk(
	"filterPerfumes/setFiltersAndFetch",
	async (filters: Filters, { dispatch, getState }) => {
		const state = getState() as RootState;
		const currentFilters = state.filters.Filters;

		if (!areFiltersEqual(currentFilters, filters)) {
			dispatch(setFilters(filters));
			dispatch(fetchNewPerfumesFilters({ filters }));
		}
	},
);

export const fetchNewPerfumesFilters = createAsyncThunk(
	"filterPerfumes/fetchNewPerfumesFilters",
	async (
		{ filters }: { filters: Filters },
		{ rejectWithValue, getState, dispatch },
	) => {
		const state = getState() as { pagination: PaginationState };
		try {
			const { data, error } = await supabaseClient.rpc(
				"filter_perfumes_for_search",
				{
					...filters,
					page: 1,
					items_per_page: state.pagination.perfumesItemsPerPage,
				},
			);
			if (error) throw error;
			const result = data as { data: Perfume[]; totalPage: number };
			dispatch(setPerfumesPage(1));
			console.log("result.totalPage", result.totalPage);
			dispatch(addNewTotalPage(result.totalPage));
			return result;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const fetchPerfumesByFilters = createAsyncThunk(
	"filterPerfumes/fetchPerfumesByFilters",
	async (_, { rejectWithValue, getState }) => {
		console.log("fetchPerfumesByFilters started");
		const state = getState() as {
			filters: FilterPerfumesState;
			pagination: PaginationState;
		};
		console.log("state:", state);
		const filters = state.filters.Filters || {};;
		const currentPage = state.pagination.perfumesPage;
		console.log("filters:", filters);
		console.log("currentPage:", currentPage);

		try {
			const { data, error } = await supabaseClient.rpc(
				"filter_perfumes_for_search",
				{
					...filters,
					page: currentPage,
					items_per_page: state.pagination.perfumesItemsPerPage,
				},
			);
			if (error) throw error;
			return {
				data: data.data as Perfume[],
				totalPage: data.totalPage,
				page: currentPage,
			};
		} catch (error: any) {
			console.error("fetchPerfumesByFilters error:", error);
			return rejectWithValue(error.message);
		}
	},
);

const filterPerfumesSlice = createSlice({
	name: "filterPerfumes",
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<Filters>) => {
			state.Filters = action.payload;
			state.perfumes = {};
		},
		clearFilters: (state) => {
			state.Filters = null;
			state.perfumes = {};
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNewPerfumesFilters.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchNewPerfumesFilters.fulfilled, (state, action) => {
				state.loading = false;
				state.perfumes["1"] = action.payload.data;
			})
			.addCase(fetchNewPerfumesFilters.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			.addCase(fetchPerfumesByFilters.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPerfumesByFilters.fulfilled, (state, action) => {
				state.loading = false;
				state.perfumes[action.payload.page.toString()] =
					action.payload.data;
			})
			.addCase(fetchPerfumesByFilters.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Suggestions
			.addCase(fetchPerfumeSuggestions.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPerfumeSuggestions.fulfilled, (state, action) => {
				state.loading = false;
				state.suggestions = action.payload;
			})
			.addCase(fetchPerfumeSuggestions.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});


	},
});


export const fetchPerfumeSuggestions = createAsyncThunk(
	"filterPerfumes/fetchPerfumeSuggestions",
	async (query: string, { rejectWithValue }) => {
		try {
			const { data, error } = await supabaseClient.rpc("perfume_suggestions", {
				query,
			});
			if (error) throw error;
			return data as { name: string }[];
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	}
);


export const { setFilters, clearFilters, clearError } =
	filterPerfumesSlice.actions;
export default filterPerfumesSlice.reducer;
