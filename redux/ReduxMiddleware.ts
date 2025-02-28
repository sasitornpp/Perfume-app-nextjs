import { Middleware } from "@reduxjs/toolkit";
import { fetchUserData } from "./user/userReducer";
import { fetchPerfumes, fetchTradablePerfumes } from "./perfume/perfumeReducer";
import {
	updateWishlist,
	updateProfile,
	updateBasket,
} from "@/redux/user/userReducer";
import { supabaseClient } from "@/utils/supabase/client";
let storeInstance: any;

export const injectStore = (_store: any) => {
	storeInstance = _store;
};

const syncWishlistToSupabaseMiddleware: Middleware =
	() => (next) => async (action) => {
		next(action);
		const actionType = (action as { type: string }).type;
		try {
			switch (actionType) {
				case updateWishlist.type: {
					const addAction = action as ReturnType<
						typeof updateWishlist
					>;
					const wishList = addAction.payload;

					await storeInstance.dispatch(
						updateProfile({
							columns: "wishlist",
							values: wishList.wishlist,
						}),
					);

					break;
				}

				case updateBasket.type: {
					const addAction = action as ReturnType<typeof updateBasket>;
					const basket = addAction.payload;

					await storeInstance.dispatch(
						updateProfile({
							columns: "basket",
							values: basket.basket,
						}),
					);

					break;
				}

				default:
					break;
			}
		} catch (error) {
			console.error("Supabase sync failed:", error);
		}
	};

export default syncWishlistToSupabaseMiddleware;

export async function firstRender() {
	if (!storeInstance) {
		throw new Error("Store not initialized. Call injectStore first.");
	}

	try {
		const { data } = await supabaseClient.auth.getSession();

		// Dispatch perfume-related actions together
		await Promise.all([
			storeInstance.dispatch(fetchPerfumes()),
			storeInstance.dispatch(fetchTradablePerfumes()),
		]);

		// Dispatch user data separately if session exists
		if (data.session) {
			await storeInstance.dispatch(fetchUserData());
		}
	} catch (error) {
		console.error("Error during firstRender:", error);
	}
}
