"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "./header";

interface HeaderProps {
	children: React.ReactNode;
}

const Container: React.FC<HeaderProps> = ({ children }) => {
	const pathname = usePathname();

	return (
		<div
			className={`flex flex-col transition-all duration-500 w-full h-full`}
		>
			<Header pathname={pathname} />
			<div className="container w-full justify-center">{children}</div>
		</div>
	);
};

export default Container;
