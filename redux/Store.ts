import { configureStore } from "@reduxjs/toolkit";
// นำเข้า `configureStore` จาก Redux Toolkit
// ใช้สำหรับสร้าง store ที่รวม reducers หลายตัวและตั้งค่าพื้นฐานให้ Redux

import perfumeReducer from "./perfume/perfumeReducer";
// นำเข้า reducer ที่ใช้จัดการ state ของน้ำหอม (perfume)
import { subscribeToSessionChanges } from "./middleware";
import basketReducer from "./basket/basketReducer";

import userReducer from "./user/userReducer";

import middleware from "./middleware";

// สร้าง Redux Store
export const store = configureStore({
  // ฟังก์ชัน `configureStore` ใช้สำหรับรวม reducers และตั้งค่าพื้นฐานของ store

  reducer: {
    // รวม reducers หลายตัวเข้าด้วยกัน
    perfume: perfumeReducer,
    // ชื่อ `perfume` ใน store เชื่อมกับ `perfumeReducer` (จัดการ state ของน้ำหอม)
    basket: basketReducer,

    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

subscribeToSessionChanges();

// สร้างประเภท (Type) สำหรับ root state ของ Redux
export type RootState = ReturnType<typeof store.getState>;
// `RootState` เป็นประเภทที่ใช้บอกว่า state ทั้งหมดใน store มีโครงสร้างอย่างไร
// - `store.getState` เป็นฟังก์ชันที่คืนค่า state ปัจจุบันของ Redux Store
// - `ReturnType` ใช้ดึงประเภทของค่าที่ฟังก์ชันคืนกลับมา (state ของ Store ทั้งหมด)

// สร้างประเภท (Type) สำหรับ dispatch function ของ Redux
export type AppDispatch = typeof store.dispatch;
// `AppDispatch` เป็นประเภทที่ใช้บอกว่า dispatch ใน store นี้มีรูปแบบอย่างไร
// - `store.dispatch` เป็นฟังก์ชันที่ใช้ส่ง action เพื่อเปลี่ยนแปลง state
