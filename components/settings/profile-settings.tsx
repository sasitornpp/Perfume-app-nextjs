"use client";

import React, { useState, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Camera,
	LogOut,
	Save,
	Loader2,
	X,
	KeyRound,
	Eye,
	EyeOff,
} from "lucide-react";
import { Profile, ProfileSettingsProps } from "@/types/profile";
import { logoutUser } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/redux/user/userReducer"; // Assuming you have this API function
import { z } from "zod";
import { supabaseClient } from "@/utils/supabase/client";

// Password validation schema
const passwordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.regex(/[A-Z]/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/[a-z]/, {
				message: "Password must contain at least one lowercase letter",
			})
			.regex(/[0-9]/, {
				message: "Password must contain at least one number",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export function ProfileSettings({ profile }: { profile: Profile }) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const [settingProfile, setSettingProfile] = useState<ProfileSettingsProps>({
		...profile,
	});
	const [originalProfile, setOriginalProfile] = useState<Profile>({
		...profile,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(
		profile.images || null,
	);
	const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Password change state
	const [showPasswordSection, setShowPasswordSection] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordData, setPasswordData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [passwordErrors, setPasswordErrors] = useState<{
		newPassword?: string;
		confirmPassword?: string;
	}>({});
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleLogout = () => {
		dispatch(logoutUser());
		router.push("/login");
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Create a preview
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setImagePreview(result);
				// Store the file in the profile state
				setSettingProfile({
					...settingProfile,
					newImageFile: file,
				});
				setShowImagePreviewModal(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveChanges = async () => {
		setIsLoading(true);
		try {
			// Update profile
			await dispatch(updateProfile({ formData: settingProfile }));
			// Update the original profile
			setOriginalProfile({ ...settingProfile });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.error("Failed to update profile:", error);
			toast.error("Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		// Reset to original values
		setSettingProfile({ ...originalProfile });
		setImagePreview(originalProfile.images || null);
		// Reset password fields
		setPasswordData({
			newPassword: "",
			confirmPassword: "",
		});
		setPasswordErrors({});
		setShowPasswordSection(false);
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
		setSettingProfile({
			...settingProfile,
			newImageFile: null,
			images: null,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validatePassword = () => {
		try {
			passwordSchema.parse(passwordData);
			setPasswordErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors: {
					newPassword?: string;
					confirmPassword?: string;
				} = {};

				error.errors.forEach((err) => {
					const path = err.path[0] as string;
					formattedErrors[path as keyof typeof formattedErrors] =
						err.message;
				});

				setPasswordErrors(formattedErrors);
			}
			return false;
		}
	};

	const handlePasswordChange = async () => {
		if (!validatePassword()) return;

		setIsChangingPassword(true);
		try {
			const { error } = await supabaseClient.auth.updateUser({
				password: passwordData.newPassword,
			});

			if (error) throw error;

			toast.success("Password updated successfully");
			setShowPasswordSection(false);
			setPasswordData({
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error: any) {
			console.error("Failed to update password:", error);
			toast.error(error.message || "Failed to update password");
		} finally {
			setIsChangingPassword(false);
		}
	};

	return (
		<>
			<Card className="shadow-md">
				<CardHeader className="border-b bg-muted/40">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl">
								Profile Settings
							</CardTitle>
							<CardDescription className="mt-1">
								Manage your personal information
							</CardDescription>
						</div>
						<Button
							variant="destructive"
							size="sm"
							className="flex items-center gap-1"
							onClick={handleLogout}
						>
							<LogOut className="h-4 w-4" />
							<span>Logout</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					{/* Profile Picture */}
					<div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
						<div className="relative">
							<Avatar
								className="h-28 w-28 border-2 border-primary shadow-sm cursor-pointer"
								onClick={() =>
									imagePreview &&
									setShowImagePreviewModal(true)
								}
							>
								<AvatarImage
									src={
										imagePreview ||
										(profile.name
											? profile.name[0]
											: undefined)
									}
								/>
								<AvatarFallback className="bg-primary/10 text-xl font-medium">
									{settingProfile.name?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -bottom-2 -right-2 flex gap-1">
								<Button
									size="icon"
									className="rounded-full h-8 w-8 shadow-md"
									onClick={handleImageClick}
									type="button"
								>
									<Camera className="h-4 w-4" />
								</Button>
								{imagePreview && (
									<Button
										size="icon"
										variant="destructive"
										className="rounded-full h-8 w-8 shadow-md"
										onClick={handleRemoveImage}
										type="button"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleImageChange}
							/>
						</div>

						<div className="flex-1 space-y-5 w-full">
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="font-medium"
									>
										Name
									</Label>
									<Input
										id="name"
										value={settingProfile.name || ""}
										onChange={(e) =>
											setSettingProfile({
												...settingProfile,
												name: e.target.value,
											})
										}
										className="focus-visible:ring-primary"
									/>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="gender"
										className="font-medium"
									>
										Gender
									</Label>
									<Select
										value={settingProfile.gender}
										onValueChange={(value) =>
											setSettingProfile({
												...settingProfile,
												gender: value,
											})
										}
									>
										<SelectTrigger
											id="gender"
											className="focus-visible:ring-primary"
										>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">
												Male
											</SelectItem>
											<SelectItem value="female">
												Female
											</SelectItem>
											<SelectItem value="non-binary">
												Non-binary
											</SelectItem>
											<SelectItem value="prefer-not-to-say">
												Prefer not to say
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio" className="font-medium">
									Bio
								</Label>
								<Textarea
									id="bio"
									value={settingProfile.bio || ""}
									onChange={(e) =>
										setSettingProfile({
											...settingProfile,
											bio: e.target.value,
										})
									}
									placeholder="Tell us about yourself..."
									className="resize-none focus-visible:ring-primary"
									rows={3}
								/>
							</div>

							{/* Password Change Section */}
							<div className="mt-4">
								{!showPasswordSection ? (
									<Button
										variant="outline"
										type="button"
										className="gap-2"
										onClick={() =>
											setShowPasswordSection(true)
										}
									>
										<KeyRound className="h-4 w-4" />
										Change Password
									</Button>
								) : (
									<div className="border rounded-md p-4 space-y-4 bg-muted/10">
										<div className="flex items-center justify-between">
											<h3 className="text-sm font-medium">
												Change Password
											</h3>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setShowPasswordSection(
														false,
													)
												}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>

										<div className="space-y-3">
											<div className="space-y-2">
												<Label
													htmlFor="newPassword"
													className="text-sm"
												>
													New Password
												</Label>
												<div className="relative">
													<Input
														id="newPassword"
														type={
															showNewPassword
																? "text"
																: "password"
														}
														value={
															passwordData.newPassword
														}
														onChange={(e) =>
															setPasswordData({
																...passwordData,
																newPassword:
																	e.target
																		.value,
															})
														}
														className="pr-10 focus-visible:ring-primary"
													/>
													<button
														type="button"
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
														onClick={() =>
															setShowNewPassword(
																!showNewPassword,
															)
														}
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
												{passwordErrors.newPassword && (
													<p className="text-xs text-destructive mt-1">
														{
															passwordErrors.newPassword
														}
													</p>
												)}
												<p className="text-xs text-muted-foreground mt-1">
													Password must be at least 8
													characters and include
													uppercase, lowercase, and
													numbers.
												</p>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="confirmPassword"
													className="text-sm"
												>
													Confirm Password
												</Label>
												<div className="relative">
													<Input
														id="confirmPassword"
														type={
															showConfirmPassword
																? "text"
																: "password"
														}
														value={
															passwordData.confirmPassword
														}
														onChange={(e) =>
															setPasswordData({
																...passwordData,
																confirmPassword:
																	e.target
																		.value,
															})
														}
														className="pr-10 focus-visible:ring-primary"
													/>
													<button
														type="button"
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
														onClick={() =>
															setShowConfirmPassword(
																!showConfirmPassword,
															)
														}
													>
														{showConfirmPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
												{passwordErrors.confirmPassword && (
													<p className="text-xs text-destructive mt-1">
														{
															passwordErrors.confirmPassword
														}
													</p>
												)}
											</div>

											<div className="pt-2">
												<Button
													type="button"
													onClick={
														handlePasswordChange
													}
													disabled={
														isChangingPassword
													}
													className="w-full gap-2"
												>
													{isChangingPassword ? (
														<>
															<Loader2 className="h-4 w-4 animate-spin" />
															Updating...
														</>
													) : (
														<>
															<KeyRound className="h-4 w-4" />
															Update Password
														</>
													)}
												</Button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mt-6 p-4 bg-muted/30 rounded-md">
						<h3 className="text-sm font-medium mb-1">
							Member Since
						</h3>
						<p className="text-sm text-muted-foreground">
							{settingProfile.created_at &&
								new Date(
									settingProfile.created_at,
								).toLocaleDateString()}
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex justify-end gap-3 border-t pt-4 bg-muted/20">
					<Button
						variant="outline"
						className="hover:bg-muted"
						onClick={handleCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						className="gap-2"
						onClick={handleSaveChanges}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</CardFooter>
			</Card>

			{/* Image Preview Modal */}
			{showImagePreviewModal && imagePreview && (
				<div
					className="fixed inset-0 bg-background/70 flex items-center justify-center z-50"
					onClick={() => setShowImagePreviewModal(false)}
				>
					<div
						className="relative max-w-3xl w-full p-4"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							variant="outline"
							size="icon"
							className="absolute top-2 right-2 rounded-full z-10 bg-background"
							onClick={() => setShowImagePreviewModal(false)}
						>
							<X className="h-4 w-4" />
						</Button>
						<div className="bg-background p-2 rounded-lg overflow-hidden">
							<img
								src={imagePreview}
								alt="Preview"
								className="w-full h-auto rounded"
							/>
							<div className="mt-4 flex justify-end gap-2 p-2">
								<Button
									variant="outline"
									onClick={() =>
										setShowImagePreviewModal(false)
									}
								>
									Close
								</Button>
								<Button
									variant="destructive"
									onClick={handleRemoveImage}
								>
									Remove Image
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
