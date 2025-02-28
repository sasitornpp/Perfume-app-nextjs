"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiltersPerfumeValues, Filters } from "@/types/perfume";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { motion, spring } from "framer-motion";
import { Search as SearchIcon, Filter, X, ArrowLeft } from "lucide-react";
import { filterPerfumes } from "@/utils/functions/filter_perfume";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationEllipsis,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import PerfumeCard from "@/components/perfume_card";

function Search() {
	const perfumeState = useSelector(
		(state: RootState) => state.perfume.perfume,
	);
	const [searchQuery, setSearchQuery] = useState(false);
	const [filters, setFilters] = useState<Filters>(FiltersPerfumeValues);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const savedPage = localStorage.getItem("currentPage");
		if (savedPage) setCurrentPage(Number(savedPage));
	}, []);

	useEffect(() => {
		localStorage.setItem("currentPage", String(currentPage));
	}, [currentPage]);

	const [showFilters, setShowFilters] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const [resultCount, setResultCount] = useState(0);
	const perfumesPerPage = 12; // Reduced count for better presentation

	// Apply filters
	const filtersPerfume = filterPerfumes(perfumeState, filters);
	const perfumesToShow = searchQuery ? filtersPerfume : perfumeState;

	// Update result count
	useEffect(() => {
		setResultCount(perfumesToShow.length);
	}, [perfumesToShow]);

	// Calculate total pages for pagination
	const totalPages = Math.ceil(perfumesToShow.length / perfumesPerPage);
	const paginatedPerfumes = perfumesToShow.slice(
		(currentPage - 1) * perfumesPerPage,
		currentPage * perfumesPerPage,
	);

	// Handle filter changes
	const handleChange = (key: keyof Filters, value: string | string[]) => {
		setSearchQuery(true);
		if (key === "searchQuery" && value === "") {
			setSearchQuery(false);
		}
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
		setCurrentPage(1);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery(false);
		setFilters(FiltersPerfumeValues);
		setCurrentPage(1);
	};

	// Generate pagination items
	const renderPaginationItems = () => {
		const maxVisiblePages = 5;
		const items = [];

		// Always show first page
		items.push(
			<PaginationItem key="first">
				<PaginationLink
					onClick={() => setCurrentPage(1)}
					isActive={currentPage === 1}
					className="transition-all duration-200 hover:scale-110"
				>
					1
				</PaginationLink>
			</PaginationItem>,
		);

		// Show ellipsis if necessary
		if (currentPage > 3) {
			items.push(
				<PaginationItem key="ellipsis1">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Show pages around current page
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						onClick={() => setCurrentPage(i)}
						isActive={currentPage === i}
						className="transition-all duration-200 hover:scale-110"
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Show ellipsis if necessary
		if (currentPage < totalPages - 2) {
			items.push(
				<PaginationItem key="ellipsis2">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Always show last page if there is more than one page
		if (totalPages > 1) {
			items.push(
				<PaginationItem key="last">
					<PaginationLink
						onClick={() => setCurrentPage(totalPages)}
						isActive={currentPage === totalPages}
						className="transition-all duration-200 hover:scale-110"
					>
						{totalPages}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return items;
	};

	return (
		<div className="container mx-auto p-4 mt-20">
			{/* Header with search bar and filter toggle */}
			<div className="mb-6 flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => window.history.back()}
						className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft size={16} />
						<span>Back</span>
					</Button>

					<h1 className="text-2xl font-bold text-center">
						Perfume Collection
					</h1>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowFilters(!showFilters)}
						className="flex items-center gap-1"
					>
						<Filter size={15} />
						<span>
							{showFilters ? "Hide Filters" : "Show Filters"}
						</span>
					</Button>
				</div>

				{/* Animated search bar */}
				<motion.div
					className="relative mx-auto rounded-full shadow-md"
					animate={{
						width: searchFocused ? "100%" : "80%",
						opacity: 1,
						y: 0,
					}}
					transition={{ type: "spring" }}
				>
					<Input
						className={`pl-10 pr-4 py-6 rounded-full border-2 transition-all ${
							searchFocused
								? "border-primary shadow-lg"
								: "border-border shadow-sm"
						}`}
						placeholder="Search perfumes by name..."
						value={filters.searchQuery}
						onChange={(e) =>
							handleChange("searchQuery", e.target.value)
						}
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setSearchFocused(false)}
					/>
					<SearchIcon
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
						size={20}
					/>
					{filters.searchQuery && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
							onClick={() => handleChange("searchQuery", "")}
						>
							<X size={16} className="text-muted-foreground" />
						</Button>
					)}
				</motion.div>

				{/* Filter area with animation */}
				<motion.div
					animate={{
						height: showFilters ? 100 : 0,
						opacity: showFilters ? 1 : 0,
					}}
					transition={{ type: "spring" }}
					className="overflow-hidden transition-all"
				>
					<div>
						<Card className="p-4 mt-2">
							<CardContent className="p-2">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium mb-1 text-muted-foreground">
											Gender
										</label>
										<Select
											value={filters.gender}
											onValueChange={(value) =>
												handleChange("gender", value)
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="women">
													Women
												</SelectItem>
												<SelectItem value="men">
													Men
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Additional filter options can be added here */}

									<div className="flex items-end">
										<Button
											variant="destructive"
											className="w-full"
											onClick={clearFilters}
										>
											Clear All Filters
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.div>

				{/* Results count */}
				<div className="flex justify-between items-center mt-2">
					<Badge variant="outline" className="text-muted-foreground">
						{resultCount} perfumes found
					</Badge>
					<div className="text-sm text-muted-foreground">
						Page {currentPage} of {totalPages}
					</div>
				</div>
			</div>

			{/* Results grid with animations */}
			<ScrollArea
				className={`w-full rounded-md ${showFilters ? "h-[calc(100vh-500px)]" : "h-[calc(100vh-400px)]"}`}
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{ type: "spring" }}
					className="flex flex-wrap gap-6 justify-center"
				>
					{paginatedPerfumes.map((perfume, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.3,
								delay: index * 0.05,
							}}
							className="hover:scale-105 transition-transform my-2"
						>
							<PerfumeCard perfume={perfume} index={index} />
						</motion.div>
					))}
				</motion.div>

				{/* Empty state */}
				{paginatedPerfumes.length === 0 && (
					<div className="flex flex-col items-center justify-center h-64 text-center">
						<div className="text-muted-foreground mb-4">
							<Filter size={48} />
						</div>
						<h3 className="text-lg font-medium">
							No perfumes found
						</h3>
						<p className="text-muted-foreground mt-2">
							Try adjusting your filters or search query
						</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={clearFilters}
						>
							Clear All Filters
						</Button>
					</div>
				)}
			</ScrollArea>

			{/* Pagination with animation */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
				}}
				transition={{ type: "spring" }}
				className="mt-6 p-4"
			>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1),
									)
								}
								aria-disabled={currentPage === 1}
								className={`transition-all duration-200 hover:scale-105 ${
									currentPage === 1
										? "pointer-events-none opacity-50"
										: ""
								}`}
							/>
						</PaginationItem>

						{renderPaginationItems()}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages),
									)
								}
								className={`transition-all duration-200 hover:scale-105 ${
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: ""
								}`}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</motion.div>
		</div>
	);
}

export default Search;
