import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Perfume, TradablePerfume } from "@/types/perfume";
import { supabaseClient } from "@/utils/supabase/client";

interface PerfumeState {
    perfume: Perfume[];
    tradeable_perfume: TradablePerfume[];
}

const initialState: PerfumeState = {
    perfume: [],
    tradeable_perfume: []
};

export const fetchPerfumes = createAsyncThunk('perfume/fetchPerfumes', async () => {
    const { data, error } = await supabaseClient
        .from('perfumes')
        .select('*');

    if (error) throw new Error(error.message);
    return data as Perfume[];
});

const perfumeSlice = createSlice({
    name: 'perfume',
    initialState,
    reducers: {
        addPerfumes: (state, action: PayloadAction<Perfume[]>) => {
            state.perfume = [...state.perfume, ...action.payload].reduce((acc, curr) => {
                if (!acc.find((perfume) => perfume.id === curr.id)) {
                    return [...acc, curr];
                }
                return acc;
            }, [] as Perfume[]);
        },
        addTradablePerfumes: (state, action: PayloadAction<TradablePerfume[]>) => {
            state.tradeable_perfume = [...state.tradeable_perfume, ...action.payload].reduce((acc, curr) => {
                if (!acc.find((perfume) => perfume.id === curr.id)) {
                    return [...acc, curr];
                }
                return acc;
            }, [] as TradablePerfume[]);
        },
        removeTradablePerfumes: (state, action: PayloadAction<string>) => {
            state.tradeable_perfume = state.tradeable_perfume.filter((item) => item.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPerfumes.fulfilled, (state, action) => {
                state.perfume = action.payload;
            });
    }
});

export const { addPerfumes, addTradablePerfumes, removeTradablePerfumes } = perfumeSlice.actions;
export default perfumeSlice.reducer;
