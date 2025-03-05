"use client";

// components/settings/AlbumSettings.tsx
import React from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";

// Dummy data
const albums = [
	{ id: "favorites", name: "Favorites" },
	{ id: "summer", name: "Summer Collection" },
	{ id: "winter", name: "Winter Collection" },
	{ id: "special", name: "Special Occasions" },
];

export function AlbumSettings() {
	const [defaultAlbum, setDefaultAlbum] = React.useState("favorites");

	return (
		<Card>
			<CardHeader>
				<CardTitle>Album Settings</CardTitle>
				<CardDescription>
					Configure your default album and manage your collections.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Default Album</h3>
					<p className="text-sm text-muted-foreground">
						Choose the default album where new items will be added.
					</p>
					<Select
						value={defaultAlbum}
						onValueChange={setDefaultAlbum}
					>
						<SelectTrigger className="w-full sm:w-64">
							<SelectValue placeholder="Select default album" />
						</SelectTrigger>
						<SelectContent>
							{albums.map((album) => (
								<SelectItem key={album.id} value={album.id}>
									{album.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<h3 className="text-sm font-medium">Your Albums</h3>
						<Button size="sm" variant="outline">
							<Plus className="h-4 w-4 mr-2" />
							Create New
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{albums.map((album, index) => (
							<motion.div
								key={album.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.2,
									delay: index * 0.05,
								}}
							>
								<div className="flex items-center p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors">
									<FolderPlus className="h-5 w-5 mr-3 text-muted-foreground" />
									<span className="text-sm font-medium">
										{album.name}
									</span>
									{defaultAlbum === album.id && (
										<span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
											Default
										</span>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
