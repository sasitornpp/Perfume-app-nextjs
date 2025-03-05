"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Icons
import {
	AlignJustify,
	ShoppingCart,
	Heart,
	Check,
	Search,
	X,
	Home,
	ShoppingBag,
	UserRound,
	User,
	AlertCircle,
} from "lucide-react";

// Custom Components
import { AccountDropdown } from "@/components/dropdown-options";

// Types
import { RootState } from "@/redux/Store";
import { createSelector } from "reselect";
// Animation variants
const navItemVariants = {
	hover: { scale: 1.05, transition: { duration: 0.2 } },
	active: { borderBottom: "2px solid hsl(var(--primary))" },
};

const cartItemVariants = {
	hidden: { opacity: 0, y: -10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface HeaderProps {
	pathname: string;
}

function Header({ pathname }: HeaderProps) {
	const router = useRouter();
	const profile = useSelector((state: RootState) => state.user.profile);
	const user = useSelector((state: RootState) => state.user);
	const isAuthenticated = useSelector((state: RootState) => state.user.user);
	// console.log(isAuthenticated);
	const [isScrolled, setIsScrolled] = useState(false);
	const [showAuthWarning, setShowAuthWarning] = useState(false);


    console.log(useSelector((state: RootState) => state.user));

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Redirect to sign-in for protected actions
	const handleProtectedAction = (
		e: React.MouseEvent,
		destination?: string,
	) => {
		if (!isAuthenticated) {
			e.preventDefault();
			setShowAuthWarning(true);
			setTimeout(() => setShowAuthWarning(false), 3000);
			router.push("/sign-in");
			return false;
		}

		if (destination) {
			router.push(destination);
		}
		return true;
	};

	// Navigation links configuration
	const navigationLinks = [
		{
			href: "/perfumes/home",
			label: "Home",
			icon: <Home className="w-4 h-4 mr-2" />,
			requiresAuth: false,
		}
	];

	return (
		<>
			<motion.header
				className={cn(
					"fixed top-0 w-full z-50 transition-all duration-300",
					isScrolled
						? "bg-background/95 backdrop-blur-md shadow-md"
						: "bg-background",
				)}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
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
										alt="Perfume Boutique"
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
							{navigationLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="relative group"
									onClick={(e) =>
										link.requiresAuth && !isAuthenticated
											? handleProtectedAction(e)
											: undefined
									}
								>
									<motion.span
										className={cn(
											"inline-flex items-center text-sm font-medium transition-colors",
											pathname === link.href
												? "text-primary"
												: "text-foreground/70 hover:text-foreground",
										)}
										whileHover="hover"
										variants={navItemVariants}
									>
										{link.icon}
										{link.label}
										{pathname === link.href && (
											<motion.div
												className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
												layoutId="activeNavIndicator"
												initial={{ width: 0 }}
												animate={{ width: "100%" }}
												transition={{ duration: 0.3 }}
											/>
										)}
									</motion.span>
								</Link>
							))}

							<motion.div
								className="hidden lg:flex items-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
							>
								<h2 className="text-lg font-medium text-accent-foreground italic">
									Choose the best perfume for you
								</h2>
							</motion.div>
						</nav>

						{/* Right side actions */}
						<div className="flex items-center space-x-2">
							{/* Search */}
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-colors"
											onClick={(e) =>
												handleProtectedAction(
													e,
													"/perfumes/home/search",
												)
											}
										>
											<Search className="h-5 w-5" />
											<span className="sr-only">
												Search
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Search for perfumes</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							{/* Wishlist */}
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="relative text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-colors"
											onClick={(e) =>
												handleProtectedAction(
													e,
													"/profile?q=wishlist",
												)
											}
										>
											<Heart className="h-5 w-5" />
											<span className="sr-only">
												Wishlist
											</span>
											{/* {isAuthenticated &&
												wishlist &&
												wishlist.length > 0 && (
													<Badge
														variant="secondary"
														className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
													>
														{wishlist.length}
													</Badge>
												)} */}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{isAuthenticated
												? "Your wishlist"
												: "Sign in to access wishlist"}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							{/* Shopping Cart */}
							<Button
								variant="ghost"
								size="icon"
								className="relative text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-colors"
								onClick={
									isAuthenticated
										? () => router.push("/profile?q=basket")
										: (e) => handleProtectedAction(e)
								}
							>
								<ShoppingCart className="h-5 w-5" />
								{/* <span className="sr-only">Shopping cart</span>
								{isAuthenticated && basketItems?.length > 0 && (
									<Badge
										variant="default"
										className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
									>
										{basketItems?.length}
									</Badge>
								)} */}
							</Button>

							{/* Account or Login Button */}
							{isAuthenticated ? (
								<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-10 w-10 p-0 relative"
                                onClick={() => router.push("/profile")}
							>
								<Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-all duration-200">
									{isAuthenticated ? (
										<>
											<AvatarImage
												src={profile?.images || ""}
												alt="Profile"
											/>
											<AvatarFallback className="bg-primary/10 text-primary">
												{profile?.name?.charAt(0) ||
													user?.user?.email?.charAt(0) ||
													"U"}
											</AvatarFallback>
										</>
									) : (
										<AvatarFallback className="bg-muted">
											<UserRound className="h-5 w-5 text-muted-foreground" />
										</AvatarFallback>
									)}
								</Avatar>
								{isAuthenticated && (
									<Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary">
										<span className="sr-only">
											Notifications
										</span>
									</Badge>
								)}
							</Button>
							) : (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="hidden sm:flex items-center gap-1 border-primary/20 hover:border-primary transition-colors"
												onClick={() =>
													router.push("/login")
												}
											>
												<User className="h-4 w-4 text-primary" />
												<span>Sign In</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Sign in to your account</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					</div>
				</div>
			</motion.header>

			{/* Authentication warning toast */}
			<AnimatePresence>
				{showAuthWarning && (
					<motion.div
						className="fixed bottom-4 right-4 z-50 max-w-md p-4 bg-destructive/90 text-destructive-foreground rounded-lg shadow-lg backdrop-blur-sm"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3 }}
					>
						<div className="flex items-center gap-3">
							<AlertCircle className="h-5 w-5" />
							<p>Please sign in to access this feature</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default Header;
