"use client";

import React, { useEffect } from "react";
import { fetchUserData } from "@/redux/user/userReducer";
import {
	fetchPerfumes,
	fetchTop5ViewsByDate,
	fetchTop3ViewsAllTime,
	fetchUniqueData,
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

	useEffect(() => {
		// Use this effect to fetch initial data only once
		dispatch(fetchUserData());
		dispatch(fetchUniqueData());
		dispatch(fetchTop5ViewsByDate({ date: new Date() }));
		dispatch(fetchTop3ViewsAllTime());
		dispatch(fetchTotalCount());
		// fetchTradablePerfumes();
	}, []); // Only depend on dispatch which should be stable

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
