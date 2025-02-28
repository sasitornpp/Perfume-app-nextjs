"use client";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import React from "react";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import Container from "@/components/container-setup";
import { Toaster } from "@/components/ui/sonner";
// import Loading from "@/components/form/loading";

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
							<Toaster />
							{/* <Loading>{children}</Loading>{" "} */}
							{children}
						</Container>
					</Provider>
				</ThemeProvider>
			</body>
		</html>
	);
}
