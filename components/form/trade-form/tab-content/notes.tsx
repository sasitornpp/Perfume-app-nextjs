"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Info, Plus, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import { PerfumeForInsert, PerfumeForUpdate  } from "@/types/perfume";
import NoteInput from "../note-input";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

function TabNotes({
	containerVariants,
	itemVariants,
	formData,
	setFormData,
}: {
	containerVariants: any;
	itemVariants: any;
	formData: PerfumeForInsert | PerfumeForUpdate ;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	setFormData: React.Dispatch<React.SetStateAction<PerfumeForInsert | PerfumeForUpdate>>;
}) {
	const NOTE_TYPES = [
		{
			type: "Top",
			field: "top_notes",
		},
		{
			type: "Middle",
			field: "middle_notes",
		},
		{
			type: "Base",
			field: "base_notes",
		},
	] as const;
	const handleArrayChange = (
		type: keyof PerfumeForInsert,
		index: number,
		value: string,
	) => {
		const newArray = [...(formData[type] as string[])];
		newArray[index] = value;
		setFormData((prev) => ({
			...prev,
			[type]: newArray,
		}));
	};

	const addArrayItem = (type: keyof PerfumeForInsert) => {
		setFormData((prev) => ({
			...prev,
			[type]: [...(prev[type] as string[]), ""],
		}));
	};

	const removeArrayItem = (type: keyof PerfumeForInsert, index: number) => {
		const newArray = (formData[type] as string[]).filter(
			(_, i) => i !== index,
		);
		setFormData((prev) => ({
			...prev,
			[type]: newArray,
		}));
	};

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

	return (
		<TabsContent value="notes" className="m-0 p-6">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="space-y-8"
			>
				<div className="flex items-center justify-center gap-2 mb-6">
					<Droplets className="h-5 w-5 text-primary" />
					<h3 className="text-lg font-medium">Fragrance Pyramid</h3>
				</div>

				<NoteInput
					key="top_notes"
					type="Top"
					notes={formData.top_notes || []}
					suggestions={perfumeTopNotes}
					onAddNote={() => addArrayItem("top_notes")}
					onRemoveNote={(index) =>
						removeArrayItem("top_notes", index)
					}
					onChangeNote={(index, value) =>
						handleArrayChange("top_notes", index, value)
					}
					onNotesChange={(notes) =>
						setFormData((prev) => ({
							...prev,
							top_notes: notes,
						}))
					}
				/>

				<NoteInput
					key="middle_notes"
					type="Middle"
					notes={formData.middle_notes || []}
					suggestions={perfumeMiddleNotes}
					onAddNote={() => addArrayItem("middle_notes")}
					onRemoveNote={(index) =>
						removeArrayItem("middle_notes", index)
					}
					onChangeNote={(index, value) =>
						handleArrayChange("middle_notes", index, value)
					}
					onNotesChange={(notes) =>
						setFormData((prev) => ({
							...prev,
							middle_notes: notes,
						}))
					}
				/>

				<NoteInput
					key="base_notes"
					type="Base"
					notes={formData.base_notes || []}
					suggestions={perfumeBaseNotes}
					onAddNote={() => addArrayItem("base_notes")}
					onRemoveNote={(index) =>
						removeArrayItem("base_notes", index)
					}
					onChangeNote={(index, value) =>
						handleArrayChange("base_notes", index, value)
					}
					onNotesChange={(notes) =>
						setFormData((prev) => ({
							...prev,
							base_notes: notes,
						}))
					}
				/>

				<motion.div
					variants={itemVariants}
					className="p-4 bg-muted/30 rounded-lg"
				>
					<div className="mb-2 flex justify-between items-center">
						<Label className="text-sm font-medium flex items-center">
							<Badge
								variant="outline"
								className="mr-2 bg-muted/50"
							>
								Accords
							</Badge>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p>
											The overall impression or character
											of the fragrance
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Label>
					</div>

					{/* Update Accords Section to use the same autocomplete approach */}
					<AnimatePresence>
						{formData.accords?.map((accord, index) => (
							<motion.div
								key={`accord-${index}`}
								initial={{
									opacity: 0,
									y: -10,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								exit={{
									opacity: 0,
									height: 0,
								}}
								transition={{
									duration: 0.2,
								}}
								className="flex items-center space-x-2 mb-2"
							>
								<Popover>
									<div className="relative flex-1">
										<PopoverTrigger asChild>
											<div className="relative w-full">
												<Input
													value={accord}
													onChange={(e) =>
														handleArrayChange(
															"accords",
															index,
															e.target.value,
														)
													}
													placeholder="e.g., Woody, Citrus, Powdery"
													className="border-input bg-background pr-8"
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-1 top-1 h-6 w-6 p-0 text-muted-foreground"
												>
													<Search className="h-4 w-4" />
												</Button>
											</div>
										</PopoverTrigger>
										<PopoverContent
											className="w-full p-0"
											align="start"
										>
											<Command>
												<CommandInput
													placeholder="Search accords..."
													className="h-9"
												/>
												<CommandList>
													{perfumeAccords
														.slice(0, 20)
														.map((accord) => (
															<CommandItem
																key={accord}
																onSelect={() =>
																	handleArrayChange(
																		"accords",
																		index,
																		accord,
																	)
																}
																className="cursor-pointer"
															>
																{accord}
															</CommandItem>
														))}
												</CommandList>
											</Command>
										</PopoverContent>
									</div>
								</Popover>

								{(formData.accords || []).length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() =>
											removeArrayItem("accords", index)
										}
										className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</motion.div>
						))}
					</AnimatePresence>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => addArrayItem("accords")}
						className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
					>
						<Plus className="mr-1 h-3 w-3" /> Add Accord
					</Button>
				</motion.div>
			</motion.div>
		</TabsContent>
	);
}

export default TabNotes;
