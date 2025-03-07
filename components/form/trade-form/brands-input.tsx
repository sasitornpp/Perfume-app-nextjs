"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createSelector } from "@reduxjs/toolkit";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
	Command,
	CommandInput,
	CommandItem,
	CommandGroup,
	CommandSeparator,
	CommandEmpty,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	BadgeCheck,
	ChevronsUpDown,
	Plus,
	Check,
	ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PerfumeForInsert, PerfumeForUpdate } from "@/types/perfume";
import { Filters } from "@/redux/filters/filterPerfumesReducer";

const selectBrandNames = createSelector(
	(state: RootState) => state.perfumes?.perfume_unique_data?.brand,
	(brands) => {
		if (!brands || !Array.isArray(brands)) return [];
		return brands;
	},
);

function BrandsInput({
	formData,
	setFormData,
}: {
	formData: PerfumeForInsert | PerfumeForUpdate;
	setFormData: React.Dispatch<
		React.SetStateAction<PerfumeForInsert | PerfumeForUpdate>
	>;
}) {
	const [open, setOpen] = useState(false);
	const perfumeBrands = useSelector(selectBrandNames);
	const [brandValue, setBrandValue] = useState(formData.brand || "");
	const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
	const [newBrandName, setNewBrandName] = useState("");

	const filteredBrands = useMemo(() => {
		return [...perfumeBrands].sort((a, b) => a.name.localeCompare(b.name));
	}, [perfumeBrands]);

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
			logo: brandObj?.logo || null,
		}));
	};

	// Handle adding a new brand
	const handleAddNewBrand = () => {
		if (newBrandName.trim()) {
			setBrandValue(newBrandName.trim());
			setFormData((prev) => ({
				...prev,
				brand: newBrandName.trim(),
				logo: null,
			}));
			setIsAddingNewBrand(false);
			setNewBrandName("");
			setOpen(false);
		}
	};

	return (
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
				<PopoverContent className="w-full p-0" align="start">
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
								onClick={() => setIsAddingNewBrand(true)}
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
										value={newBrandName}
										onChange={(e) =>
											setNewBrandName(e.target.value)
										}
										placeholder="Enter brand name"
										className="h-9"
										autoFocus
									/>
									<div className="flex gap-1">
										<Button
											size="sm"
											onClick={handleAddNewBrand}
											className="h-9"
											disabled={!newBrandName.trim()}
										>
											Add
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() =>
												setIsAddingNewBrand(false)
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
											.slice(0, visibleBrandsCount)
											.map((brand) => (
												<CommandItem
													key={brand.name}
													value={brand.name}
													onSelect={() => {
														handleBrandChange(
															brand.name,
														);
														setOpen(false);
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
													{brand.name}
												</CommandItem>
											))}
									</ScrollArea>

									{filteredBrands.length >
										visibleBrandsCount && (
										<div className="p-2 flex justify-center border-t">
											<Button
												variant="ghost"
												size="sm"
												onClick={handleShowMoreBrands}
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
											setIsAddingNewBrand(true)
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
	);
}

export default BrandsInput;
