"use client";

import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
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
	Search,
	Info,
	Component,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Filters, FiltersPerfumeValues } from "@/types/perfume";
import { fetchSuggestedPerfumes } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Women from "@/components/icon/women";
import Men from "@/components/icon/male";

// Define birthdate-accord associations
const birthdateAccords = {
	monday: ["fresh"],
	tuesday: ["spicy"],
	wednesday: ["floral"],
	thursday: ["oriental"],
	friday: ["fruity"],
	saturday: ["woody"],
	sunday: ["powdery"],
};

// Define steps for quiz
const steps = [
	{
		component: "welcome",
		title: "Welcome",
		description: "Let's find your perfect fragrance match.",
	},
	{
		component: "gender",
		title: "Gender Preference",
		description:
			"Select the gender category you prefer for your fragrances.",
	},
	{
		component: "situation",
		title: "Wearing Occasion",
		description: "When do you plan to wear this fragrance?",
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
		component: "birthday",
		title: "Birthday",
		description: "Select your birthday to get a fragrance suggestion",
	},
	{
		component: "brand",
		title: "Favorite Brand",
		description: "Do you have a preferred perfume brand?",
	},
];

function PerfumeQuiz() {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	// Get perfume data from Redux store
	const perfumeAccords = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.accords,
	);

	const perfumeTopNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.top_notes,
	);

	const perfumeMiddleNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.middle_notes,
	);

	const perfumeBaseNotes = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.base_notes,
	);

	const perfumeBrands = useSelector(
		(state: RootState) => state.perfumes.perfume_unique_data.brand,
	).map((brand) => brand.name);

	// Quiz state
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<Filters>({
		...FiltersPerfumeValues,
	});

	// Search states
	const [accordSearch, setAccordSearch] = useState("");
	const [topNoteSearch, setTopNoteSearch] = useState("");
	const [middleNoteSearch, setMiddleNoteSearch] = useState("");
	const [baseNoteSearch, setBaseNoteSearch] = useState("");
	const [brandSearch, setBrandSearch] = useState("");

	// Helper state for multi-select management
	const [selectedAccords, setSelectedAccords] = useState<string[]>([]);
	const [activeNotesTab, setActiveNotesTab] = useState("top");

	// Filter and sort data
	const filteredAccords = useMemo(() => {
		return (
			perfumeAccords
				?.filter((accord) =>
					accord.toLowerCase().includes(accordSearch.toLowerCase()),
				)
				.sort((a, b) => a.localeCompare(b))
				.slice(0, 50) || []
		);
	}, [perfumeAccords, accordSearch]);

	const filteredTopNotes = useMemo(() => {
		return (
			perfumeTopNotes
				?.filter((note) =>
					note.toLowerCase().includes(topNoteSearch.toLowerCase()),
				)
				.sort((a, b) => a.localeCompare(b))
				.slice(0, 50) || []
		);
	}, [perfumeTopNotes, topNoteSearch]);

	const filteredMiddleNotes = useMemo(() => {
		return (
			perfumeMiddleNotes
				?.filter((note) =>
					note.toLowerCase().includes(middleNoteSearch.toLowerCase()),
				)
				.sort((a, b) => a.localeCompare(b))
				.slice(0, 50) || []
		);
	}, [perfumeMiddleNotes, middleNoteSearch]);

	const filteredBaseNotes = useMemo(() => {
		return (
			perfumeBaseNotes
				?.filter((note) =>
					note.toLowerCase().includes(baseNoteSearch.toLowerCase()),
				)
				.sort((a, b) => a.localeCompare(b))
				.slice(0, 50) || []
		);
	}, [perfumeBaseNotes, baseNoteSearch]);

	const filteredBrands = useMemo(() => {
		return (
			perfumeBrands
				?.filter((brand) =>
					brand.toLowerCase().includes(brandSearch.toLowerCase()),
				)
				.sort((a, b) => a.localeCompare(b))
				.slice(0, 50) || []
		);
	}, [perfumeBrands, brandSearch]);

	const totalSteps = steps.length;
	const progress = ((currentStep + 1) / totalSteps) * 100;

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
		noteType:
			| "top_notes_filter"
			| "middle_notes_filter"
			| "base_notes_filter",
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

	const handleBrandSelect = (brand: string) => {
		setFormData({ ...formData, brand_filter: brand });
	};

	const clearBrandSelection = () => {
		setFormData({ ...formData, brand_filter: null });
	};

	const handleSituationChange = (value: SituationType) => {
		setFormData({
			...formData,
			accords_filter: situation[value],
		});
	};

	const handleNext = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
			window.scrollTo(0, 0);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
			window.scrollTo(0, 0);
		}
	};

	const handleSubmit = () => {
		dispatch(fetchSuggestedPerfumes({ filters: formData }));
		router.push("/profile?q=recommendations");
	};

	const renderStepContent = () => {
		const step = steps[currentStep];

		switch (step.component) {
			case "welcome":
				return (
					<div className="space-y-6 mt-6 text-center">
						<div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
							<Heart className="h-12 w-12 text-primary" />
						</div>

						<h2 className="text-2xl font-semibold">
							Perfume Recommendation Quiz
						</h2>

						<p className="text-muted-foreground max-w-md mx-auto">
							In just a few simple steps, we'll help you discover
							fragrances perfectly matched to your preferences and
							lifestyle.
						</p>

						<div className="flex justify-center pt-4">
							<Button
								onClick={handleNext}
								size="lg"
								className="px-8"
							>
								Get Started{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				);

			case "gender":
				return (
					<div className="space-y-6 mt-6">
						<div className="grid grid-cols-2 gap-4">
							{["Male", "Female"].map((gender) => (
								<Button
									key={gender}
									variant={
										formData.gender_filter ===
										(gender === "Male"
											? "for men"
											: "for women")
											? "default"
											: "outline"
									}
									className="h-32 flex flex-col items-center justify-center transition-all"
									onClick={() =>
										handleGenderSelect(
											gender === "Male"
												? "for men"
												: "for women",
										)
									}
								>
									<div
										className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center ${
											formData.gender_filter ===
											(gender === "Male"
												? "for men"
												: "for women")
												? "bg-background"
												: "bg-primary/10"
										}`}
									>
										{gender === "Male" ? (
											<Men />
										) : (
											<Women />
										)}
									</div>
									<span className="font-medium">
										{gender}
									</span>
								</Button>
							))}
						</div>
						<Button
							variant={
								!formData.gender_filter ? "default" : "outline"
							}
							className="w-full h-16"
							onClick={() => handleGenderSelect(null)}
						>
							<span>No Preference</span>
						</Button>
					</div>
				);

			case "situation":
				return (
					<div className="space-y-6 mt-6">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{Object.keys(situation).map((key) => (
								<Button
									key={key}
									variant={
										JSON.stringify(
											formData.accords_filter,
										) ===
										JSON.stringify(
											situation[key as SituationType],
										)
											? "default"
											: "outline"
									}
									className="h-32 flex flex-col items-center justify-center gap-2 transition-all"
									onClick={() =>
										handleSituationChange(
											key as SituationType,
										)
									}
								>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											JSON.stringify(
												formData.accords_filter,
											) ===
											JSON.stringify(
												situation[key as SituationType],
											)
												? "bg-background"
												: "bg-primary/10"
										}`}
									>
										{key === "daily" && (
											<Coffee className="h-6 w-6" />
										)}
										{key === "formal" && (
											<Briefcase className="h-6 w-6" />
										)}
										{key === "date" && (
											<Heart className="h-6 w-6" />
										)}
										{key === "party" && (
											<Music className="h-6 w-6" />
										)}
										{key === "exercise" && (
											<Activity className="h-6 w-6" />
										)}
									</div>
									<span className="font-medium">
										{key.charAt(0).toUpperCase() +
											key.slice(1)}
									</span>
								</Button>
							))}
						</div>

						<div className="bg-muted/40 p-4 rounded-lg mt-4">
							<div className="flex items-start gap-3">
								<Info className="h-5 w-5 text-muted-foreground mt-0.5" />
								<p className="text-sm text-muted-foreground">
									Selecting an occasion will automatically
									suggest appropriate fragrance accords. You
									can refine these in the next step.
								</p>
							</div>
						</div>
					</div>
				);

			case "accords":
				return (
					<div className="space-y-4 mt-6">
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search accords..."
								className="pl-10"
								value={accordSearch}
								onChange={(e) =>
									setAccordSearch(e.target.value)
								}
							/>
						</div>

						<div className="text-sm text-muted-foreground my-2 flex justify-between items-center">
							<span>
								Showing {filteredAccords.length} accords
							</span>
							<span>{selectedAccords.length}/5 selected</span>
						</div>

						<div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
							{filteredAccords.map((accord) => (
								<Badge
									key={accord}
									variant={
										selectedAccords.includes(accord)
											? "default"
											: "outline"
									}
									className={`cursor-pointer px-3 py-1.5 text-sm ${
										selectedAccords.length >= 5 &&
										!selectedAccords.includes(accord)
											? "opacity-50"
											: ""
									}`}
									onClick={() => handleAccordToggle(accord)}
								>
									{accord}
								</Badge>
							))}

							{filteredAccords.length === 0 && (
								<div className="w-full text-center py-8 text-muted-foreground">
									No accords found matching your search
								</div>
							)}
						</div>

						{selectedAccords.length > 0 && (
							<div className="bg-primary/5 p-3 rounded-lg mt-2">
								<p className="font-medium text-sm mb-2">
									Selected accords:
								</p>
								<div className="flex flex-wrap gap-2">
									{selectedAccords.map((accord) => (
										<Badge
											key={accord}
											variant="default"
											className="px-2 py-0.5"
										>
											{accord}{" "}
											<span
												className="ml-1 cursor-pointer"
												onClick={() =>
													handleAccordToggle(accord)
												}
											>
												X
											</span>
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				);

			case "notes":
				return (
					<div className="space-y-4 mt-4">
						<Tabs
							value={activeNotesTab}
							onValueChange={setActiveNotesTab}
							className="w-full"
						>
							<TabsList className="w-full grid grid-cols-3">
								<TabsTrigger
									value="top"
									className="flex items-center gap-2"
								>
									<span className="w-2 h-2 rounded-full bg-amber-400"></span>
									Top Notes
								</TabsTrigger>
								<TabsTrigger
									value="middle"
									className="flex items-center gap-2"
								>
									<span className="w-2 h-2 rounded-full bg-emerald-400"></span>
									Heart Notes
								</TabsTrigger>
								<TabsTrigger
									value="base"
									className="flex items-center gap-2"
								>
									<span className="w-2 h-2 rounded-full bg-purple-400"></span>
									Base Notes
								</TabsTrigger>
							</TabsList>

							<TabsContent value="top" className="mt-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<Label className="text-lg font-medium">
												Top Notes
											</Label>
											<p className="text-xs text-muted-foreground">
												First impression (15-30 minutes)
											</p>
										</div>
										<Badge
											variant="outline"
											className="font-normal"
										>
											{formData.top_notes_filter.length}{" "}
											selected
										</Badge>
									</div>

									<div className="relative">
										<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search top notes..."
											className="pl-10"
											value={topNoteSearch}
											onChange={(e) =>
												setTopNoteSearch(e.target.value)
											}
										/>
									</div>

									<div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
										{filteredTopNotes.map((note) => (
											<Badge
												key={note}
												variant={
													formData.top_notes_filter.includes(
														note,
													)
														? "default"
														: "outline"
												}
												className="cursor-pointer px-3 py-1 text-sm"
												onClick={() =>
													handleNoteToggle(
														"top_notes_filter",
														note,
													)
												}
											>
												{note}
											</Badge>
										))}

										{filteredTopNotes.length === 0 && (
											<div className="w-full text-center py-8 text-muted-foreground">
												No top notes found matching your
												search
											</div>
										)}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="middle" className="mt-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<Label className="text-lg font-medium">
												Heart Notes
											</Label>
											<p className="text-xs text-muted-foreground">
												The core (30 min - 2 hrs)
											</p>
										</div>
										<Badge
											variant="outline"
											className="font-normal"
										>
											{
												formData.middle_notes_filter
													.length
											}{" "}
											selected
										</Badge>
									</div>

									<div className="relative">
										<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search middle notes..."
											className="pl-10"
											value={middleNoteSearch}
											onChange={(e) =>
												setMiddleNoteSearch(
													e.target.value,
												)
											}
										/>
									</div>

									<div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
										{filteredMiddleNotes.map((note) => (
											<Badge
												key={note}
												variant={
													formData.middle_notes_filter.includes(
														note,
													)
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

										{filteredMiddleNotes.length === 0 && (
											<div className="w-full text-center py-8 text-muted-foreground">
												No middle notes found matching
												your search
											</div>
										)}
									</div>
								</div>
							</TabsContent>

							<TabsContent value="base" className="mt-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<Label className="text-lg font-medium">
												Base Notes
											</Label>
											<p className="text-xs text-muted-foreground">
												The lasting impression (2 hrs+)
											</p>
										</div>
										<Badge
											variant="outline"
											className="font-normal"
										>
											{formData.base_notes_filter.length}{" "}
											selected
										</Badge>
									</div>

									<div className="relative">
										<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search base notes..."
											className="pl-10"
											value={baseNoteSearch}
											onChange={(e) =>
												setBaseNoteSearch(
													e.target.value,
												)
											}
										/>
									</div>

									<div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
										{filteredBaseNotes.map((note) => (
											<Badge
												key={note}
												variant={
													formData.base_notes_filter.includes(
														note,
													)
														? "default"
														: "outline"
												}
												className="cursor-pointer px-3 py-1 text-sm"
												onClick={() =>
													handleNoteToggle(
														"base_notes_filter",
														note,
													)
												}
											>
												{note}
											</Badge>
										))}

										{filteredBaseNotes.length === 0 && (
											<div className="w-full text-center py-8 text-muted-foreground">
												No base notes found matching
												your search
											</div>
										)}
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<TooltipProvider>
							<div className="bg-muted/40 p-4 rounded-lg mt-4 flex items-start gap-3">
								<Info className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="text-sm text-muted-foreground">
									<p className="mb-1">
										Notes create the fragrance experience:
									</p>
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong className="text-amber-500">
												Top notes
											</strong>{" "}
											are the initial scent (15-30
											minutes)
										</li>
										<li>
											<strong className="text-emerald-500">
												Heart notes
											</strong>{" "}
											emerge as top notes fade
											(30min-2hrs)
										</li>
										<li>
											<strong className="text-purple-500">
												Base notes
											</strong>{" "}
											are the foundation that lasts
											longest (2hrs+)
										</li>
									</ul>
								</div>
							</div>
						</TooltipProvider>
					</div>
				);
			case "birthday":
				return (
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
						{Object.entries(birthdateAccords).map(
							([day, accords]) => (
								<Button
									key={day}
									variant={
										JSON.stringify(
											formData.accords_filter,
										) === JSON.stringify(accords)
											? "default"
											: "outline"
									}
									className="h-auto py-4 flex flex-col items-center justify-center transition-all gap-2"
									onClick={() => {
										setFormData({
											...formData,
											accords_filter: accords,
										});
										setSelectedAccords(accords);
									}}
								>
									<span className="font-medium capitalize text-lg">
										{day}
									</span>
								</Button>
							),
						)}
					</div>
				);

			case "brand":
				return (
					<div className="space-y-4 mt-6">
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search brands..."
								className="pl-10"
								value={brandSearch}
								onChange={(e) => setBrandSearch(e.target.value)}
							/>
						</div>

						{formData.brand_filter && (
							<div className="bg-primary/5 p-3 rounded-lg">
								<div className="flex justify-between items-center">
									<p className="font-medium">
										Selected:{" "}
										<span className="text-primary">
											{formData.brand_filter}
										</span>
									</p>
									<Button
										variant="ghost"
										size="sm"
										onClick={clearBrandSelection}
									>
										Clear
									</Button>
								</div>
							</div>
						)}

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto p-1">
							{filteredBrands.map((brand) => (
								<Button
									key={brand}
									variant={
										formData.brand_filter === brand
											? "default"
											: "outline"
									}
									className="h-16 flex items-center justify-center transition-all text-sm truncate"
									onClick={() => handleBrandSelect(brand)}
								>
									<span>{brand}</span>
								</Button>
							))}

							{filteredBrands.length === 0 && (
								<div className="col-span-3 text-center py-8 text-muted-foreground">
									No brands found matching your search
								</div>
							)}
						</div>

						<Button
							variant={
								!formData.brand_filter ? "default" : "outline"
							}
							className="w-full"
							onClick={clearBrandSelection}
						>
							No Preference
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4 py-10">
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

				<CardFooter className="flex justify-between pt-6">
					<Button
						variant="outline"
						onClick={() =>
							currentStep === 0 ? router.back() : handlePrevious()
						}
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back
					</Button>

					{currentStep < totalSteps - 1 ? (
						<Button onClick={handleNext}>
							{currentStep === 0 ? "Start Quiz" : "Next"}{" "}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button
							onClick={handleSubmit}
							className="bg-gradient-to-r from-primary to-primary/80"
						>
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
