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
		<div className="container mx-auto px-4">
			{children}
		</div>
	);
}
