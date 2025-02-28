import { configureStore } from "@reduxjs/toolkit";
import perfumeReducer from "./perfume/perfumeReducer";
import basketReducer from "./basket/basketReducer";
import userReducer from "./user/userReducer";

export const store = configureStore({
	reducer: {
		perfume: perfumeReducer,
		basket: basketReducer,
		user: userReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
