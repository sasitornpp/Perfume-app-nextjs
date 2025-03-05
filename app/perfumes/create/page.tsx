"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/form/trade-form/progress-circle";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	PerfumeForInsert,
	PerfumeInitialState,
} from "@/types/perfume";
import { addPerfume } from "@/redux/perfume/perfumeReducer";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import TabContact from "@/components/form/trade-form/tab-content/contact";
import TabNotes from "@/components/form/trade-form/tab-content/notes";
import TabDetails from "@/components/form/trade-form/tab-content/details";
import TabImage from "@/components/form/trade-form/tab-content/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
function Trade() {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [progress, setProgress] = useState(0);

	const profile = useSelector((state: RootState) => state.user.profile);

	const [formData, setFormData] = useState<PerfumeForInsert>(
		PerfumeInitialState,
	);

	useEffect(() => {
		// Calculate form completion progress
		const requiredFields = [
			"name",
			"descriptions",
			"price",
			"volume",
			"gender",
		];
		const filledRequired = requiredFields.filter(
			(field) =>
				formData[field as keyof PerfumeForInsert] &&
				formData[field as keyof PerfumeForInsert] !== 0,
		).length;

		// Additional fields that add to completion percentage
		const bonusFields = [
			"brand",
			"concentration",
			"scentType",
			"perfumer",
			"facebook",
			"line",
			"phoneNumber",
		];
		const filledBonus = bonusFields.filter(
			(field) =>
				formData[field as keyof PerfumeForInsert] &&
				formData[field as keyof PerfumeForInsert] !== "",
		).length;

		// Notes fields
		const hasTopNotes =
			formData.top_notes?.some((note) => note !== "") || false;
		const hasMiddleNotes = formData.middle_notes?.some(
			(note) => note !== "",
		);
		const hasBaseNotes = formData.base_notes?.some((note) => note !== "");
		const notesCount = [hasTopNotes, hasMiddleNotes, hasBaseNotes].filter(
			Boolean,
		).length;

		// Images
		const hasImages = formData.images.length > 0;

		// Calculate total progress (required fields are worth more)
		const totalProgress =
			(filledRequired / requiredFields.length) * 60 +
			(filledBonus / bonusFields.length) * 20 +
			(notesCount / 3) * 10 +
			(hasImages ? 10 : 0);

		setProgress(Math.min(Math.round(totalProgress), 100));
	}, [formData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!profile) {
				throw new Error("User profile is required");
			}
			dispatch(
				addPerfume({
					perfumeData: formData,
					userProfile: profile,
				}),
			);
			// console.log(formData)
			// console.log("Listing created successfully ");
			router.push("/perfumes/trade");
		} catch (error) {
			console.error("Error creating listing:", error);
		} finally {
			setLoading(false);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring", stiffness: 300, damping: 24 },
		},
	};

	const nextTab = (e: React.MouseEvent) => {
		e.preventDefault();
		if (activeTab === "details") setActiveTab("notes");
		else if (activeTab === "notes") setActiveTab("images");
		else if (activeTab === "images") setActiveTab("contact");
	};

	const previousTab = (e: React.MouseEvent) => {
		e.preventDefault();
		if (activeTab === "contact") setActiveTab("images");
		else if (activeTab === "images") setActiveTab("notes");
		else if (activeTab === "notes") setActiveTab("details");
	};

	return (
		<div className="py-8 px-4 min-h-full bg-background/50 mt-20">
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="max-w-4xl mx-auto"
			>
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						List Your Perfume for Trade
					</h1>
					<p className="text-muted-foreground">
						Share your fragrance with enthusiasts in our community
					</p>
				</div>

				<Card className="border border-border shadow-lg overflow-hidden rounded-lg">
					<CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
						<div className="flex justify-between items-center">
							<div>
								<CardTitle className="text-xl text-primary">
									Create New Perfume Listing
								</CardTitle>
								<CardDescription>
									{activeTab === "details" &&
										"Start with the basic details of your perfume"}
									{activeTab === "notes" &&
										"Describe the fragrance profile"}
									{activeTab === "images" &&
										"Add appealing images of your perfume"}
									{activeTab === "contact" &&
										"Share your contact information for interested buyers"}
								</CardDescription>
							</div>
							<ProgressCircle progress={progress} />
						</div>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="p-0">
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="w-full grid grid-cols-4 rounded-none bg-muted/30">
									{[
										"details",
										"notes",
										"images",
										"contact",
									].map((tab) => (
										<TabsTrigger
											key={tab}
											value={tab}
											className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
										>
											{tab.charAt(0).toUpperCase() +
												tab.slice(1)}
										</TabsTrigger>
									))}
								</TabsList>

								{/* Map components to their respective tabs */}
								{[
									{ tab: "details", Component: TabDetails },
									{ tab: "notes", Component: TabNotes },
									{ tab: "images", Component: TabImage },
									{ tab: "contact", Component: TabContact },
								].map(
									({ tab, Component }) =>
										activeTab === tab && (
											<Component
												key={tab}
												containerVariants={
													containerVariants
												}
												itemVariants={itemVariants}
												formData={formData}
												setFormData={setFormData}
												handleChange={handleChange}
												loading={
													tab === "contact"
														? loading
														: false
												}
											/>
										),
								)}
							</Tabs>
						</CardContent>

						<div className="p-4 border-t border-border/40 bg-muted/10 flex justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={previousTab}
								disabled={activeTab === "details"}
								className="w-24"
							>
								Previous
							</Button>
							{activeTab !== "contact" ? (
								<Button
									type="button"
									variant="default"
									onClick={nextTab}
									className="w-24 bg-primary/90 hover:bg-primary"
								>
									Next
								</Button>
							) : (
								<Button
									type="submit"
									className="w-24 bg-primary hover:bg-primary/90"
									disabled={loading}
								>
									{loading ? "Creating..." : "Submit"}
								</Button>
							)}
						</div>
					</form>
				</Card>
			</motion.div>
		</div>
	);
}

export default Trade;
