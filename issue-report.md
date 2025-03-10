# สรุปปัญหาและวิธีแก้ไข: Selector ใน Redux ทำให้เกิด Rerender ไม่จำเป็น

## ปัญหาในโค้ด React/Next.js ที่ใช้ Redux มีการใช้ useSelector เพื่อเลือกข้อมูลจาก Redux state ซึ่งทำให้เกิดคำเตือน

Selector Header.useSelector[basketItems] returned a different result when called with the same parameters. This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized: <https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization>

นอกจากนี้ยังมีปัญหา `GET /hero-bg.jpg 404` ซึ่งบ่งบอกว่าไฟล์ static ไม่พบใน server

### **โค้ดที่เกี่ยวข้อง**

```javascript
const tradablePerfumes = useSelector((state: RootState) =>
  state.perfumes.tradablePerfumes.filter((perfume) =>
    perfume_ids?.includes(perfume.id),
  ),
);

const basketItems = useSelector((state: RootState) =>
  state.perfumes.tradablePerfumes.filter((perfume) =>
    profile?.basket?.includes(perfume.id),
  ),
);
```

## **สาเหตุ**

1. **การสร้าง Array ใหม่ทุกครั้ง**:
   - ฟังก์ชัน filter สร้าง array ใหม่ทุกครั้งที่ selector ถูกเรียก แม้ว่าข้อมูล (state.perfumes.tradablePerfumes, perfume_ids, หรือ profile.basket) จะไม่เปลี่ยนแปลง
   - React-Redux ใช้ strict equality (===) ตรวจสอบ reference ทำให้เกิด rerender ที่ไม่จำเป็น

2. **ตัวแปรนอก Redux State**:
   - perfume_ids และ profile อาจมาจากนอก Redux state (เช่น props หรือ local state) ทำให้ selector ไม่สามารถ memoize ได้อย่างสมบูรณ์

3. **ปัญหา 404**:
   - ไฟล์ hero-bg.jpg ไม่พบในโฟลเดอร์ /public หรือ path ไม่ถูกต้อง

## **วิธีแก้ไข**

### 1. Memoize Selector ด้วย createSelector

ใช้ reselect เพื่อ memoize selector และป้องกันการสร้าง reference ใหม่:

#### กรณี: perfume_ids และ profile อยู่นอก Redux State

```javascript
import { createSelector } from 'reselect';
import { RootState } from './your-redux-types';

const selectTradablePerfumes = (state: RootState) => state.perfumes.tradablePerfumes;

const selectFilteredTradablePerfumes = (perfume_ids: string[] | undefined) =>
  createSelector(
    [selectTradablePerfumes],
    (tradablePerfumes) =>
      tradablePerfumes.filter((perfume) => perfume_ids?.includes(perfume.id)),
  );

const selectBasketItems = (profile: { basket?: string[] } | null) =>
  createSelector(
    [selectTradablePerfumes],
    (tradablePerfumes) =>
      tradablePerfumes.filter((perfume) => profile?.basket?.includes(perfume.id)),
  );

const Header = ({ perfume_ids, profile }) => {
  const filteredTradablePerfumesSelector = selectFilteredTradablePerfumes(perfume_ids);
  const basketItemsSelector = selectBasketItems(profile);

  const tradablePerfumes = useSelector(filteredTradablePerfumesSelector);
  const basketItems = useSelector(basketItemsSelector);

  return (
    <div>
      <p>Tradable Perfumes: {tradablePerfumes.length}</p>
      <p>Basket Items: {basketItems.length}</p>
    </div>
  );
};
```

**กรณี: perfume_ids และ profile อยู่ใน Redux State**

```javascript
import { createSelector } from 'reselect';
import { RootState } from './your-redux-types';

const selectTradablePerfumes = (state: RootState) => state.perfumes.tradablePerfumes;
const selectPerfumeIds = (state: RootState) => state.someSlice.perfume_ids;
const selectProfile = (state: RootState) => state.user.profile;

const selectFilteredTradablePerfumes = createSelector(
  [selectTradablePerfumes, selectPerfumeIds],
  (tradablePerfumes, perfume_ids) =>
    tradablePerfumes.filter((perfume) => perfume_ids?.includes(perfume.id)),
);

const selectBasketItems = createSelector(
  [selectTradablePerfumes, selectProfile],
  (tradablePerfumes, profile) =>
    tradablePerfumes.filter((perfume) => profile?.basket?.includes(perfume.id)),
);

const Header = () => {
  const tradablePerfumes = useSelector(selectFilteredTradablePerfumes);
  const basketItems = useSelector(selectBasketItems);

  return (
    <div>
      <p>Tradable Perfumes: {tradablePerfumes.length}</p>
      <p>Basket Items: {basketItems.length}</p>
    </div>
  );
};
```

### 2. แก้ปัญหา 404 (GET /hero-bg.jpg)

- ตรวจสอบว่าไฟล์ hero-bg.jpg อยู่ในโฟลเดอร์ /public
- ปรับ path ให้ถูกต้อง เช่น:

```javascript
<img src="/hero-bg.jpg" /> // ถ้าอยู่ใน /public
<img src="/images/hero-bg.jpg" /> // ถ้าอยู่ใน /public/images
```

## **คำแนะนำเพิ่มเติม**

### 1. Optimize ประสิทธิภาพ

ถ้า tradablePerfumes มีขนาดใหญ่ ใช้ Set แทน array ใน includes:

```javascript
const selectBasketItems = createSelector(
  [selectTradablePerfumes, selectProfile],
  (tradablePerfumes, profile) => {
    const basketSet = new Set(profile?.basket);
    return tradablePerfumes.filter((perfume) => basketSet.has(perfume.id));
  },
);
```

### 2. จัดการกรณี null/undefined

เพิ่มเงื่อนไขเพื่อผลลัพธ์ที่ชัดเจน:

```javascript
const selectFilteredTradablePerfumes = createSelector(
  [selectTradablePerfumes, selectPerfumeIds],
  (tradablePerfumes, perfume_ids) =>
    perfume_ids
      ? tradablePerfumes.filter((perfume) => perfume_ids.includes(perfume.id))
      : [],
);
```

### 3. ตรวจสอบแหล่งข้อมูล

- ระบุที่มาของ perfume_ids และ profile (props, local state, หรือ Redux state) เพื่อปรับโค้ดให้เหมาะสม

## **ผลลัพธ์**

- Selector จะส่งคืน reference เดิมเมื่อข้อมูลไม่เปลี่ยนแปลง
- คำเตือน rerender หายไป
- ปัญหา 404 ได้รับการแก้ไขเมื่อไฟล์อยู่ในตำแหน่งที่ถูกต้อง

---

## **ปัญหาการเรียกใช้ `firstRender()` ใน Middleware**

### 1. **การเรียกใช้ `firstRender()` ใน Middleware**

- **ปัญหา:** คุณพยายามเรียกใช้ฟังก์ชัน `firstRender()` ใน Next.js middleware ซึ่งไม่สามารถเข้าถึง Redux Store ได้ เนื่องจาก middleware ของ Next.js ทำงานใน Edge runtime ซึ่งไม่สามารถใช้งาน Redux ได้โดยตรง

- **สาเหตุ:** Next.js middleware ทำงานใน **Edge runtime** ซึ่งไม่มี access ไปยัง **Redux Store** และการเรียกใช้ `dispatch` จากในนั้นจะไม่สามารถทำงานได้ตามที่คาดหวัง
- **การแก้ไข:** ฟังก์ชัน `firstRender()` ควรจะถูกเรียกจากส่วนของ React components ที่สามารถเข้าถึง Redux store ได้ (เช่น ใน `_app.tsx` หรือใน `useEffect()` ของ Component หลัก)

### 2. **การใช้งาน Redux Store ใน Middleware**

- **ปัญหา:** ใน `syncWishlistToSupabaseMiddleware` คุณใช้ `storeInstance` เพื่อ dispatch actions ไปยัง Redux store แต่การใช้งาน `storeInstance` นี้อาจจะเกิดปัญหาหากไม่ได้ inject store เข้ามาก่อน

- **สาเหตุ:** Middleware ต้องการ access ไปยัง Redux store ซึ่งจะต้อง `injectStore()` เข้ามาก่อนเพื่อให้สามารถใช้ `storeInstance` ได้อย่างถูกต้อง
- **การแก้ไข:** ให้ใช้ฟังก์ชัน `injectStore(store)` ใน `_app.tsx` เพื่อ inject store ให้ middleware ก่อนที่จะใช้ `storeInstance`

### 3. **การเรียกใช้ `firstRender()` ในสถานที่ที่ไม่ถูกต้อง**

- **ปัญหา:** การเรียกใช้ `firstRender()` ในบางกรณีอาจจะไม่ได้ทำงานตามที่คาดไว้

- **สาเหตุ:** เนื่องจาก `firstRender()` ถูกออกแบบให้ทำงานกับ Redux store และต้องการข้อมูลจาก session ใน Supabase เมื่อถูกเรียกใช้ใน component หลักของแอปจะทำให้แอปโหลดข้อมูลสำคัญในครั้งแรกได้
- **การแก้ไข:** ใช้ `useEffect` ใน `_app.tsx` หรือใน component หลักเพื่อตั้งค่า Redux store และเรียก `firstRender()` เพื่อให้มันทำงานในครั้งแรกที่แอปโหลด

## **แนวทางการแก้ไข:**

### 1. **การใช้ `firstRender()` ใน `_app.tsx`**

แก้ไข `_app.tsx` ให้เรียก `firstRender()` ภายใน `useEffect` หลังจากที่ `store` ถูก inject แล้ว

```tsx
import { useEffect } from "react";
import { injectStore, firstRender } from "@/redux/ReduxMiddleware";
import store from "@/redux/store"; // นำเข้า store ที่ใช้ในแอป

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    injectStore(store); // กำหนด store ให้ middleware
    firstRender(); // โหลดข้อมูลจาก Supabase ในครั้งแรก
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
```

### 2. **การใช้ Middleware กับ Redux Store**

ตรวจสอบให้แน่ใจว่า `injectStore()` ถูกเรียกใน `_app.tsx` ก่อนที่ฟังก์ชัน middleware จะถูกใช้งาน

```tsx
export const injectStore = (_store: any) => {
  storeInstance = _store;
};
```

### 3. **แก้ไขข้อผิดพลาดที่อาจเกิดขึ้นใน `firstRender()`**

เพิ่มการตรวจสอบใน `firstRender()` เพื่อให้แน่ใจว่า store ถูก inject แล้ว

```tsx
export async function firstRender() {
  if (!storeInstance) {
    throw new Error("Store not initialized. Call injectStore first.");
  }
  // ฟังก์ชันอื่นๆ ที่ต้องการให้ทำงาน
}
```

## **สรุปการแก้ไข:**

- **อย่าใช้ `firstRender()` ใน middleware ของ Next.js** เพราะมันไม่สามารถเข้าถึง Redux store ได้

- **ใช้ `firstRender()` ใน `_app.tsx`** หรือใน component หลัก ที่สามารถเข้าถึง Redux store ได้
- **ตรวจสอบให้แน่ใจว่า store ถูก inject** ใน `_app.tsx` ก่อนการเรียกใช้งาน Middleware และ `firstRender()`
  
# ปัญหา Redux State

### 1. Error ที่เกิดขึ้น

ข้อความ Error: "Cannot read properties of undefined (reading 'Filters')"
Stack Trace: ชี้ไปที่ filterPerfumesReducer.ts:73:42 ซึ่งอยู่ใน setFiltersAndFetch:

```typescript
const currentFilters = state.filters.Filters;
```

บริบท: Error นี้เกิดเมื่อมีการพยายามเข้าถึง Filters จาก object ที่เป็น undefined (ในที่นี้คือ state.filters)

### 2. โครงสร้าง Redux Store

จาก Store.ts:

```typescript
export const store = configureStore({
    reducer: {
        perfumes: perfumeReducer,
        user: userReducer,
        pagination: paginationReducer,
        filters: filtersPerfumeReducer, // ชื่อ slice เป็น "filters"
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(syncReduxMiddleware),
});
```

Reducer filtersPerfumeReducer ถูกกำหนดด้วย key "filters"
ดังนั้น state จะมีโครงสร้าง:

```typescript
{
    perfumes: {...},
    user: {...},
    pagination: {...},
    filters: {
        perfumes: {...},
        Filters: {...},
        error: null,
        loading: false
    }
}
```

การเข้าถึง Filters ต้องใช้ state.filters.Filters ไม่ใช่ state.filterPerfumes.Filters

### 3. โค้ดที่เกี่ยวข้อง

setFiltersAndFetch (บรรทัด 73):

```typescript
export const setFiltersAndFetch = createAsyncThunk(
    "filterPerfumes/setFiltersAndFetch",
    async (filters: Filters, { dispatch, getState }) => {
        const state = getState() as RootState;
        const currentFilters = state.filters.Filters; // บรรทัด 73
        if (!areFiltersEqual(currentFilters, filters)) {
            dispatch(setFilters(filters));
            dispatch(fetchNewPerfumesFilters({ filters }));
        }
    },
);
```

ใช้ state.filters.Filters ซึ่งตรงกับชื่อ slice "filters" ใน Store.ts
ถ้า state.filters เป็น undefined จะเกิด error ที่นี่

fetchPerfumesByFilters (บรรทัด 125):

```typescript
export const fetchPerfumesByFilters = createAsyncThunk(
    "filterPerfumes/fetchPerfumesByFilters",
    async (_, { rejectWithValue, getState }) => {
        const state = getState() as {
            filterPerfumes: FilterPerfumesState; // ผิด! ควรเป็น filters
            pagination: PaginationState;
        };
        const filters = state.filterPerfumes.Filters || {}; // บรรทัด 125
        const currentPage = state.pagination.perfumesPage;
        // ...
    },
);
```

ใช้ state.filterPerfumes.Filters ซึ่ง ไม่ตรง กับ Store.ts เพราะไม่มี filterPerfumes ใน state มีแค่ filters
ถ้าถูกเรียกและ state.filterPerfumes เป็น undefined จะ error ที่บรรทัด 125

### 4. State ที่ส่งมา

จาก JSON:

```json
{
    "filters": {
        "perfumes": {...},
        "Filters": {
            "search_query": "a",
            "brand_filter": null,
            "gender_filter": null,
            "accords_filter": [],
            "top_notes_filter": [],
            "middle_notes_filter": [],
            "base_notes_filter": []
        },
        "error": null,
        "loading": true
    },
    "pagination": {
        "perfumesPage": 2,
        "perfumesItemsPerPage": 20,
        "perfumesTotalPage": 43,
        ...
    },
    ...
}
```

State มี filters.Filters จริง ซึ่งสอดคล้องกับ Store.ts
ไม่มี filterPerfumes ใน state เลย

### 5. ความขัดแย้ง

Stack Trace ชี้ไปที่บรรทัด 73 (setFiltersAndFetch):

- ใช้ state.filters.Filters ซึ่งควรใช้งานได้ตามโครงสร้าง state
- ถ้า error เกิดที่นี่ แปลว่า state.filters เป็น undefined ในขณะที่ setFiltersAndFetch ถูกเรียก

แต่ fetchPerfumesByFilters ใช้ชื่อผิด:

- ใช้ state.filterPerfumes.Filters ซึ่งจะ error ถ้าถูกเรียก เพราะ state.filterPerfumes ไม่มีใน state
- ถ้า error เกิดที่นี่ Stack trace ควรชี้ไปที่บรรทัด 125 ไม่ใช่ 73

## สาเหตุที่เป็นไปได้

### Timing Issue

setFiltersAndFetch ถูก dispatch ก่อนที่ Redux store จะ initialize เสร็จ ทำให้ state.filters เป็น undefined
สาเหตุอาจมาจาก:

- การเรียก thunk ใน middleware หรือ component ก่อนที่ store จะพร้อม
- การ setup store ใน Next.js ที่อาจมีปัญหาเรื่อง hydration หรือ server-side rendering

### การเรียก setFiltersAndFetch เป็นจุดเริ่มต้น

จากโค้ด:

```typescript
if (!areFiltersEqual(currentFilters, filters)) {
    dispatch(setFilters(filters));
    dispatch(fetchNewPerfumesFilters({ filters }));
}
```

ถ้า state.filters เป็น undefined ที่บรรทัด 73 การ dispatch ไปยัง fetchPerfumesByFilters จะไม่เกิดขึ้น
ดังนั้น error อาจหยุดที่ setFiltersAndFetch ก่อนถึง fetchPerfumesByFilters

### Stack Trace คลาดเคลื่อน

Webpack หรือ minification อาจทำให้ stack trace ชี้ไปที่บรรทัด 73 แทน 125
ถ้า fetchPerfumesByFilters ถูกเรียกจริง (เช่น จาก middleware) และ error ที่ state.filterPerfumes.Filters การชี้ผิดบรรทัดอาจเกิดขึ้นได้

### Context ผิด

ถ้า getState() ถูกเรียกจาก store instance ที่ไม่ใช่ตัวเดียวกับที่ render ใน app (เช่น มีหลาย store หรือ import ผิด) อาจทำให้ state ไม่มีค่า

## สรุปปัญหาโดยละเอียด

**จุดเกิด Error:** หลักฐานจาก stack trace ชี้ว่า error เกิดใน setFiltersAndFetch (บรรทัด 73) เมื่อ state.filters เป็น undefined

**สาเหตุหลัก:**

1. Initialization ไม่สมบูรณ์: Store ยังไม่พร้อมในขณะที่ setFiltersAndFetch ถูกเรียก
2. ชื่อ Slice ไม่ตรงใน fetchPerfumesByFilters: ใช้ state.filterPerfumes แทน state.filters ซึ่งอาจทำให้เกิด confusion ถ้า fetchPerfumesByFilters ถูกเรียกใน flow อื่น

**ทำไม fetchPerfumesByFilters ไม่ถูกชี้:**

- ถ้า error หยุดที่ setFiltersAndFetch การ dispatch ไปยัง fetchPerfumesByFilters หรือ fetchNewPerfumesFilters จะไม่เกิด
- หรือถ้า fetchPerfumesByFilters ถูกเรียกในบริบทอื่น Stack trace อาจคลาดเคลื่อน

## วิธีแก้ไข

### 1. แก้ชื่อ Slice ใน fetchPerfumesByFilters

```typescript
export const fetchPerfumesByFilters = createAsyncThunk(
    "filterPerfumes/fetchPerfumesByFilters",
    async (_, { rejectWithValue, getState }) => {
        const state = getState() as {
            filters: FilterPerfumesState; // แก้จาก filterPerfumes เป็น filters
            pagination: PaginationState;
        };
        const filters = state.filters.Filters || {};
        const currentPage = state.pagination.perfumesPage;
        // ...
    },
);
```

### 2. ป้องกัน Undefined

**setFiltersAndFetch:**

```typescript
export const setFiltersAndFetch = createAsyncThunk(
    "filterPerfumes/setFiltersAndFetch",
    async (filters: Filters, { dispatch, getState }) => {
        const state = getState() as RootState;
        const currentFilters = state.filters?.Filters; // เพิ่ม optional chaining
        if (!state.filters) {
            // Initialize filters ถ้ายังไม่มี
            dispatch(setFilters(filters));
            dispatch(fetchNewPerfumesFilters({ filters }));
            return;
        }
        if (!areFiltersEqual(currentFilters, filters)) {
            dispatch(setFilters(filters));
            dispatch(fetchNewPerfumesFilters({ filters }));
        }
    },
);
```

**fetchPerfumesByFilters:**

```typescript
export const fetchPerfumesByFilters = createAsyncThunk(
    "filterPerfumes/fetchPerfumesByFilters",
    async (_, { rejectWithValue, getState }) => {
        const state = getState() as RootState; // ใช้ RootState ที่ถูกกำหนดไว้แล้ว
        const filters = state.filters?.Filters || {}; // เพิ่ม optional chaining
        const currentPage = state.pagination?.perfumesPage || 1; // ป้องกันกรณี pagination undefined
        // ...
    },
);
```

### 3. ตรวจสอบการ Initialize Store

ถ้าใช้ Next.js ควรตรวจสอบว่า store ถูกสร้างอย่างถูกต้องใน _app.tsx หรือ layout.tsx:

```typescript
// _app.tsx
import { Provider } from 'react-redux';
import { store } from '../store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
```

### 4. ไม่เรียก Dispatch ใน Server Side

ถ้าใช้ Next.js ไม่ควรเรียก dispatch ใน getServerSideProps หรือ getStaticProps โดยตรง ควรเรียกหลังจาก component mount:

```typescript
useEffect(() => {
  // รอให้ component mount แล้วค่อย dispatch
  dispatch(setFiltersAndFetch(initialFilters));
}, []);
```

### 5. การจัดการ Redux Store ใน SSR

ถ้าใช้ Next.js และต้องการให้ initial state ถูกต้อง:

```typescript
// pages/index.js
export async function getServerSideProps() {
  const initialFilters = { /* ... */ };
  return {
    props: {
      initialFilters,
    },
  };
}

function HomePage({ initialFilters }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (initialFilters) {
      dispatch(setFilters(initialFilters)); // set filters โดยตรงก่อน
      // หลังจากนั้นค่อยเรียก fetch
      dispatch(fetchNewPerfumesFilters({ filters: initialFilters })); 
    }
  }, [initialFilters]);
  
  return (/* ... */);
}
```

## การป้องกันในอนาคต

1. **การตั้งชื่อ Slice ให้ชัดเจน:** ใช้ชื่อ slice ที่บ่งบอกถึงข้อมูลที่เก็บ เช่น filtersSlice แทน filterPerfumes
2. **TypeScript Interface ที่ถูกต้อง:** กำหนด RootState ให้ชัดเจนและใช้ตลอดทั้งแอพ
3. **ใช้ Optional Chaining:** เพิ่ม ?. เมื่อเข้าถึงข้อมูลที่อาจเป็น undefined
4. **ใช้ Redux Selector:** สร้าง selector function ที่ดึงข้อมูลจาก state เพื่อลดการเข้าถึง nested state โดยตรง
5. **Redux Middleware ตรวจสอบ State:** สร้าง middleware เพื่อตรวจสอบและแจ้งเตือนถ้ามีการเข้าถึง state path ที่ไม่มีอยู่

## แผนการแก้ไข

1. แก้ไขชื่อ slice ใน fetchPerfumesByFilters จาก filterPerfumes เป็น filters
2. เพิ่ม optional chaining ใน setFiltersAndFetch และ fetchPerfumesByFilters
3. ตรวจสอบจุดที่เรียก dispatch(setFiltersAndFetch(...)) และทำให้แน่ใจว่า store ถูก initialize เรียบร้อยแล้ว
4. สร้าง TypeScript interface สำหรับ RootState ที่ถูกต้องและใช้อย่างสม่ำเสมอ
5. พิจารณาการใช้ Redux Toolkit createSelector เพื่อเข้าถึง Filters อย่างปลอดภัย
