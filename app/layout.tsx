"use client";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import React from "react";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import ProviderComponent from "@/app/provider";

export default function RootLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={GeistSans.className}
			suppressHydrationWarning
		>
			<body className="antialiased h-screen w-screen bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="Light"
					enableSystem
					disableTransitionOnChange
				>
					<Provider store={store}>
						<ProviderComponent>{children} </ProviderComponent>
					</Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
