"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Info, Plus, X } from "lucide-react";
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
import { TradablePerfumeForInsert } from "@/types/perfume";
import NoteInput from "../note-input";

function TabNotes({
	containerVariants,
	itemVariants,
	formData,
	setFormData,
}: {
	containerVariants: any;
	itemVariants: any;
	formData: TradablePerfumeForInsert;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	setFormData: React.Dispatch<React.SetStateAction<TradablePerfumeForInsert>>;
}) {
	const NOTE_TYPES = [
		{
			type: "Top",
			field: "top_note",
		},
		{
			type: "Middle",
			field: "middle_note",
		},
		{
			type: "Base",
			field: "base_note",
		},
	] as const;
	const handleArrayChange = (
		type: keyof TradablePerfumeForInsert,
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

	const addArrayItem = (type: keyof TradablePerfumeForInsert) => {
		setFormData((prev) => ({
			...prev,
			[type]: [...(prev[type] as string[]), ""],
		}));
	};

	const removeArrayItem = (
		type: keyof TradablePerfumeForInsert,
		index: number,
	) => {
		const newArray = (formData[type] as string[]).filter(
			(_, i) => i !== index,
		);
		setFormData((prev) => ({
			...prev,
			[type]: newArray,
		}));
	};
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

				{NOTE_TYPES.map((noteConfig) => (
					<NoteInput
						key={noteConfig.field}
						type={noteConfig.type}
						notes={formData[noteConfig.field] || []}
						onAddNote={() => addArrayItem(noteConfig.field)}
						onRemoveNote={(index) =>
							removeArrayItem(noteConfig.field, index)
						}
						onChangeNote={(index, value) =>
							handleArrayChange(noteConfig.field, index, value)
						}
						onNotesChange={(notes) =>
							setFormData((prev) => ({
								...prev,
								[noteConfig.field]: notes,
							}))
						}
					/>
				))}

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
									className="border-input bg-background"
								/>
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
