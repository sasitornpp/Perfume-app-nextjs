"use client";

// components/settings/SettingsSidebar.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Palette, Album, History, User } from "lucide-react";

const sidebarItems = [
	{
		icon: Palette,
		label: "Theme",
		href: "/profile/settings/theme",
	},
	{
		icon: Album,
		label: "Album",
		href: "/profile/settings/album",
	},
	{
		icon: History,
		label: "History",
		href: "/profile/settings/history",
	},
	{
		icon: User,
		label: "Profile",
		href: "/profile/settings/profile",
	},
];

export function SettingsSidebar() {
	const pathname = usePathname();

	return (
		<div className="rounded-lg border bg-card text-card-foreground shadow-sm h-">
			<div className="p-6">
				<h3 className="text-lg font-medium">Settings</h3>
				<p className="text-sm text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>
			<div className="px-2 py-2">
				{sidebarItems.map((item, index) => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className="block"
						>
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.2,
									delay: index * 0.05,
								}}
							>
								<div
									className={cn(
										"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
										isActive
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent hover:text-accent-foreground",
									)}
								>
									<Icon className="h-4 w-4" />
									<span>{item.label}</span>
								</div>
							</motion.div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
