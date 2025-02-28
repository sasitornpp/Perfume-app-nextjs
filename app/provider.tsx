"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useDispatch } from "react-redux";
import Container from "@/components/container-setup";
import { getUser, fetchProfile } from "@/utils/supabase/api/profiles";
import { setUser, setProfile } from "@/redux/user/userReducer";
import { type UserResponse } from "@supabase/supabase-js";
import { FetchPerfumes } from "@/utils/supabase/api/perfume";
import { setAllPerfumes } from "@/redux/perfume/perfumeReducer";

interface ProviderComponentProps {
	children: React.ReactNode;
}

const ProviderComponent: React.FC<ProviderComponentProps> = ({ children }) => {
	const dispatch = useDispatch();
	const perfumesReducer = useSelector(
		(state: RootState) => state.perfume.perfume,
	);

	const fetchUser = async () => {
		const user: UserResponse = await getUser();
		dispatch(setUser(user));
		if (user.data.user) {
			const profile = await fetchProfile(user.data.user.id);
			dispatch(setProfile(profile.data));
		}
	};

	const fetchAllPerfumes = async () => {
		const perfumes = await FetchPerfumes();
		if (perfumes.data) {
			dispatch(setAllPerfumes(perfumes.data));
		}
	};

	useEffect(() => {
		fetchUser();
	}, [dispatch]);

	useEffect(() => {
		fetchAllPerfumes();
	}, []);

	useEffect(() => {
		if (!perfumesReducer || perfumesReducer.length === 0) {
			fetchAllPerfumes();
		}
	}, [perfumesReducer]);

	return <Container>{children}</Container>;
};

export default ProviderComponent;
