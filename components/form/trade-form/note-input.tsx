import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface NoteInputProps {
	type: string;
	notes: string[];
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
	onAddNote,
	onRemoveNote,
	onChangeNote,
}: NoteInputProps) {
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
									The initial scents you smell when first
									applying the perfume
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
						<Input
							value={note}
							onChange={(e) =>
								onChangeNote(index, e.target.value)
							}
							placeholder={`e.g., ${type === "Top" ? "Bergamot, Lemon, Lavender" : type === "Middle" ? "Rose, Jasmine, Cinnamon" : "Vanilla, Musk, Sandalwood"}`}
							className="border-input bg-background"
						/>
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
