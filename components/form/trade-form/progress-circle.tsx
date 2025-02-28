import { motion } from "framer-motion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProgressCircleProps {
	progress: number;
}

export function ProgressCircle({ progress }: ProgressCircleProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="relative h-12 w-12">
						<svg className="h-12 w-12 transform -rotate-90">
							<motion.circle
								initial={{ strokeDashoffset: 100 }}
								animate={{ strokeDashoffset: 100 - progress }}
								transition={{ duration: 0.5 }}
								cx="24"
								cy="24"
								r="20"
								fill="transparent"
								stroke="hsl(var(--primary))"
								strokeWidth="4"
								strokeDasharray="100"
								strokeDashoffset="0"
								strokeLinecap="round"
							/>
							<circle
								cx="24"
								cy="24"
								r="20"
								fill="transparent"
								stroke="hsl(var(--muted))"
								strokeWidth="4"
							/>
						</svg>
						<span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
							{progress}%
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>Form completion progress</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
