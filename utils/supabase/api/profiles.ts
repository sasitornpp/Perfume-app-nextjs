import { supabaseClient } from "@/utils/supabase/client";
import { SuggestionsPerfumes } from "@/types/profile";
import { UserResponse } from "@supabase/supabase-js";

const uploadProfileImage = async (file: File, fileName: string) => {
	const { error: uploadError } = await supabaseClient.storage
		.from("IMAGES")
		.upload(`Avatars/${fileName}`, file);

	if (uploadError) {
		throw new Error(`Error uploading file: ${uploadError.message}`);
	}

	const { data: publicUrlData } = supabaseClient.storage
		.from("IMAGES")
		.getPublicUrl(`Avatars/${fileName}`);

	return publicUrlData?.publicUrl || null;
};

export const createProfile = async (data: {
	name: string;
	gender: string;
	bio: string;
	imgFiles?: File | null;
}) => {
	const { name, bio, imgFiles, gender } = data;

	let avatarUrl = null;

	const user = (await supabaseClient.auth.getUser()).data;

	if (user === null) {
		throw new Error("User not found");
	}

	if (imgFiles) {
		avatarUrl = await uploadProfileImage(imgFiles, user.user?.id as string);
	}

	const { data: profileData, error: profileError } = await supabaseClient
		.from("profiles")
		.insert({
			name: name,
			bio: bio,
			gender: gender,
			images: avatarUrl,
		});

	if (profileError) {
		throw new Error(`Error creating profile: ${profileError.message}`);
	}

	return profileData;
};

export const updateProfile = async (data: {
	columns: string;
	values: SuggestionsPerfumes;
}) => {
	const { columns, values } = data;
	const userId = (await supabaseClient.auth.getUser()).data.user?.id;

    if (!userId) {
        throw new Error("User not found");
    }
    
	const { data: profileData, error: profileError } = await supabaseClient
		.from("profiles")
		.update({
			[columns]: values,
		})
		.eq("id", userId);

	if (profileError) {
		throw new Error(`Error updating profile: ${profileError.message}`);
	}

	return profileData;
};

export function fetchProfile(userId: string) {
	return supabaseClient
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();
}

export function getUser() {
	return supabaseClient.auth.getUser();
}
