import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// นำเข้า `createSlice` และ `PayloadAction` จาก Redux Toolkit
// - `createSlice`: ใช้สำหรับสร้าง slice (ส่วนย่อยของ state) ใน Redux
// - `PayloadAction`: ใช้กำหนดประเภทของข้อมูล (payload) ที่ส่งมาพร้อม action

const createPostSlice = createSlice({
    // สร้าง slice ชื่อ `createPostSlice` เพื่อจัดการ state ที่เกี่ยวข้องกับการสร้างโพสต์
    name: 'createPost', 
    // กำหนดชื่อของ slice เป็น "createPost"
    
    initialState: false as boolean, 
    // กำหนดค่าเริ่มต้นของ state เป็น `false` และระบุประเภทของ state เป็น boolean
    // - `false`: หมายถึงยังไม่มีการสร้างโพสต์
    
    reducers: {
        // กำหนด reducer (ตัวจัดการการเปลี่ยนแปลง state) สำหรับ slice นี้
        setCreatePost: (state, action: PayloadAction<boolean>) => {
            // ฟังก์ชัน reducer ชื่อ `setCreatePost` ใช้สำหรับอัปเดต state
            // - `state`: ค่า state ปัจจุบัน
            // - `action`: ข้อมูลที่ส่งมาพร้อม action (payload)
            
            return action.payload;
            // อัปเดต state ด้วยค่าที่รับมาจาก action.payload (ค่าใหม่ที่ส่งมา)
        },
    },
});

export const { setCreatePost } = createPostSlice.actions;
// ส่งออก action ชื่อ `setCreatePost`
// - Action นี้ใช้สำหรับเปลี่ยนค่า state ของ `createPost`

export default createPostSlice.reducer;
// ส่งออก reducer ของ slice นี้
// - Reducer นี้จะถูกใช้ใน `store` เพื่อจัดการ state ของ `createPost`
