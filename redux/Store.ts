import { configureStore } from "@reduxjs/toolkit";
import perfumeReducer from "./perfume/perfumeReducer";
import userReducer from "./user/userReducer";
import paginationReducer from "./pagination/paginationReducer";
import syncWishlistToSupabaseMiddleware from "./ReduxMiddleware";

export const store = configureStore({
	reducer: {
		perfumes: perfumeReducer,
		user: userReducer,
        pagination: paginationReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(syncWishlistToSupabaseMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
