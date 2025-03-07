"ues client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	X,
	BadgeCheck,
	ChevronsUpDown,
	Plus,
	Check,
	ChevronDown,
	Droplets,
	Info,
	Search,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { createSelector } from "@reduxjs/toolkit";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filters } from "@/redux/filters/filterPerfumesReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import {
	Command,
	CommandList,
	CommandGroup,
	CommandItem,
	CommandInput,
	CommandEmpty,
	CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import NoteInput from "@/components/form/trade-form/note-input";

const selectBrandNames = createSelector(
	(state: RootState) => state.perfumes?.perfume_unique_data?.brand,
	(brands) => {
		if (!brands || !Array.isArray(brands)) return [];
		return brands;
	},
);

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

function SearchSidebar({
	setShowFilters,
	formFilters,
	setFormFilters,
}: {
	setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
	formFilters: Filters | null;
	setFormFilters: React.Dispatch<React.SetStateAction<Filters | null>>;
}) {
	const [open, setOpen] = useState(false);
	const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
	const [newBrandName, setNewBrandName] = useState<string | null>(null);
	const [brandsValue, setBrandsValue] = useState<string[]>(
		Array.isArray(formFilters?.brand_filter)
			? formFilters?.brand_filter
			: [],
	);

	const filters = useSelector((state: RootState) => state.filters.Filters);

	const perfumeTopNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data?.top_notes,
	);
	const perfumeMiddleNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data?.middle_notes,
	);
	const perfumeBaseNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data?.base_notes,
	);
	const perfumeAccords = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data?.accords,
	);

	const perfumeBrands = useSelector(selectBrandNames);
	const filteredBrands = useMemo(() => {
		return [...perfumeBrands].sort((a, b) => a.name.localeCompare(b.name));
	}, [perfumeBrands]);

	const [visibleBrandsCount, setVisibleBrandsCount] = useState(5);
	const handleChange = (key: keyof Filters, value: string | null | boolean) => {
			setFormFilters((prev) => {
				if (!prev)
					return {
						search_query: null,
						brand_filter: [],
						gender_filter: null,
						accords_filter: [],
						top_notes_filter: [],
						middle_notes_filter: [],
						base_notes_filter: [],
						is_tradable_filter: false,
						[key]: value,
					} as Filters;
				return {
					...prev,
					[key]: value,
				};
			});
		};

	const handleAddNewBrand = () => {
		setIsAddingNewBrand(true);
	};

	const handleArrayFilter = (
		key: keyof Pick<
			Filters,
			| "accords_filter"
			| "top_notes_filter"
			| "middle_notes_filter"
			| "base_notes_filter"
		>,
		value: string,
	) => {
		setFormFilters((prev) => {
			if (!prev) {
				return {
					search_query: null,
					brand_filter: [],
					gender_filter: null,
					accords_filter: [],
					top_notes_filter: [],
					middle_notes_filter: [],
					base_notes_filter: [],
					is_tradable_filter: false,
					[key]: [value],
				} as Filters;
			}
			return {
				...prev,
				[key]: [...(prev[key] || []), value],
			} as Filters;
		});
	};

	const handleBrandChange = (brandName: string) => {
		setBrandsValue((prev) =>
			prev.includes(brandName)
				? prev.filter((b) => b !== brandName)
				: [...prev, brandName],
		);
		setFormFilters((prev) => {
			if (!prev) {
				return {
					search_query: null,
					brand_filter: [brandName],
					gender_filter: null,
					accords_filter: [],
					top_notes_filter: [],
					middle_notes_filter: [],
					base_notes_filter: [],
					is_tradable_filter: false,
				} as Filters;
			}
			const brand_filter = prev.brand_filter ?? [];
			return {
				...prev,
				brand_filter: brand_filter.includes(brandName)
					? brand_filter.filter((b) => b !== brandName)
					: [...brand_filter, brandName],
			} as Filters;
		});
	};
	const handleShowMoreBrands = () => {
		setVisibleBrandsCount((prev) =>
			Math.min(prev + 10, filteredBrands.length),
		);
	};

	const handleArrayChange = (
		type: keyof Filters,
		index: number,
		value: string,
	) => {
		const newArray = [...((formFilters?.[type] as string[]) || [])];
		newArray[index] = value;
		setFormFilters((prev) => {
			if (!prev)
				return {
					search_query: null,
					brand_filter: [],
					gender_filter: null,
					accords_filter: [],
					top_notes_filter: [],
					middle_notes_filter: [],
					base_notes_filter: [],
					is_tradable_filter: false,
					[type]: newArray,
				} as Filters;
			return {
				...prev,
				[type]: newArray,
			} as Filters;
		});
	};

	const addArrayItem = (type: keyof Filters) => {
		setFormFilters((prev) => {
			if (!prev) {
				return {
					search_query: null,
					brand_filter: [],
					gender_filter: null,
					accords_filter: [],
					top_notes_filter: [],
					middle_notes_filter: [],
					base_notes_filter: [],
					is_tradable_filter: false,
					[type]: [""],
				};
			}
			return {
				...prev,
				[type]: [...((prev[type] as string[]) || []), ""],
			};
		});
	};

	const removeArrayItem = (type: keyof Filters, index: number) => {
		const newArray = ((formFilters?.[type] as string[]) || []).filter(
			(_, i) => i !== index,
		);
		setFormFilters((prev) => {
			if (!prev)
				return {
					search_query: "",
					brand_filter: [],
					gender_filter: "",
					accords_filter: [],
					top_notes_filter: [],
					middle_notes_filter: [],
					base_notes_filter: [],
					is_tradable_filter: false,
					[type]: newArray,
				};
			return {
				...prev,
				[type]: newArray,
			};
		});
	};

	const clearFilters = () => {
		setFormFilters(null);
		setNewBrandName(null);
		setBrandsValue([]);
		setIsAddingNewBrand(false);
	};

	// console.log("formFilters:", formFilters);

	return (
		<motion.div
			initial={{ x: "100%", opacity: 0.5 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: "100%", opacity: 0.5 }}
			transition={{
				type: "spring",
				damping: 25,
				stiffness: 300,
			}}
			className="fixed right-0 top-24 bottom-0 w-[400px] bg-card shadow-lg z-40 overflow-hidden rounded-lg"
		>
			<div className="flex items-center justify-between p-4 border-b">
				<h2 className="text-xl font-semibold">Filters</h2>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowFilters(false)}
				>
					<X size={18} />
				</Button>
			</div>
			<ScrollArea className="h-[calc(100vh-10rem)] px-4 py-6">
				<div className="space-y-6 pr-2">
					<div className="space-y-3 flex flex-col mt-2">
						<Label htmlFor="brand" className="font-medium">
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
									Select or add brand...
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-3" />
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
												setIsAddingNewBrand(true)
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
													value={newBrandName || ""}
													onChange={(e) =>
														setNewBrandName(
															e.target.value,
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
															!newBrandName?.trim()
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
														.map((brand) => (
															<CommandItem
																key={brand.name}
																value={
																	brand.name
																}
																onSelect={() => {
																	handleBrandChange(
																		brand.name,
																	);
																	// Keep the popover open to allow more selections
																}}
																className="cursor-pointer flex items-center"
															>
																<div className="mr-2 h-4 w-4 flex items-center justify-center">
																	<Check
																		className={cn(
																			"h-3.5 w-3.5 text-primary",
																			brandsValue.includes(
																				brand.name,
																			)
																				? "opacity-100"
																				: "opacity-0",
																		)}
																	/>
																</div>
																<span className="truncate">
																	{brand.name}
																</span>
															</CommandItem>
														))}
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
															Show more brands (
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

					{brandsValue.length > 0 && (
						<span className="flex items-center gap-1.5 flex-wrap max-w-full pr-6">
							{brandsValue.map((brand) => (
								<Badge
									key={brand}
									variant="outline"
									className="flex items-center gap-1 bg-primary/5 border-primary/20 text-xs py-0.5"
								>
									<BadgeCheck className="h-3 w-3 text-primary" />
									{brand}
								</Badge>
							))}
						</span>
					)}

					{/* Tradable filter */}
					<div className="flex items-center space-x-2 px-2">
						<Checkbox
							id="tradable"
							checked={formFilters?.is_tradable_filter || false}
							onCheckedChange={(checked) => {
								handleChange(
									"is_tradable_filter",
									Boolean(checked),
								);
							}}
						/>
						<div className="grid gap-1.5 leading-none">
							<label
								htmlFor="tradable"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Only show tradable perfumes
							</label>
							<p className="text-sm text-muted-foreground">
								Filter to see only perfumes available for trade
							</p>
						</div>
					</div>

					{/* Gender filter */}
					<div className="space-y-3 flex flex-col px-2">
						<label className="block text-sm font-medium mb-2">
							Gender
						</label>
						<Select
							value={formFilters?.gender_filter ?? "None"}
							onValueChange={(value) =>
								handleChange(
									"gender_filter",
									value === "None" ? null : value,
								)
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select gender" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="for women">Women</SelectItem>
								<SelectItem value="for men">Men</SelectItem>
								<SelectItem value="None">None</SelectItem>
							</SelectContent>
						</Select>
					</div>

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

						<NoteInput
							key="top_notes"
							type="Top"
							notes={formFilters?.top_notes_filter || []}
							suggestions={perfumeTopNotes}
							onAddNote={() => addArrayItem("top_notes_filter")}
							onRemoveNote={(index) =>
								removeArrayItem("top_notes_filter", index)
							}
							onChangeNote={(index, value) =>
								handleArrayChange(
									"top_notes_filter",
									index,
									value,
								)
							}
							onNotesChange={(notes) =>
								setFormFilters((prev) => {
									if (!prev)
										return {
											search_query: null,
											brand_filter: [],
											gender_filter: null,
											accords_filter: [],
											top_notes_filter: notes,
											middle_notes_filter: [],
											base_notes_filter: [],
											is_tradable_filter: false,
										} as Filters;
									return {
										...prev,
										top_notes_filter: notes,
									} as Filters;
								})
							}
						/>

						<NoteInput
							key="middle_notes"
							type="Middle"
							notes={formFilters?.middle_notes_filter || []}
							suggestions={perfumeMiddleNotes}
							onAddNote={() =>
								addArrayItem("middle_notes_filter")
							}
							onRemoveNote={(index) =>
								removeArrayItem("middle_notes_filter", index)
							}
							onChangeNote={(index, value) =>
								handleArrayChange(
									"middle_notes_filter",
									index,
									value,
								)
							}
							onNotesChange={(notes) =>
								setFormFilters((prev) => {
									if (!prev)
										return {
											search_query: null,
											brand_filter: [],
											gender_filter: null,
											accords_filter: [],
											top_notes_filter: [],
											middle_notes_filter: notes,
											base_notes_filter: [],
											is_tradable_filter: false,
										} as Filters;
									return {
										...prev,
										middle_notes_filter: notes,
									} as Filters;
								})
							}
						/>

						<NoteInput
							key="base_notes"
							type="Base"
							notes={formFilters?.base_notes_filter || []}
							suggestions={perfumeBaseNotes}
							onAddNote={() => addArrayItem("base_notes_filter")}
							onRemoveNote={(index) =>
								removeArrayItem("base_notes_filter", index)
							}
							onChangeNote={(index, value) =>
								handleArrayChange(
									"base_notes_filter",
									index,
									value,
								)
							}
							onNotesChange={(notes) =>
								setFormFilters((prev) => {
									if (!prev)
										return {
											search_query: null,
											brand_filter: [],
											gender_filter: null,
											accords_filter: [],
											top_notes_filter: [],
											middle_notes_filter: [],
											base_notes_filter: notes,
											is_tradable_filter: false,
										} as Filters;
									return {
										...prev,
										base_notes_filter: notes,
									} as Filters;
								})
							}
						/>

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
											<TooltipTrigger asChild>
												<Info className="h-4 w-4 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p>
													The overall impression or
													character of the fragrance
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</Label>
							</div>

							{/* Update Accords Section to use the same autocomplete approach */}
							<AnimatePresence>
								{formFilters?.accords_filter?.map(
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
											<Popover>
												<div className="relative flex-1">
													<PopoverTrigger asChild>
														<div className="relative w-full">
															<Input
																value={accord}
																onChange={(e) =>
																	handleArrayChange(
																		"accords_filter",
																		index,
																		e.target
																			.value,
																	)
																}
																placeholder="e.g., Woody, Citrus, Powdery"
																className="border-input bg-background pr-8"
															/>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="absolute right-1 top-1 h-6 w-6 p-0 text-muted-foreground"
															>
																<Search className="h-4 w-4" />
															</Button>
														</div>
													</PopoverTrigger>
													<PopoverContent
														className="w-full p-0"
														align="start"
													>
														<Command>
															<CommandInput
																placeholder="Search accords..."
																className="h-9"
															/>
															<CommandList>
																{perfumeAccords
																	.slice(
																		0,
																		20,
																	)
																	.map(
																		(
																			accord,
																		) => (
																			<CommandItem
																				key={
																					accord
																				}
																				onSelect={() =>
																					handleArrayChange(
																						"accords_filter",
																						index,
																						accord,
																					)
																				}
																				className="cursor-pointer"
																			>
																				{
																					accord
																				}
																			</CommandItem>
																		),
																	)}
															</CommandList>
														</Command>
													</PopoverContent>
												</div>
											</Popover>

											{(formFilters.accords_filter || [])
												.length > 1 && (
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() =>
														removeArrayItem(
															"accords_filter",
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
								onClick={() => addArrayItem("accords_filter")}
								className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
							>
								<Plus className="mr-1 h-3 w-3" /> Add Accord
							</Button>
						</motion.div>
					</motion.div>

					{/* Clear filters button */}
					<Button
						variant="destructive"
						className="w-full mt-4"
						onClick={clearFilters}
					>
						Clear All Filters
					</Button>
				</div>
				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</motion.div>
	);
}

export default SearchSidebar;
