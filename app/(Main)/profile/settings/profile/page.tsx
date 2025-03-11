"use client";

import { ProfileSettings } from "@/components/settings/profile-settings";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

export default function ProfilePage() {
	const profile = useSelector((state: RootState) => state.user.profile);
	return profile ? <ProfileSettings profile={profile} /> : null;
}
