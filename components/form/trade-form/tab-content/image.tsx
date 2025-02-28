"use client";

import React, { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TradablePerfume } from "@/types/perfume";
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
	formData: TradablePerfume;
	setFormData: React.Dispatch<React.SetStateAction<TradablePerfume>>;
}) {
	const [isUploading, setIsUploading] = useState(false);

	const removeImage = (index: number) => {
		const newImages = formData.images.filter((_, i) => i !== index);
		const newPreviews = (formData.imagePreviews ?? []).filter(
			(_, i) => i !== index,
		);

		setFormData(
			(prev) =>
				({
					...prev,
					images: newImages as string[],
					imagePreviews: newPreviews as string[],
				}) as TradablePerfume,
		);

		if (formData.imagePreviews?.[index]) {
			URL.revokeObjectURL(formData.imagePreviews[index]);
		}
	};

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileObjects = Array.from(files);
			const fileUrls = fileObjects.map((file) =>
				URL.createObjectURL(file),
			);

			setFormData((prev) => {
				return {
					...prev,
					images: [...prev.images, ...fileUrls],
					imagePreviews: [...fileUrls], // Reset previews to new files only
					imagesFiles: [...prev.imagesFiles, ...fileObjects],
				} as TradablePerfume;
			});
		}
	};

	const handleImageUploadWithAnimation = (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		if (handleImageUpload) {
			setIsUploading(true);
			// Simulate delay for upload animation
			setTimeout(() => {
				handleImageUpload(e);
				setIsUploading(false);
			}, 800);
		}
	};

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
									<Label
										htmlFor="image-upload"
										className={cn(
											"flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground",
											"cursor-pointer hover:opacity-90 transition-all shadow-sm",
										)}
									>
										{isUploading ? (
											<RotateCw className="h-4 w-4 animate-spin" />
										) : (
											<ImagePlus className="h-4 w-4" />
										)}
										<span className="text-sm font-medium">
											{isUploading
												? "Uploading..."
												: "Add Images"}
										</span>
										<Input
											id="image-upload"
											type="file"
											multiple
											accept="image/*"
											className="hidden"
											onChange={
												handleImageUploadWithAnimation
											}
											disabled={isUploading}
										/>
									</Label>
								</motion.div>
							</div>

							<AnimatePresence>
								{formData.imagePreviews?.map((image, index) => (
									<motion.div
										key={`preview-${index}`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 20 }}
										className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
										onClick={() => handleImageUpload}
									>
										<motion.div
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0.9 }}
											className="relative max-w-3xl w-full rounded-xl overflow-hidden shadow-xl"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="relative aspect-video">
												<Image
													src={image}
													alt="Preview"
													fill
													className="object-contain"
												/>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
												onClick={() =>
													handleImageUploadWithAnimation
												}
											>
												<X className="h-5 w-5" />
											</Button>
										</motion.div>
									</motion.div>
								))}
							</AnimatePresence>

							<div className="mt-4 relative">
								{!formData.imagePreviews?.length ? (
									<motion.div
										variants={itemVariants}
										className="border-2 border-dashed border-primary/30 rounded-xl p-10 bg-muted/10"
									>
										<div className="flex flex-col items-center justify-center text-center">
											<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
												<ImagePlus className="h-8 w-8 text-primary" />
											</div>
											<h4 className="text-lg font-medium mb-2">
												No images yet
											</h4>
											<p className="text-sm text-muted-foreground max-w-md">
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
											{formData.imagePreviews?.map(
												(preview, index) => (
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
														className="group"
													>
														<motion.div
															whileHover={{
																y: -5,
															}}
															className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-card transition-all duration-300 hover:shadow-md"
														>
															<Image
																src={preview}
																alt={`Perfume image ${index + 1}`}
																fill
																className="object-cover transition-all duration-500 group-hover:scale-110"
															/>
															<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
																<Button
																	type="button"
																	variant="secondary"
																	size="icon"
																	className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
																	onClick={() =>
																		handleImageUploadWithAnimation
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
																		);
																	}}
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														</motion.div>
													</motion.div>
												),
											)}
										</AnimatePresence>

										<motion.div
											variants={itemVariants}
											whileHover={{ scale: 1.03, y: -5 }}
											whileTap={{ scale: 0.97 }}
										>
											<Label
												htmlFor="image-upload-grid"
												className={cn(
													"flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer",
													"border-2 border-dashed border-primary/30 bg-muted/5 hover:bg-primary/5 transition-colors",
												)}
											>
												<div className="flex flex-col items-center justify-center p-4">
													<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
														<ImagePlus className="h-6 w-6 text-primary" />
													</div>
													<span className="text-sm font-medium text-primary">
														Add more
													</span>
													<span className="text-xs text-muted-foreground mt-1">
														PNG, JPG or WEBP
													</span>
												</div>
												<Input
													id="image-upload-grid"
													type="file"
													multiple
													accept="image/*"
													className="hidden"
													onChange={
														handleImageUploadWithAnimation
													}
													disabled={isUploading}
												/>
											</Label>
										</motion.div>
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
