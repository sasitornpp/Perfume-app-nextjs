import { Perfume } from "@/types/perfume";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Perfume[] = [];

const basketSlice = createSlice({
    name: 'perfume',
    initialState,
    reducers: {
        setBasket: (state, action: PayloadAction<Perfume[]>) => {
            return action.payload;
        },
        removeBasket: (state, action: PayloadAction<string>) => {
            return state.filter((item) => item.id !== action.payload);
        }
    },
});

export const { setBasket, removeBasket } = basketSlice.actions;
export default basketSlice.reducer;
