"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TradablePerfume } from "@/types/perfume";
import {
	X,
	Plus,
	ImagePlus,
	Droplets,
	Info,
	Phone,
	Facebook,
	MessageCircle,
} from "lucide-react";
import { InsertTradablePerfume } from "@/utils/supabase/api/perfume";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

function Trade() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [progress, setProgress] = useState(0);
	const [formData, setFormData] = useState<TradablePerfume>({
		id: "",
		name: "",
		descriptions: "",
		gender: "",
		brand: "",
		concentration: "",
		scentType: "",
		price: 0,
		volume: 0,
		topNotes: [""],
		middleNotes: [""],
		baseNotes: [""],
		images: [],
		imagePreviews: [],
		imagesFiles: [],
		accords: [""],
		perfumer: "",
		userId: "",
		userName: "",
		facebook: "",
		line: "",
		phoneNumber: "",
	});

	useEffect(() => {
		// Calculate form completion progress
		const requiredFields = [
			"name",
			"descriptions",
			"price",
			"volume",
			"gender",
		];
		const filledRequired = requiredFields.filter(
			(field) =>
				formData[field as keyof TradablePerfume] &&
				formData[field as keyof TradablePerfume] !== 0,
		).length;

		// Additional fields that add to completion percentage
		const bonusFields = [
			"brand",
			"concentration",
			"scentType",
			"perfumer",
			"facebook",
			"line",
			"phoneNumber",
		];
		const filledBonus = bonusFields.filter(
			(field) =>
				formData[field as keyof TradablePerfume] &&
				formData[field as keyof TradablePerfume] !== "",
		).length;

		// Notes fields
		const hasTopNotes =
			formData.topNotes?.some((note) => note !== "") || false;
		const hasMiddleNotes = formData.middleNotes?.some(
			(note) => note !== "",
		);
		const hasBaseNotes = formData.baseNotes?.some((note) => note !== "");
		const notesCount = [hasTopNotes, hasMiddleNotes, hasBaseNotes].filter(
			Boolean,
		).length;

		// Images
		const hasImages = formData.images.length > 0;

		// Calculate total progress (required fields are worth more)
		const totalProgress =
			(filledRequired / requiredFields.length) * 60 +
			(filledBonus / bonusFields.length) * 20 +
			(notesCount / 3) * 10 +
			(hasImages ? 10 : 0);

		setProgress(Math.min(Math.round(totalProgress), 100));
	}, [formData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
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

	const handleArrayChange = (
		type: keyof TradablePerfume,
		index: number,
		value: string,
	) => {
		const newArray = [...(formData[type] as string[])];
		newArray[index] = value;
		setFormData((prev) => ({
			...prev,
			[type]: newArray,
		}));
	};

	const addArrayItem = (type: keyof TradablePerfume) => {
		setFormData((prev) => ({
			...prev,
			[type]: [...(prev[type] as string[]), ""],
		}));
	};

	const removeArrayItem = (type: keyof TradablePerfume, index: number) => {
		const newArray = (formData[type] as string[]).filter(
			(_, i) => i !== index,
		);
		setFormData((prev) => ({
			...prev,
			[type]: newArray,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await InsertTradablePerfume({ tradablePerfume: formData });
			router.push("/trade");
		} catch (error) {
			console.error("Error creating listing:", error);
		} finally {
			setLoading(false);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 300, damping: 24 },
		},
	};

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	const nextTab = () => {
		if (activeTab === "details") setActiveTab("notes");
		else if (activeTab === "notes") setActiveTab("images");
		else if (activeTab === "images") setActiveTab("contact");
	};

	const previousTab = () => {
		if (activeTab === "contact") setActiveTab("images");
		else if (activeTab === "images") setActiveTab("notes");
		else if (activeTab === "notes") setActiveTab("details");
	};

	return (
		<div className="py-8 px-4 min-h-full bg-background/50 mt-20">
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="max-w-4xl mx-auto"
			>
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						List Your Perfume for Trade
					</h1>
					<p className="text-muted-foreground">
						Share your fragrance with enthusiasts in our community
					</p>
				</div>

				<Card className="border border-border shadow-lg overflow-hidden rounded-lg">
					<CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
						<div className="flex justify-between items-center">
							<div>
								<CardTitle className="text-xl text-primary">
									Create New Perfume Listing
								</CardTitle>
								<CardDescription>
									{activeTab === "details" &&
										"Start with the basic details of your perfume"}
									{activeTab === "notes" &&
										"Describe the fragrance profile"}
									{activeTab === "images" &&
										"Add appealing images of your perfume"}
									{activeTab === "contact" &&
										"Share your contact information for interested buyers"}
								</CardDescription>
							</div>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="relative h-12 w-12">
											<svg className="h-12 w-12 transform -rotate-90">
												<motion.circle
													initial={{
														strokeDashoffset: 100,
													}}
													animate={{
														strokeDashoffset:
															100 - progress,
													}}
													transition={{
														duration: 0.5,
													}}
													cx="24"
													cy="24"
													r="20"
													fill="transparent"
													stroke="hsl(var(--primary))"
													strokeWidth="4"
													strokeDasharray="100"
													strokeDashoffset="0"
													strokeLinecap="round"
												/>
												<circle
													cx="24"
													cy="24"
													r="20"
													fill="transparent"
													stroke="hsl(var(--muted))"
													strokeWidth="4"
												/>
											</svg>
											<span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
												{progress}%
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Form completion progress</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="p-0">
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="w-full grid grid-cols-4 rounded-none bg-muted/30">
									<TabsTrigger
										value="details"
										className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
									>
										Details
									</TabsTrigger>
									<TabsTrigger
										value="notes"
										className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
									>
										Notes
									</TabsTrigger>
									<TabsTrigger
										value="images"
										className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
									>
										Images
									</TabsTrigger>
									<TabsTrigger
										value="contact"
										className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
									>
										Contact
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="details"
									className="m-0 p-6"
								>
									<motion.div
										variants={containerVariants}
										initial="hidden"
										animate="visible"
										className="space-y-6"
									>
										<motion.div
											variants={itemVariants}
											className="grid grid-cols-2 gap-6"
										>
											<div>
												<Label
													htmlFor="name"
													className="text-sm font-medium mb-2 block"
												>
													Perfume Name{" "}
													<span className="text-destructive">
														*
													</span>
												</Label>
												<Input
													id="name"
													name="name"
													value={formData.name}
													onChange={handleChange}
													placeholder="Enter perfume name"
													className="border-input"
													required
												/>
											</div>
											<div>
												<Label
													htmlFor="brand"
													className="text-sm font-medium mb-2 block"
												>
													Brand
												</Label>
												<Input
													id="brand"
													name="brand"
													value={formData.brand || ""}
													onChange={handleChange}
													placeholder="Enter brand name"
													className="border-input"
												/>
											</div>
										</motion.div>

										<motion.div variants={itemVariants}>
											<Label
												htmlFor="descriptions"
												className="text-sm font-medium mb-2 block"
											>
												Description{" "}
												<span className="text-destructive">
													*
												</span>
											</Label>
											<Textarea
												id="descriptions"
												name="descriptions"
												value={formData.descriptions}
												onChange={handleChange}
												placeholder="Describe the perfume's scent, occasion, and your experience with it..."
												className="min-h-32 border-input"
												required
											/>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="grid grid-cols-1 md:grid-cols-3 gap-6"
										>
											<div>
												<Label
													htmlFor="gender"
													className="text-sm font-medium mb-2 block"
												>
													Gender{" "}
													<span className="text-destructive">
														*
													</span>
												</Label>
												<Select
													name="gender"
													value={
														formData.gender || ""
													}
													onValueChange={(value) =>
														setFormData((prev) => ({
															...prev,
															gender: value,
														}))
													}
													required
												>
													<SelectTrigger
														id="gender"
														className="border-input"
													>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="male">
															Male
														</SelectItem>
														<SelectItem value="female">
															Female
														</SelectItem>
														<SelectItem value="unisex">
															Unisex
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label
													htmlFor="concentration"
													className="text-sm font-medium mb-2 block"
												>
													Concentration
												</Label>
												<Select
													name="concentration"
													value={
														formData.concentration ||
														""
													}
													onValueChange={(value) =>
														setFormData((prev) => ({
															...prev,
															concentration:
																value,
														}))
													}
												>
													<SelectTrigger
														id="concentration"
														className="border-input"
													>
														<SelectValue placeholder="Select concentration" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="eau_de_parfum">
															Eau de Parfum
														</SelectItem>
														<SelectItem value="eau_de_toilette">
															Eau de Toilette
														</SelectItem>
														<SelectItem value="cologne">
															Cologne
														</SelectItem>
														<SelectItem value="extrait">
															Extrait de Parfum
														</SelectItem>
														<SelectItem value="eau_fraiche">
															Eau Fraîche
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label
													htmlFor="scentType"
													className="text-sm font-medium mb-2 block"
												>
													Scent Type
												</Label>
												<Select
													name="scentType"
													value={
														formData.scentType || ""
													}
													onValueChange={(value) =>
														setFormData((prev) => ({
															...prev,
															scentType: value,
														}))
													}
												>
													<SelectTrigger
														id="scentType"
														className="border-input"
													>
														<SelectValue placeholder="Select scent type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="woody">
															Woody
														</SelectItem>
														<SelectItem value="floral">
															Floral
														</SelectItem>
														<SelectItem value="oriental">
															Oriental
														</SelectItem>
														<SelectItem value="fresh">
															Fresh
														</SelectItem>
														<SelectItem value="citrus">
															Citrus
														</SelectItem>
														<SelectItem value="aromatic">
															Aromatic
														</SelectItem>
														<SelectItem value="gourmand">
															Gourmand
														</SelectItem>
														<SelectItem value="spicy">
															Spicy
														</SelectItem>
														<SelectItem value="green">
															Green
														</SelectItem>
														<SelectItem value="aquatic">
															Aquatic
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="grid grid-cols-2 gap-6"
										>
											<div>
												<Label
													htmlFor="price"
													className="text-sm font-medium mb-2 block"
												>
													Price (THB){" "}
													<span className="text-destructive">
														*
													</span>
												</Label>
												<Input
													id="price"
													name="price"
													type="number"
													value={formData.price || ""}
													onChange={handleChange}
													placeholder="Enter price"
													className="border-input"
													required
												/>
											</div>
											<div>
												<Label
													htmlFor="volume"
													className="text-sm font-medium mb-2 block"
												>
													Volume (ml){" "}
													<span className="text-destructive">
														*
													</span>
												</Label>
												<Input
													id="volume"
													name="volume"
													type="number"
													value={
														formData.volume || ""
													}
													onChange={handleChange}
													placeholder="Enter volume"
													className="border-input"
													required
												/>
											</div>
										</motion.div>

										<motion.div variants={itemVariants}>
											<Label
												htmlFor="perfumer"
												className="text-sm font-medium mb-2 block"
											>
												Perfumer
											</Label>
											<Input
												id="perfumer"
												name="perfumer"
												value={formData.perfumer || ""}
												onChange={handleChange}
												placeholder="Enter perfumer name (if known)"
												className="border-input"
											/>
										</motion.div>
									</motion.div>
								</TabsContent>

								<TabsContent value="notes" className="m-0 p-6">
									<motion.div
										variants={containerVariants}
										initial="hidden"
										animate="visible"
										className="space-y-8"
									>
										<div className="flex items-center justify-center gap-2 mb-6">
											<Droplets className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-medium">
												Fragrance Pyramid
											</h3>
										</div>

										<motion.div
											variants={itemVariants}
											className="p-4 bg-muted/30 rounded-lg"
										>
											<div className="mb-2 flex justify-between items-center">
												<Label className="text-sm font-medium flex items-center">
													<Badge
														variant="outline"
														className="mr-2 bg-muted/50"
													>
														Top Notes
													</Badge>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Info className="h-4 w-4 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	The initial
																	scents you
																	smell when
																	first
																	applying the
																	perfume
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</Label>
											</div>
											<AnimatePresence>
												{formData.topNotes?.map(
													(note, index) => (
														<motion.div
															key={`top-${index}`}
															initial={{
																opacity: 0,
																y: -10,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															exit={{
																opacity: 0,
																height: 0,
															}}
															transition={{
																duration: 0.2,
															}}
															className="flex items-center space-x-2 mb-2"
														>
															<Input
																value={note}
																onChange={(e) =>
																	handleArrayChange(
																		"topNotes",
																		index,
																		e.target
																			.value,
																	)
																}
																placeholder="e.g., Bergamot, Lemon, Lavender"
																className="border-input bg-background"
															/>
															{(
																formData.topNotes ||
																[]
															).length > 1 && (
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		removeArrayItem(
																			"topNotes",
																			index,
																		)
																	}
																	className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
																>
																	<X className="h-4 w-4" />
																</Button>
															)}
														</motion.div>
													),
												)}
											</AnimatePresence>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													addArrayItem("topNotes")
												}
												className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
											>
												<Plus className="mr-1 h-3 w-3" />{" "}
												Add Top Note
											</Button>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="p-4 bg-muted/30 rounded-lg"
										>
											<div className="mb-2 flex justify-between items-center">
												<Label className="text-sm font-medium flex items-center">
													<Badge
														variant="outline"
														className="mr-2 bg-muted/50"
													>
														Middle Notes
													</Badge>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Info className="h-4 w-4 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	The heart of
																	the
																	fragrance
																	that emerges
																	after the
																	top notes
																	fade
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</Label>
											</div>
											<AnimatePresence>
												{formData.middleNotes?.map(
													(note, index) => (
														<motion.div
															key={`middle-${index}`}
															initial={{
																opacity: 0,
																y: -10,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															exit={{
																opacity: 0,
																height: 0,
															}}
															transition={{
																duration: 0.2,
															}}
															className="flex items-center space-x-2 mb-2"
														>
															<Input
																value={note}
																onChange={(e) =>
																	handleArrayChange(
																		"middleNotes",
																		index,
																		e.target
																			.value,
																	)
																}
																placeholder="e.g., Rose, Jasmine, Cinnamon"
																className="border-input bg-background"
															/>
															{(
																formData.middleNotes ||
																[]
															).length > 1 && (
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		removeArrayItem(
																			"middleNotes",
																			index,
																		)
																	}
																	className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
																>
																	<X className="h-4 w-4" />
																</Button>
															)}
														</motion.div>
													),
												)}
											</AnimatePresence>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													addArrayItem("middleNotes")
												}
												className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
											>
												<Plus className="mr-1 h-3 w-3" />{" "}
												Add Middle Note
											</Button>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="p-4 bg-muted/30 rounded-lg"
										>
											<div className="mb-2 flex justify-between items-center">
												<Label className="text-sm font-medium flex items-center">
													<Badge
														variant="outline"
														className="mr-2 bg-muted/50"
													>
														Base Notes
													</Badge>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Info className="h-4 w-4 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	The
																	longest-lasting
																	notes that
																	form the
																	foundation
																	of the
																	fragrance
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</Label>
											</div>
											<AnimatePresence>
												{formData.baseNotes?.map(
													(note, index) => (
														<motion.div
															key={`base-${index}`}
															initial={{
																opacity: 0,
																y: -10,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															exit={{
																opacity: 0,
																height: 0,
															}}
															transition={{
																duration: 0.2,
															}}
															className="flex items-center space-x-2 mb-2"
														>
															<Input
																value={note}
																onChange={(e) =>
																	handleArrayChange(
																		"baseNotes",
																		index,
																		e.target
																			.value,
																	)
																}
																placeholder="e.g., Vanilla, Musk, Sandalwood"
																className="border-input bg-background"
															/>
															{(
																formData.baseNotes ??
																[]
															).length > 1 && (
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		removeArrayItem(
																			"baseNotes",
																			index,
																		)
																	}
																	className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
																>
																	<X className="h-4 w-4" />
																</Button>
															)}
														</motion.div>
													),
												)}
											</AnimatePresence>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													addArrayItem("baseNotes")
												}
												className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
											>
												<Plus className="mr-1 h-3 w-3" />{" "}
												Add Base Note
											</Button>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="p-4 bg-muted/30 rounded-lg"
										>
											<div className="mb-2 flex justify-between items-center">
												<Label className="text-sm font-medium flex items-center">
													<Badge
														variant="outline"
														className="mr-2 bg-muted/50"
													>
														Accords
													</Badge>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<Info className="h-4 w-4 text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	The overall
																	impression
																	or character
																	of the
																	fragrance
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</Label>
											</div>
											<AnimatePresence>
												{formData.accords?.map(
													(accord, index) => (
														<motion.div
															key={`accord-${index}`}
															initial={{
																opacity: 0,
																y: -10,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															exit={{
																opacity: 0,
																height: 0,
															}}
															transition={{
																duration: 0.2,
															}}
															className="flex items-center space-x-2 mb-2"
														>
															<Input
																value={accord}
																onChange={(e) =>
																	handleArrayChange(
																		"accords",
																		index,
																		e.target
																			.value,
																	)
																}
																placeholder="e.g., Woody, Citrus, Powdery"
																className="border-input bg-background"
															/>
															{formData.accords
																.length > 1 && (
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		removeArrayItem(
																			"accords",
																			index,
																		)
																	}
																	className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
																>
																	<X className="h-4 w-4" />
																</Button>
															)}
														</motion.div>
													),
												)}
											</AnimatePresence>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() =>
													addArrayItem("accords")
												}
												className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
											>
												<Plus className="mr-1 h-3 w-3" />{" "}
												Add Accord
											</Button>
										</motion.div>
									</motion.div>
								</TabsContent>

								<TabsContent value="images" className="m-0 p-6">
									<motion.div
										variants={containerVariants}
										initial="hidden"
										animate="visible"
										className="space-y-6"
									>
										<motion.div variants={itemVariants}>
											<Label className="text-sm font-medium mb-3 block">
												Perfume Images
											</Label>
											<div className="text-sm text-muted-foreground mb-4">
												Upload clear images of your
												perfume bottle, packaging, and
												any relevant details.
												High-quality images attract more
												interested traders.
											</div>

											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
																}}
																transition={{
																	type: "spring",
																	stiffness: 300,
																	damping: 25,
																}}
																className="relative group"
															>
																<div className="relative aspect-square rounded-lg overflow-hidden border border-input bg-background">
																	<Image
																		src={
																			preview
																		}
																		alt={`Preview ${index + 1}`}
																		fill
																		className="object-cover transition-transform duration-300 group-hover:scale-105"
																	/>
																	<motion.div
																		initial={{
																			opacity: 0,
																		}}
																		whileHover={{
																			opacity: 1,
																		}}
																		className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity"
																	>
																		<Button
																			type="button"
																			variant="destructive"
																			size="icon"
																			onClick={() =>
																				removeImage(
																					index,
																				)
																			}
																			className="h-8 w-8"
																		>
																			<X className="h-4 w-4" />
																		</Button>
																	</motion.div>
																</div>
															</motion.div>
														),
													)}
												</AnimatePresence>

												<motion.div
													variants={itemVariants}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<Label
														htmlFor="image-upload"
														className="flex flex-col items-center justify-center aspect-square 
                                    border-2 border-dashed border-primary/30 rounded-lg cursor-pointer 
                                    bg-muted/30 hover:bg-muted/50 transition-colors"
													>
														<div className="flex flex-col items-center justify-center p-4">
															<ImagePlus className="h-8 w-8 text-primary/70 mb-2" />
															<span className="text-sm text-muted-foreground text-center">
																Click to upload
															</span>
															<span className="text-xs text-muted-foreground/70 text-center mt-1">
																PNG, JPG or WEBP
															</span>
														</div>
														<Input
															id="image-upload"
															type="file"
															multiple
															accept="image/*"
															className="hidden"
															onChange={
																handleImageUpload
															}
														/>
													</Label>
												</motion.div>
											</div>

											<div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
												<div className="flex items-center text-muted-foreground mb-4">
													<Info className="h-4 w-4 mr-2" />
													<span className="text-sm">
														Tips for great perfume
														photos:
													</span>
												</div>
												<ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
													<li>
														Use natural lighting to
														showcase the true color
														of the perfume
													</li>
													<li>
														Include close-ups of the
														bottle and packaging
													</li>
													<li>
														Show the fill level of
														the bottle clearly
													</li>
													<li>
														If there are any
														scratches or damage,
														include honest photos of
														them
													</li>
												</ul>
											</div>
										</motion.div>
									</motion.div>
								</TabsContent>

								<TabsContent
									value="contact"
									className="m-0 p-6"
								>
									<motion.div
										variants={containerVariants}
										initial="hidden"
										animate="visible"
										className="space-y-6"
									>
										<div className="mb-4 p-4 bg-muted/20 rounded-lg border border-border/50">
											<div className="text-sm text-muted-foreground">
												<p className="mb-2">
													Please provide at least one
													contact method so interested
													buyers can reach you.
												</p>
												<p>
													Your contact information
													will only be visible to
													logged-in users.
												</p>
											</div>
										</div>

										<motion.div variants={itemVariants}>
											<Label
												htmlFor="userName"
												className="text-sm font-medium mb-2 flex items-center"
											>
												Display Name
												<span className="text-destructive ml-1">
													*
												</span>
											</Label>
											<Input
												id="userName"
												name="userName"
												value={formData.userName}
												onChange={handleChange}
												placeholder="Your name or nickname"
												className="border-input"
												required
											/>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="grid grid-cols-1 gap-6"
										>
											<Accordion
												type="single"
												collapsible
												className="w-full"
											>
												<AccordionItem
													value="contact-methods"
													className="border-none"
												>
													<AccordionTrigger className="py-2 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 hover:no-underline">
														<span className="text-sm font-medium">
															Contact Methods
														</span>
													</AccordionTrigger>
													<AccordionContent className="pt-4 px-1">
														<div className="space-y-4">
															<div className="flex items-center space-x-4 p-3 bg-background rounded-lg border border-border/50">
																<Phone className="h-5 w-5 text-primary/70" />
																<div className="flex-grow">
																	<Label
																		htmlFor="phoneNumber"
																		className="text-sm font-medium mb-1 block"
																	>
																		Phone
																		Number
																	</Label>
																	<Input
																		id="phoneNumber"
																		name="phoneNumber"
																		value={
																			formData.phoneNumber ||
																			""
																		}
																		onChange={
																			handleChange
																		}
																		placeholder="e.g., 0891234567"
																		className="border-input"
																	/>
																</div>
															</div>

															<div className="flex items-center space-x-4 p-3 bg-background rounded-lg border border-border/50">
																<Facebook className="h-5 w-5 text-primary/70" />
																<div className="flex-grow">
																	<Label
																		htmlFor="facebook"
																		className="text-sm font-medium mb-1 block"
																	>
																		Facebook
																	</Label>
																	<Input
																		id="facebook"
																		name="facebook"
																		value={
																			formData.facebook ||
																			""
																		}
																		onChange={
																			handleChange
																		}
																		placeholder="Your Facebook username or profile URL"
																		className="border-input"
																	/>
																</div>
															</div>

															<div className="flex items-center space-x-4 p-3 bg-background rounded-lg border border-border/50">
																<MessageCircle className="h-5 w-5 text-primary/70" />
																<div className="flex-grow">
																	<Label
																		htmlFor="line"
																		className="text-sm font-medium mb-1 block"
																	>
																		Line ID
																	</Label>
																	<Input
																		id="line"
																		name="line"
																		value={
																			formData.line ||
																			""
																		}
																		onChange={
																			handleChange
																		}
																		placeholder="Your Line ID"
																		className="border-input"
																	/>
																</div>
															</div>
														</div>
													</AccordionContent>
												</AccordionItem>
											</Accordion>
										</motion.div>

										<motion.div
											variants={itemVariants}
											className="pt-4"
										>
											<div className="flex justify-center">
												<Button
													type="submit"
													className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
													disabled={loading}
												>
													{loading ? (
														<>
															<motion.div
																initial={{
																	rotate: 0,
																}}
																animate={{
																	rotate: 360,
																}}
																transition={{
																	duration: 1,
																	repeat: Infinity,
																	ease: "linear",
																}}
																className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
															/>
															Creating Listing...
														</>
													) : (
														"Create Tradable Perfume"
													)}
												</Button>
											</div>
										</motion.div>
									</motion.div>
								</TabsContent>
							</Tabs>
						</CardContent>

						<div className="p-4 border-t border-border/40 bg-muted/10 flex justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={previousTab}
								disabled={activeTab === "details"}
								className="w-24"
							>
								Previous
							</Button>
							{activeTab !== "contact" ? (
								<Button
									type="button"
									variant="default"
									onClick={nextTab}
									className="w-24 bg-primary/90 hover:bg-primary"
								>
									Next
								</Button>
							) : (
								<Button
									type="submit"
									className="w-24 bg-primary hover:bg-primary/90"
									disabled={loading}
								>
									{loading ? "Creating..." : "Submit"}
								</Button>
							)}
						</div>
					</form>
				</Card>
			</motion.div>
		</div>
	);
}

export default Trade;
