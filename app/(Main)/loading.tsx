"use client";

import React, { useEffect, useState } from "react";
import { fetchUserData } from "@/redux/user/userReducer";
import {
	fetchPerfumes,
	fetchTop5ViewsByDate,
	fetchTop3ViewsAllTime,
	fetchUniqueData,
} from "@/redux/perfume/perfumeReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/Store";
import { fetchTotalCount } from "@/redux/pagination/paginationReducer";
import LoadingComponents from "@/components/loading";
import { supabaseClient } from "@/utils/supabase/client";

function LoadingPage({ children }: { readonly children: React.ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const pagination = useSelector((state: RootState) => state.pagination);
	const userLoading = useSelector((state: RootState) => state.user.loading);

	const [isResettingPassword, setIsResettingPassword] = useState(false);

	useEffect(() => {
		// ตรวจสอบว่า User กำลังอยู่ในโหมด Reset Password หรือไม่
		const { data: authListener } = supabaseClient.auth.onAuthStateChange(
			(event, session) => {
				if (event === "PASSWORD_RECOVERY") {
					setIsResettingPassword(true);
				} else {
					setIsResettingPassword(false);
				}
			},
		);

		// Cleanup Listener เมื่อ Component ถูก unmount
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (!isResettingPassword) {
			// ถ้าไม่ได้อยู่ในโหมดรีเซ็ตรหัสผ่าน ให้โหลดข้อมูลปกติ
			dispatch(fetchUserData());
			dispatch(fetchUniqueData());
			dispatch(fetchTop5ViewsByDate({ date: new Date() }));
			dispatch(fetchTop3ViewsAllTime());
			dispatch(fetchTotalCount());
		}
	}, [isResettingPassword]); // จะทำงานใหม่เมื่อค่า isResettingPassword เปลี่ยน

	useEffect(() => {
		if (!isResettingPassword) {
			dispatch(
				fetchPerfumes({
					pageNumber: pagination.perfumesPage,
					itemsPerPage: pagination.perfumesItemsPerPage,
				}),
			);
		}
	}, [pagination.perfumesPage, isResettingPassword]);

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
