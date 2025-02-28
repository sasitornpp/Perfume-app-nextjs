import React from "react";
import { motion } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TradablePerfume } from "@/types/perfume";
import {
	User,
	Phone,
	Facebook,
	MessageCircle,
	Shield,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

function TabContact({
	containerVariants,
	itemVariants,
	formData,
	handleChange,
	loading,
}: {
	containerVariants: any;
	itemVariants: any;
	formData: TradablePerfume;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	loading: boolean;
}) {
	// Calculate how many contact methods are filled
	const contactMethodsCount = [
		formData.phoneNumber,
		formData.facebook,
		formData.line,
	].filter((method) => method && method.trim() !== "").length;

	// Determine contact info completeness
	const getCompletionStatus = () => {
		if (contactMethodsCount === 0)
			return {
				icon: AlertCircle,
				color: "text-destructive",
				text: "Missing contact info",
			};
		if (contactMethodsCount === 1)
			return {
				icon: CheckCircle2,
				color: "text-amber-500",
				text: "Basic contact info",
			};
		return {
			icon: CheckCircle2,
			color: "text-green-500",
			text: "Complete contact info",
		};
	};

	const status = getCompletionStatus();
	const StatusIcon = status.icon;

	return (
		<TabsContent value="contact" className="m-0 px-4 py-6 md:px-8">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="space-y-6"
			>
				<motion.div variants={itemVariants}>
					<Card className="border border-border/80 bg-card/50 shadow-sm">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold text-primary">
										Contact Information
									</CardTitle>
									<CardDescription className="text-muted-foreground mt-1">
										How would you like potential buyers to
										reach you?
									</CardDescription>
								</div>
								<Shield className="h-5 w-5 text-primary/70" />
							</div>
						</CardHeader>
						<CardContent className="text-sm space-y-2 text-muted-foreground">
							<div className="flex items-center gap-2">
								<StatusIcon
									className={`h-4 w-4 ${status.color}`}
								/>
								<span>{status.text}</span>
							</div>
							<p>
								Your contact information will only be visible to
								logged-in users. We recommend providing at least
								two contact methods.
							</p>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="grid gap-6 md:grid-cols-2"
				>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="userName"
								className="text-sm font-medium flex items-center"
							>
								<User className="h-4 w-4 mr-2 text-primary/70" />
								Display Name
								<span className="text-destructive ml-1">*</span>
							</Label>
							<Badge
								variant="outline"
								className="text-xs font-normal"
							>
								Required
							</Badge>
						</div>
						<Input
							id="userName"
							name="userName"
							value={formData.userName}
							onChange={handleChange}
							placeholder="Your name or nickname"
							className="border-input focus-visible:ring-primary/50"
							required
						/>
						<p className="text-xs text-muted-foreground">
							This will be displayed publicly with your listing
						</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="phoneNumber"
								className="text-sm font-medium flex items-center"
							>
								<Phone className="h-4 w-4 mr-2 text-primary/70" />
								Phone Number
							</Label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant="outline"
											className="text-xs font-normal"
										>
											Recommended
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-xs w-48">
											Most buyers prefer direct contact
											via phone
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Input
							id="phoneNumber"
							name="phoneNumber"
							value={formData.phoneNumber || ""}
							onChange={handleChange}
							placeholder="e.g., 089-123-4567"
							className="border-input focus-visible:ring-primary/50"
						/>
						<p className="text-xs text-muted-foreground">
							Enter a valid phone number where buyers can contact
							you
						</p>
					</div>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="grid gap-6 md:grid-cols-2"
				>
					<div className="space-y-2">
						<Label
							htmlFor="facebook"
							className="text-sm font-medium flex items-center"
						>
							<Facebook className="h-4 w-4 mr-2 text-primary/70" />
							Facebook
						</Label>
						<Input
							id="facebook"
							name="facebook"
							value={formData.facebook || ""}
							onChange={handleChange}
							placeholder="Your Facebook username or profile URL"
							className="border-input focus-visible:ring-primary/50"
						/>
						<p className="text-xs text-muted-foreground">
							Provide your Facebook profile for messaging
						</p>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="line"
							className="text-sm font-medium flex items-center"
						>
							<MessageCircle className="h-4 w-4 mr-2 text-primary/70" />
							Line ID
						</Label>
						<Input
							id="line"
							name="line"
							value={formData.line || ""}
							onChange={handleChange}
							placeholder="Your Line ID"
							className="border-input focus-visible:ring-primary/50"
						/>
						<p className="text-xs text-muted-foreground">
							Line messaging is popular for perfume trades
						</p>
					</div>
				</motion.div>

				<motion.div variants={itemVariants} className="pt-6">
					<div className="flex justify-center">
						<Button
							type="submit"
							className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
							disabled={loading || !formData.userName}
						>
							{loading ? (
								<>
									<motion.div
										initial={{ rotate: 0 }}
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: "linear",
										}}
										className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
									/>
									Creating Listing...
								</>
							) : (
								"Create Perfume Listing"
							)}
						</Button>
					</div>
					<div className="mt-3 text-center text-xs text-muted-foreground">
						By submitting, you agree to our terms and conditions
					</div>
				</motion.div>
			</motion.div>
		</TabsContent>
	);
}

export default TabContact;
