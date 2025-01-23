import { Perfume } from "@/types/perfume";
// นำเข้าโครงสร้างข้อมูล (Type) ของ `Perfume`
// ซึ่งใช้สำหรับกำหนดประเภทของน้ำหอม เช่น ชื่อ, แบรนด์, กลิ่นเด่น ฯลฯ

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// นำเข้า `createSlice` และ `PayloadAction` จาก Redux Toolkit
// - `createSlice`: ใช้สร้าง slice (ส่วนย่อยของ state) ใน Redux
// - `PayloadAction`: ใช้กำหนดประเภทข้อมูล (payload) ที่ส่งมาพร้อม action

// สร้าง slice ชื่อ `perfumeSlice` เพื่อจัดการ state เกี่ยวกับข้อมูลน้ำหอม
const perfumeSlice = createSlice({
    name: 'perfume', 
    // ชื่อของ slice คือ "perfume"
    // ใช้เพื่อแยกความแตกต่างของ state นี้จาก state อื่นใน Redux
    
    initialState: [] as Perfume[], 
    // ค่าเริ่มต้นของ state คือ Array ว่าง (`[]`) และกำหนดประเภทเป็น `Perfume[]`
    // - `Perfume[]`: หมายถึง Array ที่แต่ละตัวจะต้องเป็นโครงสร้าง `Perfume`

    reducers: {
        // กำหนด reducers (ตัวจัดการการเปลี่ยนแปลง state) สำหรับ slice นี้
        setPerfumes: (state, action: PayloadAction<Perfume[]>) => {
            // ฟังก์ชัน reducer ชื่อ `setPerfumes`
            // - ใช้สำหรับอัปเดตข้อมูลน้ำหอมทั้งหมดใน state
            // - `state`: ค่า state ปัจจุบัน (Array ของน้ำหอม)
            // - `action.payload`: ข้อมูลน้ำหอมใหม่ที่ส่งมา (Array ของน้ำหอม)

            return action.payload; 
            // เปลี่ยนค่า state ปัจจุบันเป็นค่าที่ส่งมาใน action.payload
            // - ตัวอย่าง: ถ้าส่ง Array ของน้ำหอม 5 ตัวมา ค่า state จะกลายเป็น Array นั้น
        },
    },
});

export const { setPerfumes } = perfumeSlice.actions;
// ส่งออก action creator ชื่อ `setPerfumes`
// - Action นี้ใช้สำหรับส่งข้อมูลน้ำหอมใหม่เพื่ออัปเดต state
// - ตัวอย่างการเรียกใช้งาน: `dispatch(setPerfumes(perfumeList))`

export default perfumeSlice.reducer;
// ส่งออก reducer ของ slice นี้
// - Reducer จะถูกเพิ่มเข้าไปใน `store` เพื่อให้ Redux จัดการ state
// - ตัวอย่าง: เมื่อ action `setPerfumes` ถูก dispatch, Reducer นี้จะอัปเดต state ของ `perfume`
