import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSelector } from "@reduxjs/toolkit";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info as InfoCircledIcon, BadgeCheck, ChevronDown } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PerfumeForInsert, PerfumeForUpdate } from "@/types/perfume";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandSeparator,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const selectBrandNames = createSelector(
	(state: RootState) => state.perfumes?.perfume_unique_data?.brand,
	(brands) => {
		if (!brands || !Array.isArray(brands)) return [];
		return brands;
	},
);

const TabDetails = ({
	containerVariants,
	itemVariants,
	formData,
	handleChange,
	setFormData,
}: {
	containerVariants: any;
	itemVariants: any;
	formData: PerfumeForInsert | PerfumeForUpdate;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	setFormData: React.Dispatch<
		React.SetStateAction<PerfumeForInsert | PerfumeForUpdate>
	>;
}) => {
	const perfumeBrands = useSelector(selectBrandNames);
	const [open, setOpen] = useState(false);
	const [brandValue, setBrandValue] = useState(formData.brand || "");
	const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
	const [newBrandName, setNewBrandName] = useState("");

	// For performance optimization, memoize the filtered brands
	const filteredBrands = useMemo(() => {
		// Simply sort the brands alphabetically by name
		return [...perfumeBrands].sort((a, b) => a.name.localeCompare(b.name));
	}, [perfumeBrands]);

	// Handle not for sale checkbox
	const [isNotForSale, setIsNotForSale] = useState(false);

	// Initialize isNotForSale based on formData
	useEffect(() => {
		// Don't set isNotForSale directly from formData to avoid circular updates
		const shouldBeNotForSale =
			formData.price === null && !formData.is_tradable;
		if (isNotForSale !== shouldBeNotForSale) {
			setIsNotForSale(shouldBeNotForSale);
		}
	}, [formData.price, formData.is_tradable]);

	// Only update formData when isNotForSale changes from user interaction
	const handleNotForSaleChange = (checked: boolean) => {
		setIsNotForSale(checked);
		if (checked) {
			setFormData((prev) => ({
				...prev,
				price: null,
				is_tradable: false,
			}));
		}
	};

	// Handle brand selection
	const handleBrandChange = (selectedBrand: string) => {
		setBrandValue(selectedBrand);

		// Find the selected brand object to get its logo
		const brandObj = perfumeBrands.find(
			(brand) => brand.name === selectedBrand,
		);

		setFormData((prev) => ({
			...prev,
			brand: selectedBrand,
			logo: brandObj?.logo || null, // Add the logo to formData
		}));
	};

	// Handle adding a new brand
	const handleAddNewBrand = () => {
		if (newBrandName.trim()) {
			// For new brands, we don't have a logo yet
			setBrandValue(newBrandName.trim());
			setFormData((prev) => ({
				...prev,
				brand: newBrandName.trim(),
				logo: null, // No logo for custom brands
			}));
			setIsAddingNewBrand(false);
			setNewBrandName("");
			setOpen(false);
		}
	};

	const [visibleBrandsCount, setVisibleBrandsCount] = useState(5);

	const handleShowMoreBrands = () => {
		setVisibleBrandsCount((prev) =>
			Math.min(prev + 10, filteredBrands.length),
		);
	};
	useEffect(() => {
		if (!open) {
			setVisibleBrandsCount(5);
		}
	}, [open]);

	return (
		<TabsContent value="details" className="m-0 p-0">
			<div className="p-6 space-y-8">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					{/* Essential Information Card */}
					<Card className="border border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-primary/5 pb-3">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-medium text-primary">
										Essential Information
									</CardTitle>
									<CardDescription className="text-muted-foreground">
										These details are required to list your
										perfume
									</CardDescription>
								</div>
								<span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
									Required
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Name Field */}
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="font-medium"
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
										placeholder="e.g. Bleu de Chanel"
										className="border-input/60 focus-visible:ring-primary/20"
										required
									/>
								</div>

								{/* Gender Field */}
								<div className="space-y-2">
									<Label
										htmlFor="gender"
										className="font-medium"
									>
										Gender{" "}
										<span className="text-destructive">
											*
										</span>
									</Label>
									<Select
										name="gender"
										value={formData.gender || ""}
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
											className="border-input/60 focus-visible:ring-primary/20"
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
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="notForSale"
											checked={isNotForSale}
											onCheckedChange={(checked) =>
												setIsNotForSale(
													checked === true,
												)
											}
										/>
										<Label
											htmlFor="notForSale"
											className="font-medium text-sm cursor-pointer"
										>
											Not for sale (only for display)
										</Label>
									</div>
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Price Field - Only show if not checked as "Not for sale" */}
								{!isNotForSale && (
									<div className="space-y-2">
										<Label
											htmlFor="price"
											className="font-medium"
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
											placeholder="e.g. 2500"
											className="border-input/60 focus-visible:ring-primary/20"
											required={!isNotForSale}
										/>
									</div>
								)}

								{/* Volume Field */}
								<div className="space-y-2">
									<Label
										htmlFor="volume"
										className="font-medium"
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
										value={formData.volume || ""}
										onChange={handleChange}
										placeholder="e.g. 100"
										className="border-input/60 focus-visible:ring-primary/20"
										required
									/>
								</div>
							</motion.div>

							{/* Description Field */}
							<motion.div
								variants={itemVariants}
								className="space-y-2"
							>
								<Label
									htmlFor="descriptions"
									className="font-medium"
								>
									Description{" "}
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="descriptions"
									name="descriptions"
									value={formData.descriptions}
									onChange={handleChange}
									placeholder="Describe the perfume's scent, longevity, projection, and why someone might want it..."
									className="min-h-28 border-input/60 focus-visible:ring-primary/20"
									required
								/>
								<p className="text-xs text-muted-foreground">
									A good description increases your chances of
									finding interested traders
								</p>
							</motion.div>
						</CardContent>
					</Card>

					{/* Additional Information Card */}
					<Card className="border border-border/60 shadow-sm overflow-hidden">
						<CardHeader className="bg-muted/20 pb-3">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-medium text-foreground">
										Additional Details
									</CardTitle>
									<CardDescription className="text-muted-foreground">
										Extra information to make your listing
										stand out
									</CardDescription>
								</div>
								<span className="px-2 py-1 text-xs font-medium rounded-md bg-muted/40 text-muted-foreground">
									Optional
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Brand Field - Enhanced UX Combobox with ScrollArea Component */}
								<div className="space-y-3 flex flex-col mt-2">
									<Label
										htmlFor="brand"
										className="font-medium"
									>
										Brand
									</Label>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												className="w-full justify-between border-input/60 focus-visible:ring-primary/20 text-left font-normal"
											>
												{brandValue ? (
													<span className="flex items-center gap-2">
														<BadgeCheck className="h-4 w-4 text-primary" />
														{brandValue}
													</span>
												) : (
													"Select or add brand..."
												)}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-full p-0"
											align="start"
										>
											<Command>
												<CommandInput
													placeholder="Search brands..."
													autoFocus
													className="border-none focus:ring-0"
												/>
												<CommandEmpty className="py-3 px-4 text-sm flex items-center justify-between">
													<span className="text-muted-foreground">
														No brands found
													</span>
													<Button
														variant="secondary"
														size="sm"
														onClick={() =>
															setIsAddingNewBrand(
																true,
															)
														}
														className="h-8"
													>
														<Plus className="h-3.5 w-3.5 mr-1" />
														Add new
													</Button>
												</CommandEmpty>

												{isAddingNewBrand ? (
													<div className="p-3 border-t">
														<p className="mb-2 text-sm font-medium">
															Add new brand
														</p>
														<div className="flex gap-2">
															<Input
																value={
																	newBrandName
																}
																onChange={(e) =>
																	setNewBrandName(
																		e.target
																			.value,
																	)
																}
																placeholder="Enter brand name"
																className="h-9"
																autoFocus
															/>
															<div className="flex gap-1">
																<Button
																	size="sm"
																	onClick={
																		handleAddNewBrand
																	}
																	className="h-9"
																	disabled={
																		!newBrandName.trim()
																	}
																>
																	Add
																</Button>
																<Button
																	size="sm"
																	variant="ghost"
																	onClick={() =>
																		setIsAddingNewBrand(
																			false,
																		)
																	}
																	className="h-9"
																>
																	Cancel
																</Button>
															</div>
														</div>
													</div>
												) : (
													<>
														<CommandGroup heading="All brands">
															<ScrollArea className="h-40 rounded-md">
																{filteredBrands
																	.slice(
																		0,
																		visibleBrandsCount,
																	)
																	.map(
																		(
																			brand,
																		) => (
																			<CommandItem
																				key={
																					brand.name
																				}
																				value={
																					brand.name
																				}
																				onSelect={() => {
																					handleBrandChange(
																						brand.name,
																					);
																					setOpen(
																						false,
																					);
																				}}
																				className="cursor-pointer"
																			>
																				<Check
																					className={cn(
																						"mr-2 h-4 w-4",
																						brandValue ===
																							brand.name
																							? "opacity-100"
																							: "opacity-0",
																					)}
																				/>
																				{
																					brand.name
																				}
																			</CommandItem>
																		),
																	)}
															</ScrollArea>

															{filteredBrands.length >
																visibleBrandsCount && (
																<div className="p-2 flex justify-center border-t">
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={
																			handleShowMoreBrands
																		}
																		className="w-full text-sm text-primary hover:text-primary/80"
																	>
																		Show
																		more
																		brands (
																		{filteredBrands.length -
																			visibleBrandsCount}{" "}
																		remaining)
																		<ChevronDown className="ml-2 h-4 w-4" />
																	</Button>
																</div>
															)}
														</CommandGroup>

														<CommandSeparator />

														<CommandGroup>
															<CommandItem
																onSelect={() =>
																	setIsAddingNewBrand(
																		true,
																	)
																}
																className="cursor-pointer text-primary"
															>
																<Plus className="mr-2 h-4 w-4" />
																Add new brand...
															</CommandItem>
														</CommandGroup>
													</>
												)}
											</Command>
										</PopoverContent>
									</Popover>
								</div>

								{/* Perfumer Field */}
								<div className="space-y-2">
									<Label
										htmlFor="perfumer"
										className="font-medium"
									>
										Perfumer
									</Label>
									<Input
										id="perfumer"
										name="perfumer"
										value={formData.perfumer || ""}
										onChange={handleChange}
										placeholder="e.g. François Demachy"
										className="border-input/60 focus-visible:ring-primary/20"
									/>
								</div>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
							>
								{/* Concentration Field */}
								<div className="space-y-2">
									<Label
										htmlFor="concentration"
										className="font-medium"
									>
										Concentration
									</Label>
									<Select
										name="concentration"
										value={formData.concentration || ""}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												concentration: value,
											}))
										}
									>
										<SelectTrigger
											id="concentration"
											className="border-input/60 focus-visible:ring-primary/20"
										>
											<SelectValue placeholder="Select concentration" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="extrait">
												Extrait de Parfum
											</SelectItem>
											<SelectItem value="eau_de_parfum">
												Eau de Parfum
											</SelectItem>
											<SelectItem value="eau_de_toilette">
												Eau de Toilette
											</SelectItem>
											<SelectItem value="eau_de_cologne">
												Eau de Cologne
											</SelectItem>
											<SelectItem value="cologne">
												Cologne
											</SelectItem>
											<SelectItem value="eau_fraiche">
												Eau Fraîche
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Scent Type Field */}
								<div className="space-y-2">
									<Label
										htmlFor="scentType"
										className="font-medium"
									>
										Scent Type
									</Label>
									<Select
										name="scentType"
										value={formData.scent_type || ""}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												scent_type: value,
											}))
										}
									>
										<SelectTrigger
											id="scentType"
											className="border-input/60 focus-visible:ring-primary/20"
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
											<SelectItem value="fougere">
												Fougère
											</SelectItem>
											<SelectItem value="chypre">
												Chypre
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</motion.div>

							<div className="flex items-center space-x-2 py-2 px-3 rounded-md bg-muted/10 border border-muted/20 text-sm">
								<InfoCircledIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<p className="text-muted-foreground">
									Complete these fields to increase visibility
									and help buyers find your listing
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</TabsContent>
	);
};

export default TabDetails;
