import { configureStore } from "@reduxjs/toolkit";
import perfumeReducer from "./perfume/perfumeReducer";
import { subscribeToSessionChanges } from "./middleware";
import basketReducer from "./basket/basketReducer";
import userReducer from "./user/userReducer";
import middleware from "./middleware";

export const store = configureStore({
  reducer: {
    perfume: perfumeReducer,
    basket: basketReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

subscribeToSessionChanges();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

