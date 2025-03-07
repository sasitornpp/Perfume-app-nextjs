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
import { Camera, LogOut, Save, Loader2, X } from "lucide-react";
import { Profile, ProfileSettingsProps } from "@/types/profile";
import { logoutUser } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/redux/user/userReducer"; // Assuming you have this API function

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

	// console.log("settingProfile", settingProfile);

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
					className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
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
