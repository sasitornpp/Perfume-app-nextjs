"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AccountDropdown } from "@/components/dropdown-options";
import {
	AlignJustify,
	ShoppingCart,
	Heart,
	Check,
	Search,
	X,
	Home,
	ShoppingBag,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

function Header({ pathname }: any) {
	const baskets = useSelector((state: RootState) => state.basket);
	const [isScrolled, setIsScrolled] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const springConfig = { stiffness: 300, damping: 30 };

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.header
			className={cn(
				"fixed top-0 w-full z-50 transition-all duration-300",
				isScrolled
					? "bg-background/95 backdrop-blur-md shadow-md"
					: "bg-background",
			)}
			style={{
				y: isScrolled ? 0 : 0,
				boxShadow: isScrolled ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center py-4 md:space-x-10">
					{/* Logo and Brand */}
					<div className="flex justify-start items-center">
						<Link href="/" className="flex">
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="flex items-center"
							>
								<Image
									src="https://lalzmarjvjsqavjsuiux.supabase.co/storage/v1/object/public/IMAGES/Logo/a.png"
									alt="logo"
									width={120}
									height={60}
									className="rounded-md object-cover aspect-[150/75]"
									priority
								/>
							</motion.div>
						</Link>
					</div>

					{/* Navigation Links - Desktop */}
					<nav className="hidden md:flex space-x-8">
						<Link href="/perfumes/home" className="relative group">
							<span
								className={cn(
									"inline-flex items-center text-sm font-medium transition-colors",
									pathname === "/perfumes/home"
										? "text-primary"
										: "text-foreground/70 hover:text-foreground",
								)}
							>
								<Home className="w-4 h-4 mr-2" />
								Home
								{pathname === "/perfumes/home" && (
									<motion.div
										className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
										style={{
											width: "100%",
										}}
									/>
								)}
							</span>
						</Link>

						<Link href="/perfumes/trade" className="relative group">
							<span
								className={cn(
									"inline-flex items-center text-sm font-medium transition-colors",
									pathname === "/perfumes/trade"
										? "text-primary"
										: "text-foreground/70 hover:text-foreground",
								)}
							>
								<ShoppingBag className="w-4 h-4 mr-2" />
								Shop
								{pathname === "/perfumes/trade" && (
									<motion.div
										className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
										style={{
											width: "100%",
										}}
									/>
								)}
							</span>
						</Link>

						<motion.div
							className="hidden lg:flex items-center"
							style={{
								opacity: 1,
							}}
						>
							<h2 className="text-lg font-medium text-accent-foreground italic">
								Choose the best perfume for you
							</h2>
						</motion.div>
					</nav>

					{/* Right side actions */}
					<div className="flex items-center space-x-2">
						{/* Search */}
						<div className="relative">
							{showSearch ? (
								<motion.div
									className="relative flex items-center"
									style={{
										opacity: showSearch ? 1 : 0,
										width: showSearch ? 200 : 0,
									}}
								>
									<Input
										type="search"
										placeholder="Search perfumes..."
										className="pl-8 pr-8"
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										autoFocus
									/>
									<Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
									<Button
										variant="ghost"
										size="icon"
										className="absolute right-0 h-8 w-8"
										onClick={() => {
											setShowSearch(false);
											setSearchQuery("");
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</motion.div>
							) : (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowSearch(true)}
									className="text-foreground/70 hover:text-foreground"
								>
									<Search className="h-5 w-5" />
								</Button>
							)}
						</div>

						{/* Wishlist */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="relative text-foreground/70 hover:text-foreground hover:bg-accent/50"
									>
										<Heart className="h-5 w-5" />
										<span className="sr-only">
											Wishlist
										</span>
										<Badge
											variant="secondary"
											className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
										>
											3
										</Badge>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Your wishlist</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Cart */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="relative text-foreground/70 hover:text-foreground hover:bg-accent/50"
									>
										<ShoppingCart className="h-5 w-5" />
										<span className="sr-only">
											Shopping cart
										</span>
										{baskets.length > 0 && (
											<Badge
												variant="default"
												className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
											>
												{baskets.length}
											</Badge>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent
									side="bottom"
									className="p-0 bg-transparent border-none shadow-none"
								>
									<Card className="w-[320px] shadow-lg border-2 border-primary/10">
										<CardHeader className="pb-2 bg-primary/5 rounded-t-lg">
											<CardTitle className="text-lg flex items-center">
												<ShoppingCart className="w-4 h-4 mr-2 text-primary" />
												Your Perfume Basket
											</CardTitle>
										</CardHeader>
										<CardContent className="pt-4 max-h-[300px] overflow-y-auto">
											{baskets.length > 0 ? (
												<div className="space-y-3">
													{baskets.map(
														(basket, index) => (
															<div
																key={index}
																className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent/10 transition-colors"
															>
																<div className="h-12 w-12 bg-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center">
																	<ShoppingBag className="h-6 w-6 text-secondary" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium truncate">
																		{
																			basket.name
																		}
																	</p>
																	<p className="text-xs text-muted-foreground line-clamp-1">
																		{
																			basket.descriptions
																		}
																	</p>
																</div>
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-8 w-8 text-destructive"
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														),
													)}
												</div>
											) : (
												<div className="py-8 text-center space-y-3">
													<div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
														<ShoppingCart className="h-6 w-6 text-muted-foreground" />
													</div>
													<p className="text-muted-foreground">
														Your basket is empty
													</p>
												</div>
											)}
										</CardContent>
										<CardFooter className="bg-muted/20 rounded-b-lg">
											{baskets.length > 0 ? (
												<Button className="w-full bg-primary hover:bg-primary/90">
													<Check className="mr-2 h-4 w-4" />{" "}
													Checkout
												</Button>
											) : (
												<Button
													variant="outline"
													className="w-full"
												>
													<ShoppingBag className="mr-2 h-4 w-4" />{" "}
													Browse Products
												</Button>
											)}
										</CardFooter>
									</Card>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Mobile Menu */}
						<div className="md:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<AlignJustify className="h-5 w-5" />
										<span className="sr-only">
											Open menu
										</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[200px] mr-2"
								>
									<DropdownMenuGroup>
										<Link href="/" className="w-full">
											<DropdownMenuItem>
												<Home className="mr-2 h-4 w-4" />
												Home
											</DropdownMenuItem>
										</Link>
										<DropdownMenuSeparator />
										<Link href="/shop" className="w-full">
											<DropdownMenuItem>
												<ShoppingBag className="mr-2 h-4 w-4" />
												Shop
											</DropdownMenuItem>
										</Link>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Account */}
						<AccountDropdown />
					</div>
				</div>
			</div>

			{/* Full-width search on smaller screens */}
			{(pathname === "/search/all" ||
				(showSearch && window.innerWidth < 640)) && (
				<div className="border-t border-border/30 py-2 px-4 bg-background/95 backdrop-blur-sm">
					<div className="relative max-w-xl mx-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							name="search"
							type="search"
							placeholder="Search for perfumes..."
							className="pl-10 pr-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-0 top-0 h-full"
								onClick={() => setSearchQuery("")}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			)}
		</motion.header>
	);
}

export default Header;
