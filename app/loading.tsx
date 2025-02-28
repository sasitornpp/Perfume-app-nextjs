"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function Loading({ children }: { readonly children: React.ReactNode }) {
	const perfumesLoading = useSelector(
		(state: RootState) => state.perfumes.loading,
	);
	const userLoading = useSelector((state: RootState) => state.user.loading);

	const isLoading = perfumesLoading || userLoading;

	if (isLoading) {
		return (
			<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex justify-center items-center z-50">
				<div className="bg-card p-8 rounded-lg shadow-lg border border-border max-w-md w-full">
					<div className="flex flex-col items-center space-y-6">
						{/* Logo animation */}
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="relative"
						>
							<motion.div
								className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
								animate={{ scale: [1, 1.05, 1] }}
								transition={{ repeat: Infinity, duration: 2 }}
							>
								<motion.div
									className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center"
									animate={{ scale: [1, 1.1, 1] }}
									transition={{
										repeat: Infinity,
										duration: 1.5,
										delay: 0.2,
									}}
								>
									<motion.div
										className="w-8 h-8 rounded-full bg-primary/50"
										animate={{ scale: [1, 1.15, 1] }}
										transition={{
											repeat: Infinity,
											duration: 1,
											delay: 0.4,
										}}
									/>
								</motion.div>
							</motion.div>

							{/* Orbiting perfume bottles */}
							<motion.div
								className="absolute top-0 left-0 w-full h-full"
								animate={{ rotate: 360 }}
								transition={{
									duration: 8,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								<motion.div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-secondary rounded-sm" />
							</motion.div>

							<motion.div
								className="absolute top-0 left-0 w-full h-full"
								animate={{ rotate: -360 }}
								transition={{
									duration: 12,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								<motion.div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-8 bg-accent rounded-full" />
							</motion.div>
						</motion.div>

						{/* Text and loader */}
						<div className="space-y-4 text-center">
							<motion.h3
								className="text-xl font-semibold"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								{perfumesLoading
									? "Loading perfumes..."
									: userLoading
										? "Loading user data..."
										: "Loading..."}
							</motion.h3>

							<motion.div
								className="flex items-center justify-center space-x-2"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
							>
								<Loader2 className="h-5 w-5 animate-spin text-primary" />
								<span className="text-muted-foreground text-sm">
									Please wait a moment
								</span>
							</motion.div>
						</div>

						{/* Progress bar */}
						<motion.div
							className="w-full h-1 bg-muted rounded-full overflow-hidden"
							initial={{ opacity: 0, width: "50%" }}
							animate={{ opacity: 1, width: "100%" }}
							transition={{ delay: 0.7 }}
						>
							<motion.div
								className="h-full bg-primary"
								initial={{ width: "0%" }}
								animate={{ width: "100%" }}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</motion.div>
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

export default Loading;
