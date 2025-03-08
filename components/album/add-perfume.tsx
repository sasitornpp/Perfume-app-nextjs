"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import { togglePerfumeToAlbum } from "@/redux/user/userReducer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AddPerfumeToAlbumProps {
	perfumeId: string;
}

function AddPerfumeToAlbumButton({ perfumeId }: AddPerfumeToAlbumProps) {
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((state: RootState) => state.user.profile);
	const albums = useSelector((state: RootState) => state.user.albums);

	const [open, setOpen] = useState(false);
	const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

	// Find albums that already contain this perfume
	useEffect(() => {
		if (albums) {
			const alreadyInAlbums = albums
				.filter((album) => album.perfumes_id.includes(perfumeId))
				.map((album) => album.id as string);

			setSelectedAlbums(alreadyInAlbums);
		}
	}, [albums, perfumeId, open]);

	const handleCheckboxChange = (albumId: string, checked: boolean) => {
		if (checked) {
			setSelectedAlbums((prev) => [...prev, albumId]);
		} else {
			setSelectedAlbums((prev) => prev.filter((id) => id !== albumId));
		}
	};

	const handleSave = async () => {
		if (!profile || !albums) return;

		// Transform data to required format
		const albumData = albums.map((album) => ({
			albumId: album.id as string,
			add: selectedAlbums.includes(album.id as string),
		}));

		dispatch(
			togglePerfumeToAlbum({
				album: albumData,
				perfumeId,
			}),
		);

		setOpen(false);
	};

	return (
		<>
			<Button
				variant="default"
				size="sm"
				className="flex items-center gap-1 text-foreground w-full"
				onClick={() => setOpen(true)}
			>
				<Plus size={16} />
				{selectedAlbums.length > 0
					? `In ${selectedAlbums.length} Album${selectedAlbums.length > 1 ? "s" : ""}`
					: "Add to album"}
			</Button>

			<AnimatePresence>
				{open && (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent className="sm:max-w-md bg-background border-border">
							<DialogHeader>
								<DialogTitle className="text-foreground">
									Add to albums
								</DialogTitle>
							</DialogHeader>

							<div className="py-4 max-h-64 overflow-y-auto">
								{albums && albums.length > 0 ? (
									albums.map((album) => (
										<div
											key={album.id}
											className="flex items-center space-x-2 mb-4"
										>
											<Checkbox
												id={`album-${album.id}`}
												checked={selectedAlbums.includes(
													album.id as string,
												)}
												onCheckedChange={(checked) =>
													handleCheckboxChange(
														album.id as string,
														checked as boolean,
													)
												}
											/>
											<div className="grid gap-1.5">
												<Label
													htmlFor={`album-${album.id}`}
													className="text-foreground font-medium"
												>
													{album.title}
												</Label>
												{album.descriptions && (
													<p className="text-muted-foreground text-sm">
														{album.descriptions
															.length > 60
															? `${album.descriptions.substring(0, 60)}...`
															: album.descriptions}
													</p>
												)}
											</div>
										</div>
									))
								) : (
									<p className="text-muted-foreground">
										You don't have any albums yet.
									</p>
								)}
							</div>

							<DialogFooter className="flex justify-between sm:justify-between">
								<Button
									variant="outline"
									onClick={() => setOpen(false)}
									className="text-destructive border-destructive hover:bg-destructive/10"
								>
									<X size={16} className="mr-2" />
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									className="bg-primary text-primary-foreground hover:bg-primary/90"
								>
									<Check size={16} className="mr-2" />
									Save
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</AnimatePresence>
		</>
	);
}

export default AddPerfumeToAlbumButton;
