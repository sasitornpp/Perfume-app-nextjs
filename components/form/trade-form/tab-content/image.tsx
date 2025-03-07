"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PerfumeForInsert, PerfumeForUpdate } from "@/types/perfume";
import Image from "next/image";
import { ImagePlus, Info, X, Maximize2, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function TabImage({
	containerVariants,
	itemVariants,
	formData,
	setFormData,
}: {
	itemVariants: any;
	containerVariants: any;
	formData: PerfumeForInsert | PerfumeForUpdate;
	setFormData: React.Dispatch<
		React.SetStateAction<PerfumeForInsert | PerfumeForUpdate>
	>;
}) {
	const [isUploading, setIsUploading] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null,
	);

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		setIsUploading(true);
		const fileObjects = Array.from(files);
		const fileUrls = fileObjects.map((file) => URL.createObjectURL(file));

		setFormData((prev) => ({
			...prev,
			imagePreviews: [...(prev.imagePreviews || []), ...fileUrls],
			imagesFiles: [...(prev.imagesFiles || []), ...fileObjects],
		}));
		setIsUploading(false);
	};

	const handleUploadClick = () => {
		const input = document.getElementById(
			"image-upload",
		) as HTMLInputElement;
		if (input) {
			input.value = ""; // Reset input to allow same file selection
			input.click();
		}
	};

	const removeImage = (index: number, isPreview: boolean) => {
		if (isPreview) {
			const previewIndex = index - (formData.images?.length || 0);
			const newPreviews = (formData.imagePreviews || []).filter(
				(_, i) => i !== previewIndex,
			);
			const newFiles = (formData.imagesFiles || []).filter(
				(_, i) => i !== previewIndex,
			);

			if (formData.imagePreviews?.[previewIndex]) {
				URL.revokeObjectURL(formData.imagePreviews[previewIndex]);
			}

			setFormData((prev) => ({
				...prev,
				imagePreviews: newPreviews,
				imagesFiles: newFiles,
			}));
		} else {
			const newImages = (formData.images || []).filter(
				(_, i) => i !== index,
			);
			setFormData((prev) => ({
				...prev,
				images: newImages,
			}));
		}
	};
	const allImages = [
		...(formData.images || []),
		...(formData.imagePreviews || []),
	];

	useEffect(() => {
		console.log("Current formData:", {
			images: formData.images || [],
			imagePreviews: formData.imagePreviews || [],
			imagesFiles: formData.imagesFiles || [],
		});
	}, [formData.images, formData.imagePreviews, formData.imagesFiles]);

	return (
		<TabsContent value="images" className="m-0 p-0">
			<Card className="border-0 shadow-none">
				<CardContent className="p-6">
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="space-y-6"
					>
						<motion.div
							variants={itemVariants}
							className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 p-6"
						>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
								<div>
									<h3 className="text-lg font-medium text-primary">
										Perfume Gallery
									</h3>
									<p className="text-sm text-muted-foreground">
										Add beautiful photos to showcase your
										perfume
									</p>
								</div>
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
											{isUploading
												? "Uploading..."
												: "Add Images"}
										</span>
										<input
											id="image-upload"
											type="file"
											multiple
											accept="image/*"
											className="hidden"
											onChange={handleImageUpload}
											disabled={isUploading}
										/>
									</Button>
								</motion.div>
							</div>

							<AnimatePresence>
								{selectedImageIndex !== null && (
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
											onClick={(e) => e.stopPropagation()}
										>
											<div className="relative aspect-square">
												<Image
													src={
														allImages[
															selectedImageIndex
														] || ""
													}
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
													setSelectedImageIndex(null)
												}
											>
												<X className="h-5 w-5" />
											</Button>
										</motion.div>
									</motion.div>
								)}
							</AnimatePresence>

							<div className="mt-4 relative">
								{!allImages.length ? (
									<motion.div
										variants={itemVariants}
										className="border-2 border-dashed border-primary/30 rounded-xl p-10 bg-muted/10 cursor-pointer"
										onClick={handleUploadClick}
									>
										<div className="flex flex-col items-center justify-center text-center">
											<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
												<ImagePlus className="h-8 w-8 text-primary" />
											</div>
											<h4 className="text-lg font-medium mb-2">
												No images yet
											</h4>
											<p className="text-sm text-muted-foreground flex">
												High-quality images attract more
												interested traders. Add images
												of your perfume bottle,
												packaging, and details.
											</p>
										</div>
									</motion.div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
										<AnimatePresence>
											{allImages.map((image, index) => {
												const isPreview =
													index >=
													(formData.images?.length ||
														0);
												return (
													<motion.div
														key={`img-${index}`}
														initial={{
															opacity: 0,
															scale: 0.8,
														}}
														animate={{
															opacity: 1,
															scale: 1,
														}}
														exit={{
															opacity: 0,
															scale: 0.8,
															y: 10,
														}}
														transition={{
															type: "spring",
															stiffness: 400,
															damping: 30,
														}}
														className="group relative"
													>
														<motion.div
															whileHover={{
																y: -5,
															}}
															className="aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-card cursor-pointer"
														>
															<Image
																src={image}
																alt={`Perfume image ${index + 1}`}
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
																			index,
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
																	onClick={(
																		e,
																	) => {
																		e.stopPropagation();
																		removeImage(
																			index,
																			isPreview,
																		);
																	}}
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														</motion.div>
													</motion.div>
												);
											})}

											<motion.div
												variants={itemVariants}
												whileHover={{
													scale: 1.03,
													y: -5,
												}}
												whileTap={{ scale: 0.97 }}
												className="aspect-square"
											>
												<div
													onClick={handleUploadClick}
													className={cn(
														"flex flex-col items-center justify-center h-full rounded-xl cursor-pointer",
														"border-2 border-dashed border-primary/30 bg-muted/5 hover:bg-primary/5 transition-colors",
														isUploading &&
															"opacity-50 cursor-not-allowed",
													)}
												>
													<div className="flex flex-col items-center justify-center p-4">
														<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
															{isUploading ? (
																<RotateCw className="h-6 w-6 text-primary animate-spin" />
															) : (
																<ImagePlus className="h-6 w-6 text-primary" />
															)}
														</div>
														<span className="text-sm font-medium text-primary">
															{isUploading
																? "Uploading..."
																: "Add more"}
														</span>
													</div>
												</div>
											</motion.div>
										</AnimatePresence>
									</div>
								)}
							</div>

							<motion.div
								variants={itemVariants}
								className="mt-8"
							>
								<div className="rounded-xl border border-border bg-card p-5">
									<div className="flex items-center gap-2 text-primary mb-3">
										<Info className="h-5 w-5" />
										<h4 className="font-medium">
											Photography Tips
										</h4>
									</div>
									<div className="grid sm:grid-cols-2 gap-4 text-sm text-card-foreground">
										<div className="space-y-2">
											<p className="flex items-center gap-2">
												<span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
													1
												</span>
												Use natural lighting to showcase
												true colors
											</p>
											<p className="flex items-center gap-2">
												<span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
													2
												</span>
												Include close-ups of the bottle
												and packaging
											</p>
										</div>
										<div className="space-y-2">
											<p className="flex items-center gap-2">
												<span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
													3
												</span>
												Show the fill level of the
												bottle clearly
											</p>
											<p className="flex items-center gap-2">
												<span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
													4
												</span>
												Include honest photos of any
												scratches or damage
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</motion.div>
				</CardContent>
			</Card>
		</TabsContent>
	);
}

export default TabImage;
