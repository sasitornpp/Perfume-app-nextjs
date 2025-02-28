import { configureStore } from "@reduxjs/toolkit";
import perfumeReducer from "./perfume/perfumeReducer";
import userReducer from "./user/userReducer";
import syncWishlistToSupabaseMiddleware, {
	firstRender,injectStore
} from "./ReduxMiddleware";

export const store = configureStore({
	reducer: {
		perfumes: perfumeReducer,
		user: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(syncWishlistToSupabaseMiddleware),
});
injectStore(store);
firstRender();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
