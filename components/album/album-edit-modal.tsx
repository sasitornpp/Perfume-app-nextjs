"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	ImagePlus,
	X,
	Maximize2,
	RotateCw,
	Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AlbumWithPerfume, AlbumForInsert } from "@/types/perfume";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { updateAlbum } from "@/redux/user/userReducer";

interface AlbumEditModalProps {
	album: AlbumWithPerfume;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updatedAlbum: AlbumWithPerfume) => void;
}

const AlbumEditModal: React.FC<AlbumEditModalProps> = ({
	album,
	isOpen,
	onClose,
	onSave,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const [formData, setFormData] = useState<AlbumWithPerfume>({
		...album,
	});

	const [imagePreview, setImagePreview] = useState<string | null>(
		album.images as string,
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null,
	);

	// Reset form when album changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setFormData({ ...album });
			setImagePreview(album.images as string);
			setImageFile(null);
		}
	}, [album, isOpen]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePrivacyToggle = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, private: checked }));
	};

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		const file = files[0];

		// Create a preview URL for the image
		const previewUrl = URL.createObjectURL(file);

		// Update the state
		setImagePreview(previewUrl);
		setImageFile(file);
		setIsUploading(false);
	};

	const handleUploadClick = () => {
		const input = document.getElementById(
			"album-image-upload",
		) as HTMLInputElement;
		if (input) {
			input.value = ""; // Reset input to allow same file selection
			input.click();
		}
	};

	const removeImage = () => {
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
		}
		setImagePreview(null);
		setImageFile(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Create the album object for the updateAlbum action
			const albumToUpdate: AlbumForInsert = {
				...formData,
				imageFile: imageFile, // Include the image file for upload
				images: imagePreview, // Current image preview URL or null if removed
				perfumes: [], // Initialize with empty array as required by AlbumForInsert
			};

			// Dispatch the updateAlbum action
			dispatch(updateAlbum({ album: albumToUpdate }));

			// Close modal after successful update
			onClose();
		} catch (error) {
			console.error("Error updating album:", error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md md:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Album</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Album Title</Label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Enter album title"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="descriptions">Description</Label>
							<Textarea
								id="descriptions"
								name="descriptions"
								value={formData.descriptions || ""}
								onChange={handleChange}
								placeholder="Describe your album"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label>Album Image</Label>
							<div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 p-4">
								<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
									<p className="text-sm text-muted-foreground">
										Add a cover image for your album
									</p>
									<motion.div
										whileHover={{ scale: 1.03 }}
										whileTap={{ scale: 0.97 }}
									>
										<Button
											type="button"
											onClick={handleUploadClick}
											disabled={isUploading}
											className={cn(
												"gap-2 rounded-full",
												isUploading
													? "opacity-75 cursor-not-allowed"
													: "hover:opacity-90",
											)}
										>
											{isUploading ? (
												<RotateCw className="h-4 w-4 animate-spin" />
											) : (
												<ImagePlus className="h-4 w-4" />
											)}
											<span>
												{imagePreview
													? "Change Image"
													: "Add Image"}
											</span>
											<input
												id="album-image-upload"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageUpload}
												disabled={isUploading}
											/>
										</Button>
									</motion.div>
								</div>

								<AnimatePresence>
									{selectedImageIndex !== null &&
										imagePreview && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
												onClick={() =>
													setSelectedImageIndex(null)
												}
											>
												<motion.div
													initial={{ scale: 0.9 }}
													animate={{ scale: 1 }}
													className="relative max-w-3xl w-full rounded-xl overflow-hidden shadow-xl bg-card"
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<div className="relative aspect-square">
														<Image
															src={imagePreview}
															alt="Preview"
															fill
															className="object-contain"
														/>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
														onClick={() =>
															setSelectedImageIndex(
																null,
															)
														}
													>
														<X className="h-5 w-5" />
													</Button>
												</motion.div>
											</motion.div>
										)}
								</AnimatePresence>

								<div className="mt-4 relative">
									{!imagePreview ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="border-2 border-dashed border-primary/30 rounded-xl p-10 bg-muted/10 cursor-pointer"
											onClick={handleUploadClick}
										>
											<div className="flex flex-col items-center justify-center text-center">
												<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
													<ImageIcon className="h-8 w-8 text-primary" />
												</div>
												<h4 className="text-lg font-medium mb-2">
													No album cover
												</h4>
												<p className="text-sm text-muted-foreground">
													Add a cover image for your
													album to make it stand out
												</p>
											</div>
										</motion.div>
									) : (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											className="group relative"
										>
											<motion.div
												whileHover={{ y: -5 }}
												className="aspect-video rounded-xl overflow-hidden border border-border shadow-sm bg-card cursor-pointer"
											>
												<div className="relative w-full h-full min-h-[200px]">
													<Image
														src={imagePreview}
														alt="Album cover"
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
														<Button
															type="button"
															variant="secondary"
															size="icon"
															className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
															onClick={() =>
																setSelectedImageIndex(
																	0,
																)
															}
														>
															<Maximize2 className="h-4 w-4" />
														</Button>
														<Button
															type="button"
															variant="destructive"
															size="icon"
															className="h-8 w-8"
															onClick={(e) => {
																e.stopPropagation();
																removeImage();
															}}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</motion.div>
										</motion.div>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="privacy">Album Privacy</Label>
								<p className="text-sm text-muted-foreground">
									{formData.private
										? "Only you can see this album"
										: "Anyone can see this album"}
								</p>
							</div>
							<Switch
								id="privacy"
								checked={formData.private}
								onCheckedChange={handlePrivacyToggle}
							/>
						</div>
					</div>

					<DialogFooter className="sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AlbumEditModal;
