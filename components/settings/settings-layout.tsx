"use client";

// components/settings/SettingsLayout.tsx
import React from "react";
import { motion } from "framer-motion";
import { SettingsSidebar } from "./settings-sidebar";

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<div className="container mx-auto py-8 mt-20">
			<div className="flex flex-col md:flex-row gap-8">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full md:w-64 flex-shrink-0"
				>
					<SettingsSidebar />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="flex-1"
				>
					{children}
				</motion.div>
			</div>
		</div>
	);
}
