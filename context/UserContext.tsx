"use client";
// บอกว่าโค้ดนี้ทำงานฝั่ง Client (หน้าเว็บ)

import React, { createContext, useContext, useMemo } from "react";
// นำเข้า React และฟังก์ชันที่เกี่ยวข้อง:
// - `createContext`: ใช้สร้าง Context สำหรับแชร์ข้อมูลระหว่าง Components
// - `useContext`: ใช้ดึงค่าจาก Context
// - `useMemo`: ใช้สร้างค่าที่คำนวณล่วงหน้า (Memoized Value) เพื่อลดการคำนวณซ้ำ

// กำหนดประเภทข้อมูล (Type) ของ Context
interface UserContextType {
  profile: {
    id: string; 
    // รหัสประจำตัวผู้ใช้ (ID) แบบไม่ซ้ำ
    create_at: string; 
    // วันที่และเวลาที่บัญชีถูกสร้าง (ในรูปแบบ string)
    email: string; 
    // อีเมลของผู้ใช้
    name: string | null; 
    // ชื่อของผู้ใช้ (อาจเป็น null ถ้ายังไม่ได้ระบุ)
    img: string | null; 
    // URL ของรูปโปรไฟล์ผู้ใช้ (อาจเป็น null ถ้าไม่มี)
    role: string; 
    // บทบาทของผู้ใช้ เช่น "admin" หรือ "user"
  } | null;
  // `profile` เป็นข้อมูลโปรไฟล์ของผู้ใช้ ถ้าไม่มีข้อมูลจะเป็น `null`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // ข้อมูลผู้ใช้ (user) สามารถเป็นอะไรก็ได้ (any) แต่ควรปรับปรุงให้ชัดเจนยิ่งขึ้น
}

// สร้าง Context ชื่อ `UserContext`
const UserContext = createContext<UserContextType | null>(null);
// - ใช้ `createContext` เพื่อสร้าง Context สำหรับแชร์ข้อมูลผู้ใช้
// - ค่าเริ่มต้นของ Context คือ `null` (ยังไม่มีข้อมูล)

// สร้าง Component ชื่อ `UserProvider` เพื่อห่อหุ้ม Context
export const UserProvider: React.FC<{
  user: UserContextType["user"]; 
  // ข้อมูลผู้ใช้ที่จะส่งไปใน Context
  profile: UserContextType["profile"]; 
  // ข้อมูลโปรไฟล์ผู้ใช้ที่จะส่งไปใน Context
  children: React.ReactNode; 
  // ลูก Component ที่อยู่ภายใน `UserProvider`
}> = ({ user = null, profile = null, children }) => {
  // รับค่าที่ส่งมาใน `props`:
  // - `user`: ข้อมูลผู้ใช้ (ค่าเริ่มต้นเป็น `null`)
  // - `profile`: โปรไฟล์ของผู้ใช้ (ค่าเริ่มต้นเป็น `null`)
  // - `children`: Component ที่จะถูกแสดงใน `UserProvider`

  const value = useMemo(() => ({ user, profile }), [user, profile]);
  // ใช้ `useMemo` เพื่อสร้าง object `{ user, profile }`
  // - คำนวณค่าใหม่เฉพาะเมื่อ `user` หรือ `profile` เปลี่ยนแปลง
  // - ช่วยลดการคำนวณซ้ำในกรณีที่ค่าเดิมไม่เปลี่ยน

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
  // ใช้ `UserContext.Provider` เพื่อแชร์ค่า `{ user, profile }` กับลูก Component
};

// Hook สำหรับดึงค่าจาก UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  // ใช้ `useContext` เพื่อดึงค่าจาก `UserContext`

  if (!context) {
    // ถ้า `useUser` ถูกเรียกใช้โดยไม่มี `UserProvider` ครอบอยู่
    throw new Error("useUser must be used within a UserProvider");
    // ขว้าง Error พร้อมข้อความแจ้งเตือนว่าต้องใช้ `UserProvider`
  }

  return context;
  // คืนค่าที่ดึงมาจาก `UserContext` (เช่น `{ user, profile }`)
};
