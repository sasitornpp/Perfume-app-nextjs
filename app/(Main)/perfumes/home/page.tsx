"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Perfume } from "@/types/perfume";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PerfumeCard from "@/components/perfume_card";
import { motion, AnimatePresence } from "framer-motion";
import {
	Sparkles,
	Search,
	Compass,
	Star,
	ArrowRight,
	Gift,
	Clock,
	Heart,
	BadgePercent,
	ChevronRight,
	Droplets,
} from "lucide-react";

function PerfumeLandingPage() {
	const profile = useSelector((state: RootState) => state.user.profile);
	const perfumesBrand = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.brand,
	);
	const router = useRouter();

	const suggestionsPerfumes = useSelector(
		(state: RootState) => state.user.profile?.suggestions_perfumes,
	);

	const [featuredPerfume, setFeaturedPerfume] = useState<Perfume | null>(
		null,
	);
	const [isVisible, setIsVisible] = useState(false);
	const [hoveredBrandIndex, setHoveredBrandIndex] = useState<number | null>(
		null,
	);

	const perfumes = useSelector(
		(state: RootState) => state.perfumes.perfumes_by_page[1],
	);

	useEffect(() => {
		setIsVisible(true);

		if (profile?.suggestions_perfumes && suggestionsPerfumes) {
			if (suggestionsPerfumes.length > 0) {
				setFeaturedPerfume(
					suggestionsPerfumes[
						Math.floor(Math.random() * suggestionsPerfumes.length)
					],
				);
			}
		}
	}, [profile?.suggestions_perfumes]);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	const fadeInVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.6 },
		},
	};

	const staggerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.08,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate={isVisible ? "visible" : "hidden"}
			variants={containerVariants}
			className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-background mt-16"
			suppressHydrationWarning
		>
			{/* Hero Section - Elegant and visually striking */}
			<motion.div
				variants={itemVariants}
				className="rounded-xl overflow-hidden relative mb-12"
			>
				<div className="bg-gradient-to-br from-primary/90 to-primary/50 rounded-xl overflow-hidden">
					<div className="absolute inset-0 bg-background opacity-5 z-10"></div>
					<div className="grid md:grid-cols-2 gap-6 p-8 md:p-12 relative z-20">
						<motion.div
							variants={itemVariants}
							className="flex flex-col justify-center text-primary-foreground"
						>
							<motion.span
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.5 }}
								className="inline-block bg-primary-foreground text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit"
							>
								<Heart className="inline-block w-3 h-3 mr-1" />{" "}
								Personalized Fragrance
							</motion.span>
							<motion.h1
								variants={itemVariants}
								className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
							>
								Discover Your{" "}
								<span className="underline decoration-accent underline-offset-4">
									Perfect
								</span>{" "}
								Scent
							</motion.h1>
							<motion.p
								variants={itemVariants}
								className="text-primary-foreground/90 mb-8 text-lg"
							>
								Explore our curated collection of premium
								fragrances tailored to your unique preferences{" "}
								<br /> and personality.
							</motion.p>
							{!profile?.suggestions_perfumes ? (
								<motion.div
									variants={itemVariants}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										onClick={() =>
											router.push("/survey-form")
										}
										size="lg"
										className="bg-background text-primary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg transition-all w-full sm:w-auto"
									>
										<Sparkles className="mr-2 h-4 w-4" />{" "}
										Find Your Signature Scent
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								</motion.div>
							) : (
								<motion.div
									variants={itemVariants}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										onClick={() =>
											router.push("/survey-form")
										}
										size="lg"
										className="bg-background text-primary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg transition-all w-full sm:w-auto"
									>
										<Heart className="mr-2 h-4 w-4" /> See
										Your Recommendations
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								</motion.div>
							)}
						</motion.div>
						<motion.div
							variants={itemVariants}
							className="flex items-center justify-center p-4 relative"
						>
							{featuredPerfume ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{
										opacity: 1,
										scale: 1,
										y: [0, -10, 0],
									}}
									transition={{
										duration: 2,
										y: {
											duration: 3,
											repeat: Infinity,
											repeatType: "reverse",
											ease: "easeInOut",
										},
									}}
									className="relative h-72 w-72 bg-background/10 rounded-full p-4 backdrop-blur-sm"
								>
									<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-background/30 to-background/5"></div>
									<Image
										src={featuredPerfume.images[0]}
										alt={featuredPerfume.name}
										fill
										className="object-contain p-4"
										priority
									/>
								</motion.div>
							) : (
								<motion.div
									variants={itemVariants}
									className="h-72 w-72 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm"
								>
									<p className="text-foreground text-center font-medium">
										Discover elegant fragrances
									</p>
								</motion.div>
							)}
							{/* Decorative elements */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.6 }}
								transition={{ delay: 0.8, duration: 1 }}
								className="absolute w-32 h-32 rounded-full bg-accent/40 filter blur-3xl top-10 right-10 z-0"
							/>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.4 }}
								transition={{ delay: 1, duration: 1 }}
								className="absolute w-24 h-24 rounded-full bg-primary/40 filter blur-3xl bottom-10 left-10 z-0"
							/>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.3 }}
								transition={{ delay: 1.2, duration: 1 }}
								className="absolute w-16 h-16 rounded-full bg-secondary/30 filter blur-2xl bottom-24 right-24 z-0"
							/>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Benefits Bar - Clean and elegant */}
			<motion.div
				variants={fadeInVariants}
				className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
			>
				{[
					{
						icon: <Clock className="h-5 w-5 text-primary" />,
						text: "Expert Fragrance Matching",
					},
					{
						icon: <BadgePercent className="h-5 w-5 text-primary" />,
						text: "Exclusive Fragrance Reviews",
					},
					{
						icon: <Gift className="h-5 w-5 text-primary" />,
						text: "Seasonal Collection Guides",
					},
					{
						icon: <Sparkles className="h-5 w-5 text-primary" />,
						text: "Personalized Recommendations",
					},
				].map((item, i) => (
					<motion.div
						key={i}
						variants={itemVariants}
						whileHover={{
							y: -5,
							boxShadow:
								"0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
						}}
						className="bg-card border rounded-lg p-4 flex items-center justify-center text-center shadow-sm hover:shadow-md transition-all"
					>
						<div className="flex flex-col sm:flex-row items-center">
							<div className="rounded-full bg-accent/20 p-2 mb-2 sm:mb-0 sm:mr-3">
								{item.icon}
							</div>
							<span className="text-sm font-medium">
								{item.text}
							</span>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Personalized Recommendations - Elegant card design */}
			<motion.div variants={itemVariants} className="mb-16">
				<div className="flex justify-between items-center mb-6">
					<motion.h2
						variants={itemVariants}
						className="text-2xl font-bold flex items-center group"
					>
						<motion.div
							initial={{ rotate: 0 }}
							whileHover={{ rotate: 20 }}
							transition={{ type: "spring", stiffness: 300 }}
							className="mr-2"
						>
							<Star className="h-6 w-6 text-amber-500 group-hover:text-amber-400 transition-colors" />
						</motion.div>
						<span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							Your Personalized Recommendations
						</span>
					</motion.h2>
					{profile?.suggestions_perfumes && (
						<motion.div
							variants={itemVariants}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								variant="outline"
								size="sm"
								className="text-sm border-secondary hover:bg-secondary/10 hover:text-primary"
								onClick={() => router.push("/survey-form")}
							>
								<Compass className="mr-2 h-4 w-4" /> Retake Quiz
							</Button>
						</motion.div>
					)}
				</div>

				<AnimatePresence>
					{profile?.suggestions_perfumes && suggestionsPerfumes ? (
						suggestionsPerfumes.length > 0 ? (
							<motion.div
								variants={fadeInVariants}
								className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
							>
								<ScrollArea className="w-full whitespace-nowrap py-6">
									<div className="flex w-max space-x-6 px-6">
										{suggestionsPerfumes.map(
											(perfume, index) => (
												<motion.div
													key={perfume.id}
													initial={{
														opacity: 0,
														y: 20,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay: index * 0.08,
														duration: 0.5,
													}}
													whileHover={{
														y: -8,
														transition: {
															duration: 0.2,
														},
													}}
													className="transition-all duration-300"
												>
													<PerfumeCard
														perfume={perfume}
														index={index}
													/>
												</motion.div>
											),
										)}
									</div>
									<ScrollBar orientation="horizontal" />
								</ScrollArea>
							</motion.div>
						) : (
							<motion.div
								variants={fadeInVariants}
								className="border shadow-md rounded-xl bg-card overflow-hidden"
							>
								<CardContent className="flex flex-col h-64 p-8 items-center justify-center">
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ duration: 0.5 }}
										className="rounded-full bg-primary/10 p-4 mb-4"
									>
										<Compass className="h-10 w-10 text-primary" />
									</motion.div>
									<motion.div
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay: 0.2,
											duration: 0.5,
										}}
										className="text-xl font-medium text-center text-card-foreground mb-2"
									>
										We couldn't find perfect matches
									</motion.div>
									<motion.p
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay: 0.3,
											duration: 0.5,
										}}
										className="text-center text-muted-foreground mb-6"
									>
										Let's refine your preferences to
										discover your ideal scent
									</motion.p>
									<motion.div
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											delay: 0.4,
											duration: 0.5,
										}}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											size="lg"
											className="bg-primary hover:bg-primary/90"
											onClick={() =>
												router.push("/survey-form")
											}
										>
											Update Preferences
										</Button>
									</motion.div>
								</CardContent>
							</motion.div>
						)
					) : (
						<motion.div
							variants={fadeInVariants}
							className="border border-primary/20 shadow-md rounded-xl bg-gradient-to-br from-background to-accent/5 overflow-hidden"
						>
							<CardContent className="flex flex-col h-96 p-10 items-center justify-center">
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.5 }}
									className="relative"
								>
									<motion.div
										className="absolute -inset-2 rounded-full bg-primary/10 opacity-70 blur-md"
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0.7, 0.3, 0.7],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											repeatType: "reverse",
										}}
									/>
									<div className="rounded-full bg-primary/20 p-6 mb-4 relative z-10">
										<Droplets className="h-12 w-12 text-primary" />
									</div>
								</motion.div>
								<motion.div
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.2, duration: 0.5 }}
									className="text-2xl font-bold text-center text-foreground mb-3 mt-2"
								>
									Find Your Signature Fragrance
								</motion.div>
								<motion.p
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.3, duration: 0.5 }}
									className="text-center text-muted-foreground mb-8 max-w-md"
								>
									Take our quick quiz to get personalized
									fragrance recommendations tailored to your
									unique preferences and personality.
								</motion.p>
								<motion.div
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.5 }}
									whileHover={{
										scale: 1.03,
										boxShadow:
											"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									}}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										size="lg"
										className="px-8 py-6 bg-primary hover:bg-primary/90 text-lg shadow-md"
										onClick={() =>
											router.push("/survey-form")
										}
									>
										Begin the Quiz{" "}
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</motion.div>
							</CardContent>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Tabbed Perfume Showcase - Elegant tabs */}
			<motion.div variants={itemVariants} className="mb-16">
				<div className="flex justify-between items-center mb-6">
					<motion.h2
						variants={itemVariants}
						className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
					>
						Explore Fragrances
					</motion.h2>
					<motion.div
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							variant="ghost"
							size="sm"
							className="text-sm hover:bg-accent/10 hover:text-primary"
							onClick={() => router.push("/perfumes/home/search")}
						>
							<Search className="mr-2 h-4 w-4" /> View All
						</Button>
					</motion.div>
				</div>
				<motion.div
					variants={staggerVariants}
					className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={profile?.suggestions_perfumes ? 1 : 2}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							<ScrollArea className="w-full whitespace-nowrap py-6">
								<div className="flex w-max space-x-6 px-6">
									{perfumes &&
										perfumes
											.slice(0, 20)
											.map((perfume, index) => (
												<motion.div
													key={perfume.id}
													initial={{
														opacity: 0,
														y: 20,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay: index * 0.04,
														duration: 0.3,
													}}
													whileHover={{
														y: -8,
														transition: {
															duration: 0.2,
														},
													}}
													className="transition-all duration-300"
												>
													<PerfumeCard
														perfume={perfume}
														index={index}
													/>
												</motion.div>
											))}
								</div>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</motion.div>

			{/* Brand Showcase - Elegant grid with hover effects */}
			<motion.div variants={itemVariants}>
				<motion.h2
					variants={itemVariants}
					className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
				>
					Premium Brands
				</motion.h2>
				<motion.div
					variants={staggerVariants}
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
				>
					{perfumesBrand.slice(0, 6).map((brand, index) => (
						<motion.div
							key={index}
							variants={itemVariants}
							whileHover={{
								y: -5,
								boxShadow:
									"0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
							}}
							onHoverStart={() => setHoveredBrandIndex(index)}
							onHoverEnd={() => setHoveredBrandIndex(null)}
						>
							<Card className="border hover:border-primary/20 transition-all cursor-pointer bg-card h-full rounded-lg shadow-sm hover:shadow-md">
								<CardContent className="flex flex-col items-center p-6">
									<motion.div
										className="justify-center items-center flex h-24 w-full relative"
										animate={{
											y:
												hoveredBrandIndex === index
													? [0, -5, 0]
													: 0,
										}}
										transition={{
											duration: 1.5,
											repeat:
												hoveredBrandIndex === index
													? Infinity
													: 0,
											repeatType: "reverse",
										}}
									>
										<Image
											src={brand.logo}
											alt={brand.name}
											width={80}
											height={80}
											priority={index < 2}
											className="object-contain"
										/>
										{hoveredBrandIndex === index && (
											<motion.div
												initial={{
													opacity: 0,
													scale: 0,
												}}
												animate={{
													opacity: 0.1,
													scale: 1.2,
												}}
												className="absolute inset-0 bg-primary rounded-full filter blur-md"
											/>
										)}
									</motion.div>
									<motion.span
										className="text-sm font-medium text-center mt-4 truncate w-full"
										animate={{
											color:
												hoveredBrandIndex === index
													? "var(--primary)"
													: "var(--foreground)",
										}}
									>
										{brand.name}
									</motion.span>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
				<motion.div variants={fadeInVariants} className="mt-4">
					<ScrollArea className="w-full whitespace-nowrap rounded-md">
						<div className="flex w-max space-x-4 p-4">
							{perfumesBrand.map((brand, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										delay: index * 0.05,
										duration: 0.3,
									}}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<Card className="w-32 border hover:border-primary/20 transition-all cursor-pointer bg-card">
										<CardContent className="flex flex-col items-center p-4">
											<motion.div
												className="justify-center items-center flex h-20 w-full"
												whileHover={{
													scale: 1.1,
													transition: {
														type: "spring",
														stiffness: 300,
													},
												}}
											>
												<Image
													src={brand.logo}
													alt={brand.name}
													width={60}
													height={60}
													className="object-contain"
												/>
											</motion.div>
											<span className="text-xs font-medium text-center mt-4 truncate w-full">
												{brand.name}
											</span>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

export default PerfumeLandingPage;
