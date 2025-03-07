import { Middleware } from "@reduxjs/toolkit";
import { store } from "@/redux/Store";
import { setPerfumesPage } from "@/redux/pagination/paginationReducer";
import {
	fetchPerfumesByFilters,
	Filters,
} from "@/redux/filters/filterPerfumesReducer";

const syncReduxMiddleware: Middleware = () => (next) => async (action) => {
	next(action);
	const typedAction = action as { type: string; payload?: Filters };

	try {
		switch (typedAction.type) {
			case setPerfumesPage.type:
				console.log("setPerfumesPage triggered");
				const result = await store.dispatch(fetchPerfumesByFilters());
				console.log("fetchPerfumesByFilters result:", result);
				break;

			default:
				break;
		}
	} catch (error) {
		console.error(error);
	}
};

export default syncReduxMiddleware;
