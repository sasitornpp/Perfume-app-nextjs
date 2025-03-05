"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { suggestedPerfume } from "@/types/perfume";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, RefreshCcw } from "lucide-react";
import { useDispatch } from "react-redux";

function PerfumeCard({
	perfume,
	index,
}: {
	perfume: suggestedPerfume;
	index: number;
}) {
	const [isHovered, setIsHovered] = useState(false);
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.user);

	const shuffledAccords = Array.isArray(perfume.accords)
		? [...perfume.accords].sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];

	const isTradable = "is_tradable" in perfume ? perfume.is_tradable : false;

	return (
		<motion.div
			style={{
				scale: isHovered ? 1.03 : 1,
				boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
			}}
			className="transition-all duration-300 hover:z-50 my-4"
		>
			<Card
				className="w-[300px] overflow-hidden border-2 relative rounded-lg"
				style={{
					borderColor: isHovered
						? `${isTradable && "user_id" in perfume && user?.id === perfume.user_id ? "lightgreen" : "hsl(var(--primary))"}`
						: `${isTradable && "user_id" in perfume && user?.id === perfume.user_id ? "green" : "hsl(var(--border))"}`,
					background: "hsl(var(--card))",
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Favorite button moved outside of Link */}
				<div className="absolute top-4 right-4 z-10 flex space-x-2">
					<div
						className="cursor-pointer p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300"
						// onClick={handleFavoriteClick}
					>
						<Heart
							size={20}
							className={`transition-colors fill-destructive text-destructive`}
						/>
					</div>

					{isTradable && (
						<div className="cursor-pointer p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300">
							<RefreshCcw
								size={20}
								className="transition-colors text-green-500"
							/>
						</div>
					)}
				</div>

				{/* Match score positioned at top-left */}
				{"match_score" in perfume && (
					<div className="absolute top-4 left-4 z-10">
						<div className="flex flex-col items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary w-16 h-16 text-center">
							<span className="text-xs font-medium">
								{Math.round(perfume.match_score ?? 0)}%
							</span>
							<span className="text-[0.6rem] font-medium">
								match
							</span>
						</div>
					</div>
				)}

				<Link
					href={`${isTradable ? `/perfumes/trade/${perfume.id}` : `/perfumes/${perfume.id}`}`}
					className="block"
				>
					<CardContent className="flex flex-col h-[420px] p-0 overflow-hidden">
						<div className="relative overflow-hidden w-full h-[240px] bg-gradient-to-b from-background to-muted flex items-center justify-center">
							<motion.div
								style={{
									y: isHovered ? -5 : 0,
									rotate: isHovered ? -3 : 0,
								}}
							>
								{perfume.images.length > 0 && (
									<Image
										src={perfume.images[0].toString()}
										alt={`${perfume.name} by ${perfume.brand}`}
										width={180}
										height={180}
										priority={index < 2}
										className="object-contain drop-shadow-md transition-all duration-300"
									/>
								)}
							</motion.div>

							{isHovered && (
								<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30" />
							)}
						</div>

						<div className="flex flex-1 flex-col w-full p-5 space-y-3 overflow-hidden">
							<div>
								<motion.h3
									className="text-lg font-semibold leading-tight truncate"
									style={{
										x: isHovered ? 3 : 0,
									}}
								>
									{perfume.name}
								</motion.h3>
								<h4 className="text-sm text-muted-foreground font-medium">
									{perfume.brand}
								</h4>
								{/* Removed match_score from here */}
							</div>

							{perfume.descriptions && (
								<p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
									{perfume.descriptions}
								</p>
							)}

							<div className="flex flex-row flex-wrap gap-1 mt-auto pt-2">
								{shuffledAccords.map((accord, i) => (
									<motion.span
										key={`${accord}-${i}`}
										style={{
											scale: isHovered ? 1.05 : 1,
											y: isHovered ? -2 + i * -1 : 0,
										}}
										className={`text-xs rounded-full px-3 py-1 font-medium transition-colors duration-300 
                ${i === 0 ? "bg-primary/15 text-primary" : i === 1 ? "bg-secondary/15 text-secondary-foreground" : "bg-accent/20 text-accent-foreground"}`}
									>
										{accord}
									</motion.span>
								))}
							</div>
						</div>
					</CardContent>
				</Link>
			</Card>
		</motion.div>
	);
}

export default PerfumeCard;
