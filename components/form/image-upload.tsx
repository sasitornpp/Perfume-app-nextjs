import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImagePlus } from "lucide-react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

interface ImageUploadProps {
	onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
	return (
		<motion.div
			variants={itemVariants}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<Label
				htmlFor="image-upload"
				className="flex flex-col items-center justify-center aspect-square 
          border-2 border-dashed border-primary/30 rounded-lg cursor-pointer 
          bg-muted/30 hover:bg-muted/50 transition-colors"
			>
				<div className="flex flex-col items-center justify-center p-4">
					<ImagePlus className="h-8 w-8 text-primary/70 mb-2" />
					<span className="text-sm text-muted-foreground text-center">
						Click to upload
					</span>
					<span className="text-xs text-muted-foreground/70 text-center mt-1">
						PNG, JPG or WEBP
					</span>
				</div>
				<Input
					id="image-upload"
					type="file"
					multiple
					accept="image/*"
					className="hidden"
					onChange={onImageUpload}
				/>
			</Label>
		</motion.div>
	);
}
