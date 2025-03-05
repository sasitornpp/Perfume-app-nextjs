"use client";

import React, {
	useState,
	useRef,
	useEffect,
	ChangeEvent,
	FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Camera, UserCircle2, UserCheck, X } from "lucide-react";
import { AppDispatch } from "@/redux/Store";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createProfile } from "@/redux/user/userReducer";

function UserProfileForm() {
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector((state: RootState) => state.user.user);

	const [formData, setFormData] = useState({
		username: "",
		bio: "",
		gender: "",
		image: null as File | null,
		userId: "",
	});
	const [completionPercentage, setCompletionPercentage] = useState(0);
	const [activeField, setActiveField] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (user) {
			setFormData((prev) => ({ ...prev, userId: user.id }));
		}
	}, [user]);

	useEffect(() => {
		// Calculate form completion percentage
		let completed = 0;
		if (formData.username) completed++;
		if (formData.bio) completed++;
		if (formData.gender) completed++;
		if (formData.image) completed++;

		setCompletionPercentage(Math.round((completed / 4) * 100));
	}, [formData]);

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFocus = (name: string) => {
		setActiveField(name);
	};

	const handleBlur = () => {
		setActiveField(null);
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData({ ...formData, image: file });
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setImagePreview(null);
		setFormData({ ...formData, image: null });
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await dispatch(
				createProfile({
					name: formData.username,
					bio: formData.bio,
					gender: formData.gender,
					imgFiles: formData.image,
				}),
			).unwrap();

			setSuccess(true);
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (error) {
			console.error("Error creating profile:", error);
			setIsSubmitting(false);
		}
	};

	const fieldVariants = {
		active: { scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
		inactive: { scale: 1, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)" },
	};

	if (!user) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<div className="mb-4">
						<UserCircle2 className="mx-auto h-16 w-16 text-muted-foreground animate-pulse" />
					</div>
					<p className="text-muted-foreground">
						Loading your profile...
					</p>
				</motion.div>
			</div>
		);
	}

	return (
		<AnimatePresence>
			{success ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					className="flex h-full items-center justify-center p-6"
				>
					<Card className="w-full max-w-md text-center">
						<CardHeader>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									delay: 0.2,
									type: "spring",
									stiffness: 200,
								}}
								className="mx-auto rounded-full bg-primary/10 p-4 mb-2"
							>
								<UserCheck className="h-12 w-12 text-primary" />
							</motion.div>
							<CardTitle>Profile Updated!</CardTitle>
							<CardDescription>
								Your profile has been successfully updated.
							</CardDescription>
						</CardHeader>
					</Card>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-2xl mx-auto p-6"
				>
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">
								Create Your Profile
							</CardTitle>
							<CardDescription>
								Let others know who you are
							</CardDescription>
							<div className="mt-4">
								<div className="flex justify-between text-xs mb-1">
									<span>Profile completion</span>
									<span>{completionPercentage}%</span>
								</div>
								<Progress
									value={completionPercentage}
									className="h-2"
								/>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Image Upload Section */}
								<motion.div
									className="flex flex-col items-center space-y-4"
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<motion.div
										whileHover={{ scale: 1.05 }}
										onClick={handleImageClick}
										className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/70 flex items-center justify-center bg-muted/30"
									>
										{imagePreview ? (
											<>
												<img
													src={imagePreview}
													alt="Profile preview"
													className="w-full h-full object-cover"
												/>
												<motion.button
													type="button"
													whileHover={{ scale: 1.1 }}
													onClick={handleRemoveImage}
													className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
												>
													<X className="h-4 w-4" />
												</motion.button>
												<motion.div
													initial={{ opacity: 0 }}
													whileHover={{ opacity: 1 }}
													className="absolute inset-0 bg-black/40 flex items-center justify-center"
												>
													<Camera className="h-8 w-8 text-white" />
												</motion.div>
											</>
										) : (
											<div className="text-center text-muted-foreground">
												<Camera className="h-8 w-8 mx-auto mb-1" />
												<p className="text-sm">
													Add photo
												</p>
											</div>
										)}
									</motion.div>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
									/>
								</motion.div>

								{/* Username Field */}
								<motion.div
									className="flex flex-col space-y-1.5"
									initial={{ y: 20, opacity: 0 }}
									animate={
										activeField === "username"
											? "active"
											: "inactive"
									}
									whileInView={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.1 }}
									variants={fieldVariants}
								>
									<Label
										htmlFor="username"
										className="text-foreground/80"
									>
										Username
									</Label>
									<Input
										id="username"
										name="username"
										placeholder="Enter your username"
										value={formData.username}
										onChange={handleChange}
										onFocus={() => handleFocus("username")}
										onBlur={handleBlur}
										className="border-input focus:ring-primary/30 focus:border-primary/80"
									/>
								</motion.div>

								{/* Bio Field */}
								<motion.div
									className="flex flex-col space-y-1.5"
									initial={{ y: 20, opacity: 0 }}
									animate={
										activeField === "bio"
											? {
													...fieldVariants.active,
													y: 0,
													opacity: 1,
												}
											: {
													...fieldVariants.inactive,
													y: 0,
													opacity: 1,
												}
									}
									transition={{ duration: 0.3, delay: 0.2 }}
									variants={fieldVariants}
								>
									<Label
										htmlFor="bio"
										className="text-foreground/80"
									>
										Bio
									</Label>
									<Textarea
										id="bio"
										name="bio"
										placeholder="Tell us about yourself"
										value={formData.bio}
										onChange={handleChange}
										onFocus={() => handleFocus("bio")}
										onBlur={handleBlur}
										className="min-h-[120px] border-input focus:ring-primary/30 focus:border-primary/80"
									/>
								</motion.div>

								{/* Gender Field */}
								<motion.div
									className="flex flex-col space-y-1.5"
									initial={{ y: 20, opacity: 0 }}
									animate={
										activeField === "gender"
											? {
													...fieldVariants.active,
													y: 0,
													opacity: 1,
												}
											: {
													...fieldVariants.inactive,
													y: 0,
													opacity: 1,
												}
									}
									transition={{ duration: 0.3, delay: 0.3 }}
									variants={fieldVariants}
								>
									<Label
										htmlFor="gender"
										className="text-foreground/80"
									>
										Gender
									</Label>
									<Select
										onValueChange={(value) =>
											handleSelectChange("gender", value)
										}
										onOpenChange={(open) => {
											if (open) handleFocus("gender");
											else handleBlur();
										}}
									>
										<SelectTrigger className="border-input focus:ring-primary/30 focus:border-primary/80">
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">
												Male
											</SelectItem>
											<SelectItem value="female">
												Female
											</SelectItem>
											<SelectItem value="lgbtq">
												LGBTQ+
											</SelectItem>
											<SelectItem value="other">
												Other
											</SelectItem>
										</SelectContent>
									</Select>
								</motion.div>
							</form>
						</CardContent>
						<CardFooter className="flex flex-col gap-4 sm:flex-row">
							<Link
								href="/perfumes/home"
								className="w-full sm:w-auto"
							>
								<Button
									type="button"
									variant="outline"
									className="w-full border-input hover:bg-accent"
								>
									Cancel
								</Button>
							</Link>
							<motion.div
								className="w-full sm:w-auto sm:flex-1"
								whileTap={{ scale: 0.98 }}
							>
								<Button
									className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
									onClick={handleSubmit}
									disabled={
										isSubmitting ||
										completionPercentage < 25
									}
								>
									{isSubmitting ? (
										<>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													repeat: Infinity,
													duration: 1,
													ease: "linear",
												}}
												className="mr-2 h-4 w-4 border-2 border-t-transparent border-foreground rounded-full"
											/>
											Saving...
										</>
									) : (
										"Save Profile"
									)}
								</Button>
							</motion.div>
						</CardFooter>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default UserProfileForm;
