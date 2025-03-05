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
import { Camera, Save } from "lucide-react";
import { Profile } from "@/types/profile";

export function ProfileSettings({ profile }: { profile: Profile }) {
	const [settingProfile, setSettingProfile] = useState<Profile>({
		...profile,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
				<CardDescription>
					Manage your personal information.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Profile Picture */}
				<div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
					<div className="relative">
						<Avatar className="h-24 w-24">
							<AvatarImage src={settingProfile.images || ""} />
							<AvatarFallback>
								{settingProfile.name?.charAt(0) || "U"}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
						>
							<Camera className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex-1 space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={settingProfile.name || ""}
									onChange={(e) =>
										setSettingProfile({
											...settingProfile,
											name: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="gender">Gender</Label>
								<Select
									value={settingProfile.gender}
									onValueChange={(value) =>
										setSettingProfile({
											...settingProfile,
											gender: value,
										})
									}
								>
									<SelectTrigger id="gender">
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
							<Label htmlFor="bio">Bio</Label>
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
								className="resize-none"
								rows={3}
							/>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<h3 className="text-sm font-medium mb-2">Member Since</h3>
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
			<CardFooter className="flex justify-end gap-2 border-t pt-4">
				<Button variant="outline">Cancel</Button>
				<Button>
					<Save className="h-4 w-4 mr-2" />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
