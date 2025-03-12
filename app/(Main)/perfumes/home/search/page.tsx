"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search as SearchIcon,
	Filter,
	X,
	ArrowLeft,
	Loader2,
} from "lucide-react";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useDispatch } from "react-redux";
import {
	setPerfumesPage,
	fetchTotalCount,
} from "@/redux/pagination/paginationReducer";
import LoadingComponents from "@/components/loading";
import {
	initialValues,
	Filters,
	setFilters,
	clearFilters as clear_Filters,
	setFiltersAndFetch,
} from "@/redux/filters/filterPerfumesReducer";
import SearchSidebar from "@/components/sidebar/search-sidebar";
import { AppDispatch } from "@/redux/Store";

function Search() {
	const dispatch = useDispatch<AppDispatch>();
	const loading = useSelector((state: RootState) => state.perfumes.loading);
	const perfumes = useSelector(
		(state: RootState) => state.perfumes.perfumes_by_page,
	);

	const [formFilters, setFormFilters] = useState<Filters | null>(
		initialValues,
	);

	const isUseFilters = useSelector(
		(state: RootState) => state.filters.Filters,
	);

	const perfumeFilters = useSelector(
		(state: RootState) => state.filters.perfumes,
	);

	const [searchQuery, setSearchQuery] = useState(false);

	// console.log("filters:", formFilters);
	const pagination = useSelector((state: RootState) => state.pagination);

	const [showFilters, setShowFilters] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const [resultCount, setResultCount] = useState(0);

	// Update result count
	useEffect(() => {
		setResultCount(
			Array.isArray(perfumes)
				? perfumes.length
				: Object.values(perfumes).flat().length,
		);
	}, [perfumes]);

	// Calculate total pages for pagination
	const totalPages = useSelector(
		(state: RootState) => state.pagination.perfumesTotalPage,
	);
	const paginatedPerfumes = isUseFilters
		? (perfumeFilters[pagination.perfumesPage] ?? [])
		: (perfumes[pagination.perfumesPage] ?? []);

	// Handle filter changes
	const handleChange = (key: keyof Filters, value: any) => {
		setSearchQuery(true);
		setFormFilters(
			(prev) =>
				({
					...prev,
					[key]: value,
				}) as Filters,
		);
		dispatch(setPerfumesPage(1));
	};

	// Handle array-type filters (like notes and accords)
	const handleArrayFilter = (key: keyof Filters, value: string) => {
		setSearchQuery(true);
		setFormFilters((prev) => {
			if (!prev) return prev;
			const currentArray = prev[key] as string[];
			const newArray = currentArray.includes(value)
				? currentArray.filter((item) => item !== value)
				: [...currentArray, value];

			return {
				...prev,
				[key]: newArray,
			} as Filters;
		});
		dispatch(setPerfumesPage(1));
	};

	// Handle search button click
	const handleSearch = () => {
		setSearchQuery(true);
		if (formFilters) {
			dispatch(setFiltersAndFetch(formFilters));
		}
	};

	// Clear search input
	const clearSearchInput = () => {
		if (formFilters?.search_query) {
			setFormFilters((prev) => {
				if (!prev) return null;
				return {
					...prev,
					searchQuery: "",
					search_query: prev.search_query ?? null,
				} as Filters;
			});

			// If there are no other filters active, turn off search query mode
			if (
				Object.values(formFilters).every(
					(val) => !val || (Array.isArray(val) && val.length === 0),
				)
			) {
				setSearchQuery(false);
			}
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery(false);
		setFormFilters(null);
		dispatch(clear_Filters());
		dispatch(fetchTotalCount());
		dispatch(setPerfumesPage(1));
	};

	// Generate pagination items
	const renderPaginationItems = () => {
		const items = [];

		// Always show first page
		items.push(
			<PaginationItem key="first">
				<PaginationLink
					onClick={() => dispatch(setPerfumesPage(1))}
					isActive={pagination.perfumesPage === 1}
					className="transition-all duration-200 hover:scale-110"
				>
					1
				</PaginationLink>
			</PaginationItem>,
		);

		// Show ellipsis if necessary
		if (pagination.perfumesPage > 3) {
			items.push(
				<PaginationItem key="ellipsis1">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Show pages around current page
		for (
			let i = Math.max(2, pagination.perfumesPage - 1);
			i <= Math.min(totalPages - 1, pagination.perfumesPage + 1);
			i++
		) {
			if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
			items.push(
				<PaginationItem key={i}>
					<PaginationLink
						onClick={() => dispatch(setPerfumesPage(i))}
						isActive={pagination.perfumesPage === i}
						className="transition-all duration-200 hover:scale-110"
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Show ellipsis if necessary
		if (pagination.perfumesPage < totalPages - 2) {
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
						onClick={() => dispatch(setPerfumesPage(totalPages))}
						isActive={pagination.perfumesPage === totalPages}
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
		<div className="container mx-auto p-4 mt-20 relative">
			{/* Fixed Backdrop when sidebar is open */}
			<AnimatePresence>
				{showFilters && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
						onClick={() => setShowFilters(false)}
					/>
				)}
			</AnimatePresence>

			{/* Filter sidebar */}
			<AnimatePresence>
				{showFilters && (
					<SearchSidebar
						formFilters={formFilters}
						setFormFilters={setFormFilters}
						setShowFilters={setShowFilters}
					/>
				)}
			</AnimatePresence>

			{/* Main Content */}
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

				<motion.div
					className="relative mx-auto rounded-full shadow-md"
					animate={{
						width: searchFocused ? "100%" : "80%",
						opacity: 1,
						y: 0,
					}}
					transition={{ duration: 0.3 }}
				>
					<div className="flex">
						<Input
							className={`pl-10 pr-4 py-6 rounded-l-full border-2 transition-all ${
								searchFocused
									? "border-primary shadow-lg"
									: "border-border shadow-sm"
							}`}
							placeholder="Search perfumes by name..."
							value={formFilters?.search_query ?? ""}
							onChange={(e) =>
								handleChange("search_query", e.target.value)
							}
							onKeyDown={(e) =>
								e.key === "Enter" && handleSearch()
							}
							onFocus={() => setSearchFocused(true)}
							onBlur={() => setSearchFocused(false)}
							disabled={loading}
						/>
						<Button
							onClick={handleSearch}
							className="rounded-r-full px-6 shadow-md h-13"
							variant="default"
							disabled={loading}
						>
							{loading ? (
								<Loader2 className="animate-spin" size={25} />
							) : (
								<SearchIcon size={25} />
							)}
						</Button>
					</div>
					<SearchIcon
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
						size={20}
					/>
					{!loading && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-[76px] top-1/2 transform -translate-y-1/2 hover:bg-transparent"
							onClick={clearSearchInput}
						>
							<X size={16} className="text-muted-foreground" />
						</Button>
					)}
				</motion.div>

				{/* Active filters display */}
				{(formFilters?.search_query ||
					(formFilters?.brand_filter?.length ?? 0) > 0 ||
					formFilters?.gender_filter ||
					(formFilters?.accords_filter?.length ?? 0) > 0 ||
					(formFilters?.top_notes_filter?.length ?? 0) > 0 ||
					(formFilters?.middle_notes_filter.length ?? 0) > 0 ||
					(formFilters?.base_notes_filter.length ?? 0) > 0) && (
					<div className="flex flex-wrap gap-2 mt-2">
						{formFilters?.search_query && (
							<Badge variant="secondary" className="px-3 py-1">
								Search: {formFilters?.search_query}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleChange("search_query", "")
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						)}

						{formFilters?.brand_filter && (
							<Badge variant="secondary" className="px-3 py-1">
								Brand: {formFilters?.brand_filter}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleChange("brand_filter", null)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						)}

						{formFilters?.gender_filter && (
							<Badge variant="secondary" className="px-3 py-1">
								Gender: {formFilters?.gender_filter}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleChange("gender_filter", null)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						)}

						{formFilters?.accords_filter.map((accord) => (
							<Badge
								key={accord}
								variant="secondary"
								className="px-3 py-1"
							>
								Accord: {accord}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleArrayFilter(
											"accords_filter",
											accord,
										)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						))}

						{formFilters?.top_notes_filter.map((note) => (
							<Badge
								key={`top-${note}`}
								variant="secondary"
								className="px-3 py-1"
							>
								Top: {note}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleArrayFilter(
											"top_notes_filter",
											note,
										)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						))}

						{formFilters?.middle_notes_filter.map((note) => (
							<Badge
								key={`mid-${note}`}
								variant="secondary"
								className="px-3 py-1"
							>
								Mid: {note}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleArrayFilter(
											"middle_notes_filter",
											note,
										)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						))}

						{formFilters?.base_notes_filter.map((note) => (
							<Badge
								key={`base-${note}`}
								variant="secondary"
								className="px-3 py-1"
							>
								Base: {note}
								<Button
									variant="ghost"
									size="icon"
									className="ml-1 h-4 w-4 p-0"
									onClick={() =>
										handleArrayFilter(
											"base_notes_filter",
											note,
										)
									}
								>
									<X size={12} />
								</Button>
							</Badge>
						))}
					</div>
				)}

				{/* Results count */}
				{searchQuery && (
					<div className="flex justify-between items-center mt-2">
						<Badge
							variant="outline"
							className="text-muted-foreground"
						>
							{loading
								? "Loading..."
								: `${resultCount} perfumes found`}
						</Badge>
						<div className="text-sm text-muted-foreground">
							{!loading &&
								`Page ${pagination.perfumesPage} of ${totalPages}`}
						</div>
					</div>
				)}
			</div>

			{/* Results grid with animations */}
			<ScrollArea className="w-full rounded-md h-[calc(100vh-380px)]">
				{loading ? (
					<LoadingComponents
						title="Loading Perfumes"
						description="Please wait while we fetch the latest perfumes for you."
					/>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{ duration: 0.3 }}
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
				)}

				{/* Empty state (only show when not loading) */}
				{!loading && paginatedPerfumes.length === 0 && (
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

			{/* Pagination (only show when not loading) */}
			{!loading && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{ duration: 0.3 }}
					className="mt-6 p-4"
				>
					<Pagination>
						<PaginationContent className="select-none">
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										dispatch(
											setPerfumesPage(
												pagination.perfumesPage - 1,
											),
										)
									}
									aria-disabled={
										pagination.perfumesPage === 1
									}
									className={`transition-all duration-200 hover:scale-105 ${
										pagination.perfumesPage === 1
											? "pointer-events-none opacity-50"
											: ""
									}`}
								/>
							</PaginationItem>

							{renderPaginationItems()}

							<PaginationItem>
								<PaginationNext
									onClick={() =>
										dispatch(
											setPerfumesPage(
												pagination.perfumesPage + 1,
											),
										)
									}
									className={`transition-all duration-200 hover:scale-105 ${
										pagination.perfumesPage === totalPages
											? "pointer-events-none opacity-50"
											: ""
									}`}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</motion.div>
			)}
		</div>
	);
}

export default Search;
