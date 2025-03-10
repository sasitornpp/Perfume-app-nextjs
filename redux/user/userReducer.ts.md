# คู่มือการทำงานของ `userReducer.ts`

## 1. บทนำ

ไฟล์ `userReducer.ts` เป็นส่วนหนึ่งของระบบจัดการสถานะ (state management) ในแอปพลิเคชัน Next.js ที่เกี่ยวข้องกับข้อมูลผู้ใช้ (User) และข้อมูลโปรไฟล์ (Profile) โดยใช้ Redux Toolkit ไฟล์นี้มีหน้าที่จัดการ state ที่เกี่ยวข้องกับผู้ใช้, โปรไฟล์, น้ำหอมที่ผู้ใช้สร้าง, อัลบั้มน้ำหอมของผู้ใช้, ตะกร้าสินค้า (basket) และสถานะต่างๆ เช่น การโหลดข้อมูล, ข้อผิดพลาด, และการตรวจสอบว่าโปรไฟล์ของผู้ใช้ถูกสร้างขึ้นหรือไม่

## 2. โครงสร้างข้อมูลหลัก (State Structure)

โครงสร้างข้อมูลหลัก (state) ที่จัดการใน `userReducer.ts` มีดังนี้:

```typescript
interface UserState {
	user: User | null;
	profile: Profile | null;
	perfumes: Perfume[] | null;
	albums: AlbumWithPerfume[] | null;
	basket: Basket[] | null;
	loading: boolean;
	error: string | null;
	profileNotCreated: boolean;
}
```

โดยที่:

-   `user`: ข้อมูลผู้ใช้จาก Supabase (User object)
-   `profile`: ข้อมูลโปรไฟล์ของผู้ใช้ (Profile object)
-   `perfumes`: รายการน้ำหอมที่ผู้ใช้สร้าง (Perfume array)
-   `albums`: รายการอัลบั้มน้ำหอมของผู้ใช้ (AlbumWithPerfume array)
-   `basket`: รายการสินค้าในตะกร้าของผู้ใช้ (Basket array)
-   `loading`: สถานะการโหลดข้อมูล (กำลังโหลดหรือไม่)
-   `error`: ข้อความผิดพลาด (ถ้ามี)
-   `profileNotCreated`: สถานะที่บ่งบอกว่าโปรไฟล์ของผู้ใช้ยังไม่ได้ถูกสร้าง

## 3. ฟังก์ชันหลักในระบบ

ฟังก์ชันหลักในระบบแบ่งออกเป็นหมวดหมู่ต่างๆ ดังนี้:

### 3.1 การจัดการผู้ใช้ (User Management)

-   **`signInUser`**: ลงชื่อเข้าใช้ (Sign In)
-   **`signUpUser`**: ลงทะเบียน (Sign Up)
-   **`logoutUser`**: ออกจากระบบ (Logout)
-   **`fetchUserData`**: ดึงข้อมูลผู้ใช้และโปรไฟล์
-   **`createProfile`**: สร้างโปรไฟล์ผู้ใช้
-   **`updateProfile`**: อัปเดตโปรไฟล์ผู้ใช้

### 3.2 การจัดการน้ำหอม (Perfume Management)

-   **`fetchSuggestedPerfumes`**: ดึงน้ำหอมที่แนะนำสำหรับผู้ใช้
-   **`addMyPerfume`**: เพิ่มน้ำหอมที่ผู้ใช้สร้าง
-   **`editPerfume`**: แก้ไขน้ำหอมที่ผู้ใช้สร้าง
-   **`removePerfume`**: ลบน้ำหอมที่ผู้ใช้สร้าง

### 3.3 การจัดการอัลบั้ม (Album Management)

-   **`addNewAlbum`**: เพิ่มอัลบั้มใหม่
-   **`updateAlbum`**: อัปเดตอัลบั้ม
-   **`removeAlbum`**: ลบอัลบั้ม
-   **`togglePerfumeToAlbum`**: เพิ่ม/ลบ น้ำหอมในอัลบั้ม
-   **`toggleLikeAlbum`**: กดไลค์/ยกเลิกไลค์ อัลบั้ม

### 3.4 การจัดการตะกร้าสินค้า (Basket Management)

-   **`addPerfumeToBasket`**: เพิ่มน้ำหอมในตะกร้าสินค้า
-   **`removePerfumeFromBasket`**: ลบน้ำหอมออกจากตะกร้าสินค้า

## 4. อธิบายการทำงานของแต่ละฟังก์ชัน

### 4.1 การจัดการผู้ใช้

#### 4.1.1 `signInUser`

1.  รับ `email` และ `password` จากผู้ใช้.
2.  เรียกใช้ `supabaseClient.auth.signInWithPassword` เพื่อลงชื่อเข้าใช้.
3.  หากสำเร็จ, จะ dispatch `fetchUserData` เพื่อดึงข้อมูลผู้ใช้และโปรไฟล์.
4.  นำทางผู้ใช้ไปยังหน้า `/perfumes/home`.

#### 4.1.2 `signUpUser`

1.  รับ `email` และ `password` จากผู้ใช้.
2.  เรียกใช้ `supabaseClient.auth.signUp` เพื่อลงทะเบียน.
3.  หากสำเร็จ, จะนำทางผู้ใช้ไปยังหน้า `/login`.

#### 4.1.3 `logoutUser`

1.  เรียกใช้ `supabaseClient.auth.signOut` เพื่อออกจากระบบ.
2.  Dispatch action `logout` เพื่อล้างข้อมูลผู้ใช้ใน state.

#### 4.1.4 `fetchUserData`

1.  เรียกใช้ `supabaseClient.auth.getUser` เพื่อดึงข้อมูลผู้ใช้.
2.  เรียกใช้ Supabase RPC function `fetch_user` เพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้.
3.  หากสำเร็จ, จะทำการอัปเดต state ด้วยข้อมูลผู้ใช้และโปรไฟล์.
4.  หากไม่พบโปรไฟล์, จะตั้งค่า `profileNotCreated` เป็น `true`.

#### 4.1.5 `createProfile`

1.  รับข้อมูลโปรไฟล์จากผู้ใช้ (`name`, `gender`, `bio`, `imgFiles`).
2.  อัปโหลดรูปภาพโปรไฟล์ (ถ้ามี) ไปยัง Supabase Storage.
3.  สร้างข้อมูลโปรไฟล์ใน Supabase table `profiles`.
4.  หากสำเร็จ, จะ dispatch `fetchUserData` เพื่อดึงข้อมูลผู้ใช้และโปรไฟล์ที่อัปเดต.

#### 4.1.6 `updateProfile`

1.  รับข้อมูลโปรไฟล์ที่ต้องการอัปเดต (`formData`).
2.  อัปโหลดรูปภาพโปรไฟล์ใหม่ (ถ้ามี) ไปยัง Supabase Storage และลบรูปภาพเก่า (ถ้ามี).
3.  อัปเดตข้อมูลโปรไฟล์ใน Supabase table `profiles`.
4.  หากสำเร็จ, จะ dispatch `fetchUserData` เพื่อดึงข้อมูลผู้ใช้และโปรไฟล์ที่อัปเดต.

### 4.2 การจัดการน้ำหอม

#### 4.2.1 `fetchSuggestedPerfumes`

1.  รับ `filters` สำหรับการกรองน้ำหอม.
2.  เรียกใช้ Supabase RPC function `filter_perfumes` เพื่อดึงน้ำหอมที่แนะนำ.
3.  หากสำเร็จ, จะทำการอัปเดต `suggestions_perfumes` ในโปรไฟล์ของผู้ใช้.

#### 4.2.2 `addMyPerfume`

1.  รับข้อมูลน้ำหอมใหม่ (`formData`).
2.  อัปโหลดรูปภาพน้ำหอม (ถ้ามี) ไปยัง Supabase Storage.
3.  สร้างข้อมูลน้ำหอมใหม่ใน Supabase table `perfumes`.
4.  หากสำเร็จ, จะทำการเพิ่มน้ำหอมใหม่เข้าไปในรายการ `perfumes` ใน state.

#### 4.2.3 `editPerfume`

1.  รับข้อมูลน้ำหอมที่ต้องการแก้ไข (`formData`).
2.  ลบรูปภาพเก่า (ถ้ามีการเปลี่ยนแปลงรูปภาพ) และอัปโหลดรูปภาพใหม่ (ถ้ามี) ไปยัง Supabase Storage.
3.  อัปเดตข้อมูลน้ำหอมใน Supabase table `perfumes`.
4.  หากสำเร็จ, จะทำการปรับปรุงข้อมูลน้ำหอมในรายการ `perfumes` ใน state.

#### 4.2.4 `removePerfume`

1.  รับ `perfumeId` ของน้ำหอมที่ต้องการลบ.
2.  ลบรูปภาพน้ำหอมจาก Supabase Storage (ถ้ามี).
3.  ลบข้อมูลน้ำหอมออกจาก Supabase table `perfumes`.
4.  หากสำเร็จ, จะทำการลบน้ำหอมออกจากรายการ `perfumes` ใน state.

### 4.3 การจัดการอัลบั้ม

#### 4.3.1 `addNewAlbum`

1.  รับข้อมูลอัลบั้มใหม่ (`album`).
2.  อัปโหลดรูปภาพหน้าปกอัลบั้ม (ถ้ามี) ไปยัง Supabase Storage.
3.  สร้างข้อมูลอัลบั้มใหม่ใน Supabase table `albums`.
4.  หากสำเร็จ, จะทำการเพิ่มอัลบั้มใหม่เข้าไปในรายการ `albums` ใน state.

#### 4.3.2 `updateAlbum`

1.  รับข้อมูลอัลบั้มที่ต้องการแก้ไข (`album`).
2.  ลบรูปภาพหน้าปกเก่า (ถ้ามีการเปลี่ยนแปลงรูปภาพ) และอัปโหลดรูปภาพใหม่ (ถ้ามี) ไปยัง Supabase Storage.
3.  อัปเดตข้อมูลอัลบั้มใน Supabase table `albums`.
4.  หากสำเร็จ, จะทำการปรับปรุงข้อมูลอัลบั้มในรายการ `albums` ใน state.

#### 4.3.3 `removeAlbum`

1.  รับ `albumId` ของอัลบั้มที่ต้องการลบ.
2.  ลบรูปภาพหน้าปกอัลบั้มจาก Supabase Storage (ถ้ามี).
3.  ลบข้อมูลอัลบั้มออกจาก Supabase table `albums`.
4.  หากสำเร็จ, จะทำการลบอัลบั้มออกจากรายการ `albums` ใน state.

#### 4.3.4 `togglePerfumeToAlbum`

1.  รับ `album` (ข้อมูลของอัลบั้มที่จะทำการเพิ่ม/ลบน้ำหอม) และ `perfumeId`.
2.  ปรับปรุงรายการ `perfumes_id` ในอัลบั้ม (เพิ่มหรือลบ `perfumeId`).
3.  อัปเดตข้อมูลอัลบั้มใน Supabase table `albums`.
4.  หากสำเร็จ, จะทำการปรับปรุงข้อมูลอัลบั้มในรายการ `albums` ใน state.

#### 4.3.5 `toggleLikeAlbum`

1.  รับ `albumId` ของอัลบั้มที่ต้องการกดไลค์/ยกเลิกไลค์.
2.  ปรับปรุงรายการ `likes` ในอัลบั้ม (เพิ่มหรือลบ `userId`).
3.  อัปเดตข้อมูลอัลบั้มใน Supabase table `albums`.
4.  หากสำเร็จ, จะทำการปรับปรุงข้อมูลอัลบั้มในรายการ `albums` ใน state.

### 4.4 การจัดการตะกร้าสินค้า

#### 4.4.1 `addPerfumeToBasket`

1.  รับ `perfumeId` ของน้ำหอมที่ต้องการเพิ่มในตะกร้าสินค้า.
2.  สร้างข้อมูลใน Supabase table `baskets`.
3.  หากสำเร็จ, จะทำการเพิ่มข้อมูลในรายการ `basket` ใน state.

#### 4.4.2 `removePerfumeFromBasket`

1.  รับ `basketId` ของรายการที่ต้องการลบออกจากตะกร้าสินค้า.
2.  ลบข้อมูลออกจาก Supabase table `baskets`.
3.  หากสำเร็จ, จะทำการลบรายการออกจากรายการ `basket` ใน state.

## 5. การจัดการสถานะ (State Management)

ระบบจัดการสถานะ (state) ใน `userReducer.ts` มีลักษณะดังนี้:

-   **Loading State**: เมื่อมีการเริ่มต้นการดึงข้อมูลหรืออัปเดตข้อมูล, `state.loading` จะถูกตั้งค่าเป็น `true` เพื่อแสดงสถานะการโหลด.
-   **Error Handling**: หากเกิดข้อผิดพลาดในการดึงข้อมูลหรืออัปเดตข้อมูล, `state.error` จะถูกตั้งค่าเป็นข้อความผิดพลาด.
-   **User Authentication**: ข้อมูลผู้ใช้และโปรไฟล์ถูกเก็บไว้ใน `state.user` และ `state.profile` เพื่อให้แอปพลิเคชันสามารถตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้.
-   **Profile Creation**: `state.profileNotCreated` ถูกใช้เพื่อตรวจสอบว่าผู้ใช้ได้สร้างโปรไฟล์แล้วหรือไม่.
-   **Data Management**: ข้อมูลน้ำหอม, อัลบั้ม, และตะกร้าสินค้าถูกเก็บไว้ใน state เพื่อให้แอปพลิเคชันสามารถแสดงข้อมูลเหล่านี้ได้อย่างรวดเร็ว.
-   **Immutability**: Redux Toolkit และ `createSlice` ช่วยให้มั่นใจได้ว่า state จะถูกจัดการแบบ immutable ซึ่งช่วยป้องกันข้อผิดพลาดที่อาจเกิดขึ้นจากการเปลี่ยนแปลง state โดยตรง.

โดยรวมแล้ว, `userReducer.ts` เป็นส่วนสำคัญในการจัดการข้อมูลผู้ใช้และข้อมูลที่เกี่ยวข้องในแอปพลิเคชัน, โดยมีการจัดการ state อย่างมีประสิทธิภาพ, มีการจัดการข้อผิดพลาด, และมีการใช้ Supabase เป็น backend ในการจัดการข้อมูล.