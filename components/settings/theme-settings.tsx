"use client";

// components/settings/ThemeSettings.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

const themes = [
	{
		id: "light",
		name: "Light",
		colors: {
			background: "bg-white",
			foreground: "text-slate-950",
			primary: "bg-slate-900",
			card: "bg-white border-slate-200",
		},
	},
	{
		id: "dark",
		name: "Dark",
		colors: {
			background: "bg-slate-950",
			foreground: "text-slate-50",
			primary: "bg-slate-50",
			card: "bg-slate-900 border-slate-800",
		},
	},
	{
		id: "system",
		name: "System",
		colors: {
			background: "bg-slate-100",
			foreground: "text-slate-900",
			primary: "bg-slate-800",
			card: "bg-white border-slate-200",
		},
	},
];

export function ThemeSettings() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState<string | undefined>(
		undefined,
	);

	// Wait until the component is mounted on the client before setting the theme
	useEffect(() => {
		setMounted(true);
		setSelectedTheme(theme); // Set the initial theme from useTheme after mount
	}, [theme]);

	// Update the theme when the selectedTheme changes
	useEffect(() => {
		if (mounted && selectedTheme) {
			setTheme(selectedTheme);
			console.log("Theme set to:", selectedTheme);
		}
	}, [selectedTheme, mounted, setTheme]);

	// If the component has not been mounted, show a loading message or null
	if (!mounted) return <div>Loading...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Theme</CardTitle>
				<CardDescription>
					Customize the appearance of the application.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RadioGroup
					value={selectedTheme}
					onValueChange={(value) => {
						setSelectedTheme(value);
						console.log("Selected theme:", value);
					}}
					className="grid grid-cols-1 md:grid-cols-3 gap-4"
				>
					{themes.map((theme) => (
						<div key={theme.id} className="relative">
							<RadioGroupItem
								value={theme.id}
								id={`theme-${theme.id}`}
								className="sr-only"
							/>
							<Label
								htmlFor={`theme-${theme.id}`}
								className="cursor-pointer"
							>
								<motion.div
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.98 }}
									className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selectedTheme === theme.id ? "border-primary" : "border-muted"}
                  `}
								>
									{/* Theme Preview */}
									<div
										className={`w-full h-24 rounded-md ${theme.colors.background} mb-3 overflow-hidden`}
									>
										<div
											className={`h-6 w-full ${theme.colors.primary}`}
										></div>
										<div className="p-2">
											<div
												className={`h-3 w-3/4 rounded-sm ${theme.colors.primary} opacity-30`}
											></div>
											<div
												className={`h-3 w-1/2 rounded-sm ${theme.colors.primary} opacity-30 mt-1`}
											></div>
											<div
												className={`h-3 w-2/3 rounded-sm ${theme.colors.primary} opacity-30 mt-1`}
											></div>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm font-medium">
											{theme.name}
										</span>
										{selectedTheme === theme.id && (
											<Check className="h-4 w-4 text-primary" />
										)}
									</div>
								</motion.div>
							</Label>
						</div>
					))}
				</RadioGroup>
			</CardContent>
		</Card>
	);
}

