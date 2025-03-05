"use client";

import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { situation, SituationType } from "@/types/perfume";
import { Progress } from "@/components/ui/progress";
import {
	ArrowRight,
	ArrowLeft,
	Check,
	Heart,
	Coffee,
	Briefcase,
	Music,
	Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Filters, FiltersPerfumeValues } from "@/types/perfume";
import { fetchSuggestedPerfumes } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";

// Define steps for quiz
const steps = [
	{
		component: "gender",
		title: "Gender Preference",
		description:
			"Select the gender category you prefer for your fragrances.",
	},
	{
		component: "accords",
		title: "Preferred Accords",
		description: "Select up to 5 fragrance accords you enjoy.",
	},
	{
		component: "notes",
		title: "Favorite Notes",
		description: "Choose your favorite top, middle and base notes.",
	},
	{
		component: "brand",
		title: "Favorite Brand",
		description: "Do you have a preferred perfume brand?",
	},
	{
		component: "rating",
		title: "Fragrance Intensity",
		description: "How strong do you prefer your fragrance to be?",
	},
	{
		component: "situation",
		title: "Wearing Occasion",
		description: "When do you plan to wear this fragrance?",
	},
];

function PerfumeQuiz() {
    const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	// Quiz state
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<Filters>({
		...FiltersPerfumeValues,
	});

	// Helper state for multi-select management
	const [selectedAccords, setSelectedAccords] = useState<string[]>([]);

	const totalSteps = steps.length;
	const progress = ((currentStep + 1) / totalSteps) * 100;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleGenderSelect = (value: string | null) => {
		setFormData({ ...formData, gender_filter: value });
	};

	const handleAccordToggle = (accord: string) => {
		if (selectedAccords.includes(accord)) {
			// Remove the accord
			const newAccords = selectedAccords.filter(
				(item) => item !== accord,
			);
			setSelectedAccords(newAccords);
			setFormData({ ...formData, accords_filter: newAccords });
		} else {
			// Add the accord (if less than 5 are selected)
			if (selectedAccords.length < 5) {
				const newAccords = [...selectedAccords, accord];
				setSelectedAccords(newAccords);
				setFormData({ ...formData, accords_filter: newAccords });
			}
		}
	};

	const handleNoteToggle = (
		noteType: "top_notes_filter" | "middle_notes_filter" | "base_notes_filter",
		note: string,
	) => {
		const currentNotes = [...formData[noteType]];

		if (currentNotes.includes(note)) {
			// Remove the note
			const updatedNotes = currentNotes.filter((item) => item !== note);
			setFormData({ ...formData, [noteType]: updatedNotes });
		} else {
			// Add the note
			setFormData({ ...formData, [noteType]: [...currentNotes, note] });
		}
	};

	const handleSituationChange = (value: SituationType) => {
		setFormData({
			...formData,
			accords_filter: situation[value],
		});
	};

	const handleSliderChange = (value: number[]) => {
		setFormData({ ...formData, rating_filter: value[0] });
	};

	const handleNext = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		dispatch(fetchSuggestedPerfumes({ filters: formData }));
		router.push("/profile?q=recommendations");
	};

	const renderStepContent = () => {
		const step = steps[currentStep];

		switch (step.component) {
			case "gender":
                return (
                    <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            {["Male", "Female"].map((gender) => (
                                <Button
                                    key={gender}
                                    variant={
                                        formData.gender_filter === (gender === "Male" ? "for men" : "for women")
                                            ? "default"
                                            : "outline"
                                    }
                                    className="h-24 flex items-center justify-center transition-all"
                                    onClick={() =>
                                        handleGenderSelect(gender === "Male" ? "for men" : "for women")
                                    }
                                >
                                    <span>{gender}</span>
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant={!formData.gender_filter ? "default" : "outline"}
                            className="w-full"
                            onClick={() => handleGenderSelect(null)}
                        >
                            No Preference
                        </Button>
                    </div>
                );

			case "accords":
				const popularAccords = [
					"Woody",
					"Amber",
					"Vanilla",
					"Floral",
					"Citrus",
					"Fresh",
					"Powdery",
					"Musky",
					"Sweet",
					"Fruity",
					"Aromatic",
					"Spicy",
					"Leather",
					"Fresh Spicy",
					"Rose",
					"Warm Spicy",
					"Soft Spicy",
				];

				return (
					<div className="space-y-4 mt-6">
						<div className="flex flex-wrap gap-2">
							{popularAccords.map((accord) => (
								<Badge
									key={accord}
									variant={
										selectedAccords.includes(accord)
											? "default"
											: "outline"
									}
									className="cursor-pointer px-3 py-1 text-sm"
									onClick={() => handleAccordToggle(accord)}
								>
									{accord}
								</Badge>
							))}
						</div>
						<div className="text-sm text-muted-foreground mt-2">
							{selectedAccords.length}/5 accords selected
						</div>
					</div>
				);

			case "notes":
				const topNotes = [
					"Bergamot",
					"Lemon",
					"Lavender",
					"Orange",
					"Mint",
				];
				const middleNotes = [
					"Rose",
					"Jasmine",
					"Geranium",
					"Ylang-Ylang",
					"Violet",
				];
				const baseNotes = [
					"Vanilla",
					"Musk",
					"Sandalwood",
					"Amber",
					"Patchouli",
				];

				return (
					<div className="space-y-6 mt-4">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-lg font-medium">
									Top Notes
								</Label>
								<div className="text-sm text-muted-foreground">
									First impression (15-30 minutes)
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{topNotes.map((note) => (
									<Badge
										key={note}
										variant={
											formData.top_notes_filter.includes(note)
												? "default"
												: "outline"
										}
										className="cursor-pointer px-3 py-1 text-sm"
										onClick={() =>
											handleNoteToggle("top_notes_filter", note)
										}
									>
										{note}
									</Badge>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-lg font-medium">
									Heart Notes
								</Label>
								<div className="text-sm text-muted-foreground">
									The core (30min-2hrs)
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{middleNotes.map((note) => (
									<Badge
										key={note}
										variant={
											formData.middle_notes_filter.includes(note)
												? "default"
												: "outline"
										}
										className="cursor-pointer px-3 py-1 text-sm"
										onClick={() =>
											handleNoteToggle(
												"middle_notes_filter",
												note,
											)
										}
									>
										{note}
									</Badge>
								))}
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-lg font-medium">
									Base Notes
								</Label>
								<div className="text-sm text-muted-foreground">
									The lasting impression (2hrs+)
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{baseNotes.map((note) => (
									<Badge
										key={note}
										variant={
											formData.base_notes_filter.includes(note)
												? "default"
												: "outline"
										}
										className="cursor-pointer px-3 py-1 text-sm"
										onClick={() =>
											handleNoteToggle("base_notes_filter", note)
										}
									>
										{note}
									</Badge>
								))}
							</div>
						</div>
					</div>
				);

			case "brand":
				const popularBrands = [
					"Chanel",
					"Dior",
					"Tom Ford",
					"YSL",
					"Gucci",
					"Armani",
				];

				return (
					<div className="space-y-4 mt-6">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{popularBrands.map((brand) => (
								<Button
									key={brand}
									variant={
										formData.brand_filter === brand.toLowerCase()
											? "default"
											: "outline"
									}
									className="h-24 flex items-center justify-center transition-all"
									onClick={() =>
										handleSelectChange(
											"brand_filter",
											brand.toLowerCase(),
										)
									}
								>
									<span>{brand}</span>
								</Button>
							))}
						</div>
						<Button
							variant={
								!popularBrands
									.map((b) => b.toLowerCase())
									.includes(formData.brand_filter || "")
									? "default"
									: "outline"
							}
							className="w-full"
							onClick={() =>
								setFormData({ ...formData, brand_filter: null })
							}
						>
							No Preference
						</Button>
					</div>
				);

			case "rating":
				return (
					<div className="space-y-8 mt-10">
						<div className="space-y-4">
							<div className="flex justify-center">
								<div className="text-2xl font-medium">
									{formData.rating_filter}
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-sm text-muted-foreground">
									Subtle
								</div>
								<Slider
									defaultValue={[formData.rating_filter || 0]}
									max={5}
									min={0}
									step={0.01}
									className="flex-1"
									onValueChange={handleSliderChange}
								/>
								<div className="text-sm text-muted-foreground">
									Bold
								</div>
							</div>
							<div className="text-center text-sm text-muted-foreground mt-2">
								{formData.rating_filter === 0
									? "No preference for intensity"
									: `Fragrances with intensity around ${formData.rating_filter}/5`}
							</div>
						</div>
					</div>
				);

			case "situation":
				return (
					<div className="grid grid-cols-3 gap-4 mt-6">
						{Object.keys(situation).map((key) => (
							<Button
								key={key}
								variant={
									JSON.stringify(formData.accords_filter) ===
									JSON.stringify(
										situation[key as SituationType],
									)
										? "default"
										: "outline"
								}
								className="h-32 flex flex-col items-center justify-center gap-2 transition-all"
								onClick={() =>
									handleSituationChange(key as SituationType)
								}
							>
								{key === "daily" && (
									<Coffee className="h-8 w-8" />
								)}
								{key === "formal" && (
									<Briefcase className="h-8 w-8" />
								)}
								{key === "date" && (
									<Heart className="h-8 w-8" />
								)}
								{key === "party" && (
									<Music className="h-8 w-8" />
								)}
								{key === "exercise" && (
									<Activity className="h-8 w-8" />
								)}
								<span className="text-sm">
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</span>
							</Button>
						))}
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Find Your Signature Scent
					</CardTitle>
					<CardDescription>
						{currentStep + 1} of {totalSteps}:{" "}
						{steps[currentStep].title}
					</CardDescription>
					<Progress value={progress} className="h-2 mt-2" />
				</CardHeader>

				<CardContent>
					<p className="text-center text-muted-foreground mb-4">
						{steps[currentStep].description}
					</p>
					{renderStepContent()}
				</CardContent>

				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={() =>
							currentStep === 0 ? router.back() : handlePrevious()
						}
						disabled={false}
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Button>

					{currentStep < totalSteps - 1 ? (
						<Button onClick={handleNext}>
							Next <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button onClick={handleSubmit}>
							Find My Fragrances{" "}
							<Check className="ml-2 h-4 w-4" />
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}

export default PerfumeQuiz;
