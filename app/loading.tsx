"use client";

import React, { useEffect } from "react";
import { fetchUserData } from "@/redux/user/userReducer";
import {
	fetchPerfumes,
	fetchTradablePerfumes,
	fetchTop5ViewsByDate,
	fetchTop5ViewsAllTime,
} from "@/redux/perfume/perfumeReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { fetchTotalCount } from "@/redux/pagination/paginationReducer";
import LoadingComponents from "@/components/loading";

function LoadingPage({ children }: { readonly children: React.ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();

	const pagination = useSelector((state: RootState) => state.pagination);

	const userLoading = useSelector((state: RootState) => state.user.loading);
	const perfumesLoading = useSelector(
		(state: RootState) => state.perfumes.loading,
	);

	useEffect(() => {
		dispatch(fetchUserData());
		dispatch(
			fetchTop5ViewsByDate({ date: new Date(), sourceTable: "perfumes" }),
		);
		dispatch(
			fetchTop5ViewsByDate({
				date: new Date(),
				sourceTable: "tradable_perfumes",
			}),
		);
		dispatch(fetchTop5ViewsAllTime({ sourceTable: "perfumes" }));
		dispatch(fetchTop5ViewsAllTime({ sourceTable: "tradable_perfumes" }));
		dispatch(fetchTotalCount({ tableName: "perfumes" }));
		dispatch(fetchTotalCount({ tableName: "tradable_perfumes" }));
		// fetchTradablePerfumes();
	}, []);

	useEffect(() => {
		dispatch(
			fetchTradablePerfumes({
				pageNumber: pagination.tradablePerfumesPage,
				itemsPerPage: pagination.tradablePerfumesItemsPerPage,
			}),
		);
	}, [pagination.tradablePerfumesPage]);

	useEffect(() => {
		// console.log("fetching perfumes");
		dispatch(
			fetchPerfumes({
				pageNumber: pagination.perfumesPage,
				itemsPerPage: pagination.perfumesItemsPerPage,
			}),
		);
	}, [pagination.perfumesPage]);

	if (userLoading) {
		return (
			<LoadingComponents
				title={`${userLoading ? "Loading User Data" : "Loading Perfumes"}`}
				description={`${
					userLoading
						? "Fetching your user profile and preferences..."
						: "Loading the latest perfumes..."
				}`}
			/>
		);
	}

	return <>{children}</>;
}

export default LoadingPage;
