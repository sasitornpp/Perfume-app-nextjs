"use client";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import React from "react";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import Container from "@/components/container-setup";
import Loading from "@/app/loading";

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
						<Container>
							<Loading>{children}</Loading>{" "}
						</Container>
					</Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
