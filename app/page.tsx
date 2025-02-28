"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { Separator } from "@/components/ui/separator";
import { Perfume } from "@/types/perfume";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

function Home() {
	const perfumes = useSelector((state: RootState) => state.perfume.perfume);
	const [activeIndex, setActiveIndex] = useState(0);

	// Memoize carousel items to prevent unnecessary re-renders
	const carouselItems = useMemo(() => {
		if (!perfumes?.length) return [];

		return [...perfumes]
			.sort(() => 0.5 - Math.random())
			.slice(0, 5)
			.map((perfume: Perfume) => {
				const shuffledAccords = Array.isArray(perfume.accords)
					? [...perfume.accords]
							.sort(() => 0.5 - Math.random())
							.slice(0, 4)
					: [];

				return { perfume, shuffledAccords };
			});
	}, [perfumes]);

	// Animate on first load
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		setIsLoaded(true);
	}, []);

	// Get trending perfumes
	const trendingPerfumes = useMemo(() => {
		if (!perfumes?.length) return [];
		return [...perfumes].sort((a, b) => b.rating - a.rating).slice(0, 3);
	}, [perfumes]);

	if (!perfumes.length) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-pulse flex flex-col items-center">
					<div className="w-12 h-12 rounded-full bg-primary/30 mb-4"></div>
					<div className="text-lg">Loading perfumes...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center w-full px-4 pb-16 bg-gradient-to-b from-background to-background/50 mt-20">
			{/* Hero Section */}
			<div className="relative w-full max-w-5xl mx-auto mt-8 mb-16 overflow-hidden rounded-xl">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10 rounded-xl"></div>
				<div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40"></div>

				<div className="relative z-20 py-20 px-6 md:px-12 flex flex-col items-center text-center">
					<motion.h1
						className="text-3xl md:text-5xl font-bold text-foreground mb-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: isLoaded ? 1 : 0,
							y: isLoaded ? 0 : 20,
						}}
						transition={{ duration: 0.7 }}
					>
						Discover the Perfect Fragrance for You
					</motion.h1>
					<motion.p
						className="text-lg text-foreground/90 max-w-2xl mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: isLoaded ? 1 : 0,
							y: isLoaded ? 0 : 20,
						}}
						transition={{ duration: 0.7, delay: 0.2 }}
					>
						Experience scents that reflect your personality and
						enhance your charm
					</motion.p>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: isLoaded ? 1 : 0,
							y: isLoaded ? 0 : 20,
						}}
						transition={{ duration: 0.7, delay: 0.4 }}
					>
						<Button
							asChild
							size="lg"
							className="w-full bg-background text-primary hover:bg-white/90"
						>
							<Link
								href="/survey-form"
								className="flex items-center gap-2"
							>
								<Sparkles size={18} />
								<span>Find Your Perfect Fragrance</span>
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="w-full border-background text-foreground hover:bg-background/20"
						>
							<Link
								href="/perfumes/home/search"
								className="flex items-center gap-2"
							>
								<Search size={18} />
								<span>Search Fragrances</span>
							</Link>
						</Button>
					</motion.div>
				</div>
			</div>

			{/* Featured Perfumes Carousel */}
			<div className="w-full max-w-5xl mx-auto mb-16">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">
						Featured Fragrances of the Day
					</h2>
					<Link
						href="/home/featured"
						className="text-primary hover:underline"
					>
						View All
					</Link>
				</div>

				<Carousel
					className="w-full"
					plugins={[Autoplay({ delay: 4000 })]}
					opts={{ loop: true }}
					onSelect={(event: React.SyntheticEvent) => {
						const target = event.target as HTMLElement;
						const index = parseInt(
							target.getAttribute("data-index") || "0",
						);
						setActiveIndex(index);
					}}
				>
					<CarouselContent>
						{carouselItems.map(
							({ perfume, shuffledAccords }, index) => (
								<CarouselItem
									key={`${perfume.name}-${index}`}
									className="md:basis-1/2 lg:basis-1/3 h-full"
								>
									<Link href={`/perfume/${perfume.id}`}>
										<Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
											<CardContent className="p-0 flex flex-col h-full">
												<div className="relative aspect-square overflow-hidden">
													<Image
														src={perfume.images[0]}
														alt={`${perfume.name} by ${perfume.brand}`}
														fill
														className="object-cover"
														priority={index < 2}
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
													<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
														<div className="flex items-center gap-2 mb-2">
															<div className="relative w-6 h-6 rounded-full overflow-hidden">
																<Image
																	src={
																		perfume.logo
																	}
																	alt={
																		perfume.brand
																	}
																	fill
																	className="object-cover"
																/>
															</div>
															<span className="text-sm font-medium">
																{perfume.brand}
															</span>
														</div>
														<h3 className="text-lg font-bold">
															{perfume.name}
														</h3>
													</div>
												</div>
												<div className="p-4">
													{perfume.descriptions && (
														<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
															{
																perfume.descriptions
															}
														</p>
													)}
													<div className="flex flex-wrap gap-1 mt-2">
														{shuffledAccords.map(
															(accord, i) => (
																<Badge
																	key={`${accord}-${i}`}
																	variant="outline"
																	className="text-xs"
																>
																	{accord}
																</Badge>
															),
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								</CarouselItem>
							),
						)}
					</CarouselContent>
					<div className="flex justify-center mt-4 gap-1">
						{carouselItems.map((_, index) => (
							<div
								key={index}
								className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-primary w-4" : "bg-primary/30"}`}
							/>
						))}
					</div>
					<CarouselPrevious className="left-2" />
					<CarouselNext className="right-2" />
				</Carousel>
			</div>

			{/* Trending Perfumes */}
			<div className="w-full max-w-5xl mx-auto mb-16">
				<div className="flex items-center gap-2 mb-6">
					<TrendingUp className="text-primary" />
					<h2 className="text-2xl font-bold">Trending Scents</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{trendingPerfumes.map((perfume, index) => (
						<Link href={`/perfume/${perfume.id}`} key={perfume.id}>
							<Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
								<CardContent className="p-0 flex flex-col h-full">
									<div className="flex p-4 items-center gap-3">
										<div className="relative w-12 h-12 rounded-lg overflow-hidden">
											<Image
												src={perfume.images[0]}
												alt={perfume.name}
												fill
												className="object-cover"
											/>
										</div>
										<div>
											<h3 className="font-medium">
												{perfume.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{perfume.brand}
											</p>
										</div>
										<div className="ml-auto flex items-center bg-primary/10 px-2 py-1 rounded-full">
											<span className="text-sm font-medium text-primary">
												★ {perfume.rating.toFixed(1)}
											</span>
										</div>
									</div>
									<Separator />
									<div className="p-4">
										<div className="flex flex-wrap gap-1 mb-2">
											{(perfume.accords ?? [])
												.slice(0, 3)
												.map((accord, i) => (
													<Badge
														key={`${accord}-${i}`}
														variant="secondary"
														className="text-xs"
													>
														{accord}
													</Badge>
												))}
										</div>
										{perfume.descriptions && (
											<p className="text-sm text-muted-foreground line-clamp-2">
												{perfume.descriptions}
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* Call to Action */}
			<div className="w-full max-w-md mx-auto">
				<Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/90 to-primary/70">
					<CardContent className="flex flex-col p-8">
						<h3 className="text-xl font-bold text-white mb-4 text-center">
							Haven't Found Your Perfect Fragrance Yet?
						</h3>
						<Button
							asChild
							size="lg"
							className="w-full h-12 mb-4 text-primary bg-white hover:bg-white/90"
						>
							<Link
								href="/survey-form"
								className="text-base font-medium"
							>
								Take the Quiz to Find Your Ideal Scent
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default Home;
