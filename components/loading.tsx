"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function LoadingComponents({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	const router = useRouter();
	return (
		<div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<Button
					variant="ghost"
					className="mb-4 flex items-center"
					onClick={() => router.back()}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to previous page
				</Button>
				<Card className="w-full shadow-lg border-accent p-8">
					<CardContent className="flex flex-col items-center justify-center p-12 text-center">
						<motion.div
							animate={{
								rotate: 360,
								scale: [1, 1.1, 1],
							}}
							transition={{
								rotate: {
									duration: 1.5,
									repeat: Infinity,
									ease: "linear",
								},
								scale: {
									duration: 1,
									repeat: Infinity,
									ease: "easeInOut",
								},
							}}
							className="mb-6"
						>
							<Loader2 className="h-16 w-16 text-primary" />
						</motion.div>
						<h2 className="text-2xl font-bold mb-2 text-foreground">
							{title}
						</h2>
						<p className="text-muted-foreground mb-6">
							{description}
						</p>

						<div className="w-full space-y-4">
							<motion.div
								className="h-4 w-full bg-accent/50 rounded-full overflow-hidden"
								initial={{ opacity: 0.6 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 0.8,
									repeat: Infinity,
									repeatType: "reverse",
								}}
							>
								<motion.div
									className="h-full bg-primary/30 rounded-full"
									initial={{ width: "10%" }}
									animate={{ width: "100%" }}
									transition={{
										duration: 1.5,
										repeat: Infinity,
									}}
								/>
							</motion.div>

							<div className="grid grid-cols-2 gap-4">
								<motion.div
									className="h-24 rounded-lg bg-accent/30"
									initial={{ opacity: 0.6 }}
									animate={{ opacity: 1 }}
									transition={{
										duration: 0.8,
										repeat: Infinity,
										repeatType: "reverse",
										delay: 0.2,
									}}
								/>
								<motion.div
									className="h-24 rounded-lg bg-accent/30"
									initial={{ opacity: 0.6 }}
									animate={{ opacity: 1 }}
									transition={{
										duration: 0.8,
										repeat: Infinity,
										repeatType: "reverse",
										delay: 0.4,
									}}
								/>
							</div>

							<motion.div
								className="h-12 w-full bg-accent/30 rounded-lg"
								initial={{ opacity: 0.6 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 0.8,
									repeat: Infinity,
									repeatType: "reverse",
									delay: 0.6,
								}}
							/>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}

export default LoadingComponents;
