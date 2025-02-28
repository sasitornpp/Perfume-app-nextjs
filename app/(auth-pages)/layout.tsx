"use client";

import React, { use, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useRouter } from "next/navigation";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = useSelector((state: RootState) => state.user.user);
	const router = useRouter();
	useEffect(() => {
		if (!user) {
			router.push("/login");
		} else {
			router.push("/survey-form");
		}
	}, [user]);
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-7xl flex flex-col gap-12 items-center justify-center">
			{children}
		</div>
	);
}
