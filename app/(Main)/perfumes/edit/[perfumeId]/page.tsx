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
import { PerfumeForUpdate } from "@/types/perfume";
import { editPerfume } from "@/redux/user/userReducer";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import TabContact from "@/components/form/trade-form/tab-content/contact";
import TabNotes from "@/components/form/trade-form/tab-content/notes";
import TabDetails from "@/components/form/trade-form/tab-content/details";
import TabImage from "@/components/form/trade-form/tab-content/image";
import { supabaseClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

function Trade({ params }: { params: Promise<{ perfumeId: string }> }) {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const unwrappedParams = React.use(params); // Unwrap params using React.use

	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [progress, setProgress] = useState(0);
	const [perfume, setPerfume] = useState<PerfumeForUpdate | null>(null);

	const profile = useSelector((state: RootState) => state.user.profile);

	// Fetch perfume data only when perfumeId changes
	useEffect(() => {
		if (!unwrappedParams) return;

		const perfumeId = unwrappedParams.perfumeId;
		if (!perfumeId) return; // Prevent fetch if no ID

		const fetchPerfume = async () => {
			try {
				const { data, error } = await supabaseClient
					.from("perfumes")
					.select("*")
					.eq("id", perfumeId)
					.single();

				if (error) {
					console.error("Error fetching perfume:", error);
					setPerfume(null); // Reset perfume state on error
				} else {
					setPerfume(data);
				}
			} catch (err) {
				console.error("Unexpected error fetching perfume:", err);
				setPerfume(null);
			}
		};

		fetchPerfume();
	}, [unwrappedParams?.perfumeId]); // Dependency on perfumeId only

	// Calculate progress when perfume data changes
	useEffect(() => {
		if (!perfume) return;

		const requiredFields = [
			"name",
			"descriptions",
			"price",
			"volume",
			"gender",
		];
		const filledRequired = requiredFields.filter(
			(field) =>
				perfume[field as keyof PerfumeForUpdate] &&
				perfume[field as keyof PerfumeForUpdate] !== 0,
		).length;

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
				perfume[field as keyof PerfumeForUpdate] &&
				perfume[field as keyof PerfumeForUpdate] !== "",
		).length;

		const hasTopNotes =
			perfume.top_notes?.some((note) => note !== "") || false;
		const hasMiddleNotes = perfume.middle_notes?.some(
			(note) => note !== "",
		);
		const hasBaseNotes = perfume.base_notes?.some((note) => note !== "");
		const notesCount = [hasTopNotes, hasMiddleNotes, hasBaseNotes].filter(
			Boolean,
		).length;

		const hasImages =
			Array.isArray(perfume.images) && perfume.images.length > 0;

		const totalProgress =
			(filledRequired / requiredFields.length) * 60 +
			(filledBonus / bonusFields.length) * 20 +
			(notesCount / 3) * 10 +
			(hasImages ? 10 : 0);

		setProgress(Math.min(Math.round(totalProgress), 100));
	}, [perfume]);

	if (perfume === null || !profile || perfume.user_id !== profile.id) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-2xl font-bold text-foreground">
					Perfume not found
				</h1>
			</div>
		);
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setPerfume((prev) =>
			prev ? ({ ...prev, [name]: value } as PerfumeForUpdate) : null,
		);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!profile || !perfume) {
				throw new Error("User profile or perfume data is missing");
			}
			dispatch(editPerfume({ formData: perfume }));
			router.push("/profile?q=my-perfumes");
		} catch (error) {
			console.error("Error creating listing:", error);
		} finally {
			setLoading(false);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
												formData={perfume}
												setFormData={(value: any) => {
													if (
														typeof value ===
														"function"
													) {
														setPerfume((prev) =>
															value(prev),
														);
													} else {
														setPerfume(value);
													}
												}}
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
