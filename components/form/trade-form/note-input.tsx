import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Info, Search, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NoteInputProps {
	type: string;
	notes: string[];
	suggestions?: string[]; // Available notes for autocomplete
	onAddNote: () => void;
	onNotesChange: (notes: string[]) => void;
	onRemoveNote: (index: number) => void;
	onChangeNote: (index: number, value: string) => void;
}

const itemVariants = {
	initial: { opacity: 0, y: -10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
};

export default function NoteInput({
	type,
	notes,
	suggestions = [],
	onAddNote,
	onRemoveNote,
	onChangeNote,
	onNotesChange,
}: NoteInputProps) {
	const [searchValue, setSearchValue] = useState("");
	const [isPopoverOpen, setIsPopoverOpen] = useState<{
		[key: number]: boolean;
	}>({});
	const [visibleSuggestionsCount, setVisibleSuggestionsCount] = useState(20);

	// Filter suggestions based on search input
	const filteredSuggestions = searchValue
		? suggestions.filter((s) =>
				s.toLowerCase().includes(searchValue.toLowerCase()),
			)
		: suggestions;

	const handleSuggestionSelect = (index: number, value: string) => {
		onChangeNote(index, value);
		setIsPopoverOpen({ ...isPopoverOpen, [index]: false });
		setSearchValue("");
		// Reset the visible count when a selection is made
		setVisibleSuggestionsCount(20);
	};

	const togglePopover = (index: number, value: boolean) => {
		setIsPopoverOpen({ ...isPopoverOpen, [index]: value });
		if (value) {
			setSearchValue(notes[index] || "");
			// Reset the visible count when popover opens
			setVisibleSuggestionsCount(20);
		}
	};

	const handleShowMoreSuggestions = () => {
		setVisibleSuggestionsCount((prev) => prev + 20);
	};

	return (
		<motion.div
			variants={itemVariants}
			className="p-4 bg-muted/30 rounded-lg"
		>
			<div className="mb-2 flex justify-between items-center">
				<Label className="text-sm font-medium flex items-center">
					<Badge variant="outline" className="mr-2 bg-muted/50">
						{type} Notes
					</Badge>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="h-4 w-4 text-muted-foreground" />
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{type === "Top"
										? "The initial scents you smell when first applying the perfume"
										: type === "Middle"
											? "The heart of the fragrance that emerges after the top notes fade"
											: "The foundation notes that last the longest on your skin"}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Label>
			</div>
			<AnimatePresence>
				{notes.map((note, index) => (
					<motion.div
						key={`${type}-${index}`}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="flex items-center space-x-2 mb-2"
					>
						<Popover
							open={isPopoverOpen[index] || false}
							onOpenChange={(open) => togglePopover(index, open)}
						>
							<div className="relative flex-1">
								<PopoverTrigger asChild>
									<div className="relative w-full">
										<Input
											value={note}
											onChange={(e) =>
												onChangeNote(
													index,
													e.target.value,
												)
											}
											placeholder={`e.g., ${type === "Top" ? "Bergamot, Lemon, Lavender" : type === "Middle" ? "Rose, Jasmine, Cinnamon" : "Vanilla, Musk, Sandalwood"}`}
											className="w-full border-input bg-background pr-8"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() =>
												togglePopover(index, true)
											}
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
											placeholder={`Search ${type.toLowerCase()} notes...`}
											value={searchValue}
											onValueChange={setSearchValue}
											className="h-9 border-none focus:ring-0"
											autoFocus
										/>
										<CommandList>
											<CommandEmpty className="py-3 px-4 text-sm">
												<span className="text-muted-foreground">
													No matching{" "}
													{type.toLowerCase()} notes
													found
												</span>
											</CommandEmpty>

											<CommandGroup
												heading={`${type} notes`}
											>
												{filteredSuggestions.length >
													0 && (
													<ScrollArea className="h-64 rounded-md">
														{filteredSuggestions
															.slice(
																0,
																visibleSuggestionsCount,
															)
															.map(
																(
																	suggestion,
																) => (
																	<CommandItem
																		key={
																			suggestion
																		}
																		onSelect={() =>
																			handleSuggestionSelect(
																				index,
																				suggestion,
																			)
																		}
																		className="cursor-pointer"
																	>
																		{
																			suggestion
																		}
																	</CommandItem>
																),
															)}
													</ScrollArea>
												)}

												{filteredSuggestions.length >
													visibleSuggestionsCount && (
													<div className="p-2 flex justify-center border-t">
														<Button
															variant="ghost"
															size="sm"
															onClick={
																handleShowMoreSuggestions
															}
															className="w-full text-sm text-primary hover:text-primary/80"
														>
															Show more notes (
															{filteredSuggestions.length -
																visibleSuggestionsCount}{" "}
															remaining)
															<ChevronDown className="ml-2 h-4 w-4" />
														</Button>
													</div>
												)}
											</CommandGroup>

											{searchValue &&
												!filteredSuggestions.includes(
													searchValue,
												) && (
													<>
														<CommandSeparator />
														<CommandGroup>
															<CommandItem
																onSelect={() =>
																	handleSuggestionSelect(
																		index,
																		searchValue,
																	)
																}
																className="cursor-pointer text-primary"
															>
																<Plus className="mr-2 h-4 w-4" />
																Add "
																{searchValue}"
															</CommandItem>
														</CommandGroup>
													</>
												)}
										</CommandList>
									</Command>
								</PopoverContent>
							</div>
						</Popover>

						{notes.length > 1 && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onRemoveNote(index)}
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
				onClick={onAddNote}
				className="mt-1 text-primary hover:text-primary/90 hover:bg-primary/10"
			>
				<Plus className="mr-1 h-3 w-3" /> Add {type} Note
			</Button>
		</motion.div>
	);
}
