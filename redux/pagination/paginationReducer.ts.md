# คู่มือการทำงานของ `paginationReducer.ts`

## 1. บทนำ

ไฟล์ `paginationReducer.ts` เป็นส่วนหนึ่งของระบบจัดการสถานะ (state management) ในแอปพลิเคชัน Next.js ที่เกี่ยวข้องกับการแบ่งหน้า (pagination) ของข้อมูลน้ำหอม (Perfume) โดยใช้ Redux Toolkit ไฟล์นี้มีหน้าที่จัดการ state ที่เกี่ยวข้องกับหมายเลขหน้าปัจจุบัน, จำนวนรายการต่อหน้า, และจำนวนหน้าทั้งหมด

## 2. โครงสร้างข้อมูลหลัก (State Structure)

โครงสร้างข้อมูลหลัก (state) ที่จัดการใน `paginationReducer.ts` มีดังนี้:

```typescript
export interface PaginationState {
 loading: boolean;
 error: string | null;
 perfumesPage: number;
 perfumesItemsPerPage: number;
 perfumesTotalPage: number;
}
```

โดยที่:

- `loading`: สถานะการโหลดข้อมูล (กำลังโหลดหรือไม่)
- `error`: ข้อความผิดพลาด (ถ้ามี)
- `perfumesPage`: หมายเลขหน้าปัจจุบันของข้อมูลน้ำหอม
- `perfumesItemsPerPage`: จำนวนรายการน้ำหอมต่อหน้า
- `perfumesTotalPage`: จำนวนหน้าทั้งหมดของข้อมูลน้ำหอม

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบแบ่งออกเป็นหมวดหมู่ต่างๆ ดังนี้:

### 3.1 Reducer Actions

- **`setPerfumesPage`**: กำหนดหมายเลขหน้าปัจจุบัน
- **`nextPerfumesPage`**: เลื่อนไปยังหน้าถัดไป
- **`prevPerfumesPage`**: เลื่อนไปยังหน้าก่อนหน้า
- **`clearPerfumesPage`**: รีเซ็ตหมายเลขหน้าปัจจุบันเป็น 1
- **`addNewTotalPage`**: กำหนดจำนวนหน้าทั้งหมด

### 3.2 Async Thunks

- **`fetchTotalCount`**: ดึงข้อมูลจำนวนรายการทั้งหมดจากฐานข้อมูล

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 Reducer Actions

#### 4.1.1 `setPerfumesPage`

1. รับ `payload` เป็นหมายเลขหน้าที่ต้องการกำหนด
2. ทำการอัปเดต `state.perfumesPage` ด้วยค่า `payload`

#### 4.1.2 `nextPerfumesPage`

1. ทำการเพิ่มค่า `state.perfumesPage` ขึ้น 1

#### 4.1.3 `prevPerfumesPage`

1. ทำการลดค่า `state.perfumesPage` ลง 1

#### 4.1.4 `clearPerfumesPage`

1. ทำการกำหนดค่า `state.perfumesPage` เป็น 1

#### 4.1.5 `addNewTotalPage`

1. รับ `payload` เป็นจำนวนหน้าทั้งหมดที่ต้องการกำหนด
2. ทำการอัปเดต `state.perfumesTotalPage` ด้วยค่า `payload`

### 4.2 Async Thunks

#### 4.2.1 `fetchTotalCount`

1. ส่งคำขอไปยังฐานข้อมูลเพื่อดึงข้อมูลจำนวนรายการทั้งหมดของข้อมูลน้ำหอม
2. หากสำเร็จ, จะทำการคำนวณจำนวนหน้าทั้งหมด (`totalCount / perfumesItemsPerPage`) และอัปเดต `state.perfumesTotalPage`
3. หากเกิดข้อผิดพลาด, จะทำการตั้งค่า `state.error` เป็นข้อความผิดพลาด

## 5. การจัดการสถานะ (State Management)

ระบบจัดการสถานะ (state) ใน `paginationReducer.ts` มีลักษณะดังนี้:

- **Loading State**: เมื่อมีการเริ่มต้นการดึงข้อมูลจำนวนรายการทั้งหมด, `state.loading` จะถูกตั้งค่าเป็น `true` เพื่อแสดงสถานะการโหลด
- **Error Handling**: หากเกิดข้อผิดพลาดในการดึงข้อมูลจำนวนรายการทั้งหมด, `state.error` จะถูกตั้งค่าเป็นข้อความผิดพลาด
- **Page Number Management**: `state.perfumesPage` ถูกใช้เพื่อเก็บหมายเลขหน้าปัจจุบัน, และ actions ต่างๆ (`nextPerfumesPage`, `prevPerfumesPage`, `clearPerfumesPage`, `setPerfumesPage`) ถูกใช้เพื่อปรับปรุงค่านี้
- **Total Page Management**: `state.perfumesTotalPage` ถูกใช้เพื่อเก็บจำนวนหน้าทั้งหมด, และถูกคำนวณจากการดึงข้อมูลจำนวนรายการทั้งหมดใน `fetchTotalCount`

โดยรวมแล้ว, `paginationReducer.ts` เป็นส่วนสำคัญในการจัดการข้อมูลการแบ่งหน้าของข้อมูลน้ำหอมในแอปพลิเคชัน, โดยมีการจัดการ state อย่างมีประสิทธิภาพ, มีการจัดการข้อผิดพลาด, และมีฟังก์ชันที่ช่วยให้การเปลี่ยนหน้าเป็นไปได้อย่างราบรื่น
