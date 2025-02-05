import { Perfume, TradablePerfume } from "@/types/perfume";
// นำเข้าโครงสร้างข้อมูล (Type) ของ `Perfume`
// ซึ่งใช้สำหรับกำหนดประเภทของน้ำหอม เช่น ชื่อ, แบรนด์, กลิ่นเด่น ฯลฯ

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// นำเข้า `createSlice` และ `PayloadAction` จาก Redux Toolkit
// - `createSlice`: ใช้สร้าง slice (ส่วนย่อยของ state) ใน Redux
// - `PayloadAction`: ใช้กำหนดประเภทข้อมูล (payload) ที่ส่งมาพร้อม action

interface PerfumeState {
    perfume: Perfume[];
    tradeable_perfume: TradablePerfume[];
}

const initialState: PerfumeState = {
    perfume: [],
    tradeable_perfume: []
}

// สร้าง slice ชื่อ `perfumeSlice` เพื่อจัดการ state เกี่ยวกับข้อมูลน้ำหอม
const perfumeSlice = createSlice({
    name: 'perfume',
    initialState,
    reducers: {
        addPerfumes: (state, action: PayloadAction<Perfume[]>) => {
            state.perfume = [...state.perfume, ...action.payload].reduce((acc, curr) => {
                const existingPerfume: Perfume | undefined = acc.find((perfume: Perfume) => perfume.id === curr.id);
                if (!existingPerfume) {
                    return [...acc, curr];
                }
                return acc;
            }, [] as Perfume[]);
        },
        addTradablePerfumes: (state, action: PayloadAction<TradablePerfume[]>) => {
            state.tradeable_perfume = [...state.tradeable_perfume, ...action.payload].reduce((acc, curr) => {
                const existingPerfume: TradablePerfume | undefined = acc.find((perfume: TradablePerfume) => perfume.id === curr.id);
                if (!existingPerfume) {
                    return [...acc, curr];
                }
                return acc;
            }, [] as TradablePerfume[]);
        },
        removeTradablePerfumes: (state, action: PayloadAction<string>) => {
            state.tradeable_perfume = state.tradeable_perfume.filter((item: TradablePerfume) => item.id !== action.payload);
        }
    },
});

export const { addPerfumes, addTradablePerfumes, removeTradablePerfumes } = perfumeSlice.actions;
export default perfumeSlice.reducer;
