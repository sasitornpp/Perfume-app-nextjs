import { Middleware } from "@reduxjs/toolkit";
import {
	updateProfile,
} from "@/redux/user/userReducer";
import { store } from "@/redux/Store";

const syncWishlistToSupabaseMiddleware: Middleware =
	() => (next) => async (action) => {
		next(action);
		const actionType = (action as { type: string }).type;
		try {
			switch (actionType) {
				// case updateWishlist.type: {
				// 	const addAction = action as ReturnType<
				// 		typeof updateWishlist
				// 	>;
				// 	const wishList = addAction.payload;

				// 	await store.dispatch(
				// 		updateProfile({
				// 			columns: "wishlist",
				// 			values: wishList.wishlist,
				// 		}),
				// 	);

				// 	break;
				// }

				// case updateBasket.type: {
				// 	const addAction = action as ReturnType<typeof updateBasket>;
				// 	const basket = addAction.payload;

				// 	await store.dispatch(
				// 		updateProfile({
				// 			columns: "basket",
				// 			values: basket.basket,
				// 		}),
				// 	);

				// 	break;
				// }

				default:
					break;
			}
		} catch (error) {
			console.error("Supabase sync failed:", error);
		}
	};

export default syncWishlistToSupabaseMiddleware;
