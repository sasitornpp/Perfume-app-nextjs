"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "./header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface HeaderProps {
	children: React.ReactNode;
}

const Container: React.FC<HeaderProps> = ({ children }) => {
	const pathname = usePathname();

	return (
		<div
			className={`flex flex-col transition-all duration-500 w-screen h-full`}
		>
			<Header pathname={pathname} />
			<div className="w-full justify-center">
				<ScrollArea className="w-full h-screen whitespace-nowrap rounded-md border">
					{children}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</div>
		</div>
	);
};

export default Container;
