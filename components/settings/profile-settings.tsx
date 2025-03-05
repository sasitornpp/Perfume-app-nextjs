"use client";

import React, { useState } from "react";
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
import { Camera, LogOut, Save } from "lucide-react";
import { Profile } from "@/types/profile";
import { logoutUser } from "@/redux/user/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/Store";
import { useRouter } from "next/navigation";

export function ProfileSettings({ profile }: { profile: Profile }) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [settingProfile, setSettingProfile] = useState<Profile>({
		...profile,
	});

	const handleLogout = () => {
		dispatch(logoutUser());
		router.push("/login");
	};

	return (
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
						<Avatar className="h-28 w-28 border-2 border-primary shadow-sm">
							<AvatarImage src={settingProfile.images || ""} />
							<AvatarFallback className="bg-primary/10 text-xl font-medium">
								{settingProfile.name?.charAt(0) || "U"}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 shadow-md"
						>
							<Camera className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex-1 space-y-5 w-full">
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name" className="font-medium">
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
								<Label htmlFor="gender" className="font-medium">
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
					<h3 className="text-sm font-medium mb-1">Member Since</h3>
					<p className="text-sm text-muted-foreground">
						{settingProfile.created_at &&
						typeof settingProfile.created_at !== "string"
							? settingProfile.created_at.toLocaleDateString(
									"en-US",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)
							: "N/A"}
					</p>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end gap-3 border-t pt-4 bg-muted/20">
				<Button variant="outline" className="hover:bg-muted">
					Cancel
				</Button>
				<Button className="gap-2">
					<Save className="h-4 w-4" />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
