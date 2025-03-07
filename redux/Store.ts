import { configureStore } from "@reduxjs/toolkit";
import perfumeReducer from "./perfume/perfumeReducer";
import userReducer from "./user/userReducer";
import paginationReducer from "./pagination/paginationReducer";
import filtersPerfumeReducer from "./filters/filterPerfumesReducer";
import syncReduxMiddleware from "./ReduxMiddleware";

export const store = configureStore({
	reducer: {
		perfumes: perfumeReducer,
		user: userReducer,
        pagination: paginationReducer,
        filters: filtersPerfumeReducer,
    },
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(syncReduxMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
