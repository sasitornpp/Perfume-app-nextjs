import { supabaseClient } from "@/utils/supabase/client";

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
  userId: string;
  name: string;
  gender: string;
  bio: string;
  imgFiles?: File | null;
}) => {
  const { name, bio, imgFiles, userId, gender } = data;

  let avatarUrl = null;

  if (imgFiles) {
    avatarUrl = await uploadProfileImage(imgFiles, userId);
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

export const UpdateProfile = async (data: {
  userId: string;
  columns: string;
  values: string | JSON;
}) => {
  const { userId, columns, values } = data;

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
