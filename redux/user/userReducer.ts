"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { type useRouter } from "next/navigation";
import {
	suggestedPerfume,
	Filters,
	Perfume,
	PerfumeForInsert,
	PerfumeForUpdate,
	AlbumWithPerfume,
	AlbumForInsert,
	Album,
	BasketWithPerfume,
	Basket,
} from "@/types/perfume";
import {
	fetch_user_result,
	ProfileSettingsProps,
	Profile,
} from "@/types/profile";
import {
	rollbackUploadedFiles,
	uploadImagesToSupabase,
} from "@/utils/functions/image_process";

interface UserState {
	user: User | null;
	profile: Profile | null;
	perfumes: Perfume[] | null;
	albums: AlbumWithPerfume[] | null;
	basket: Basket[] | null;
	loading: boolean;
	error: string | null;
	profileNotCreated: boolean;
}

const initialState: UserState = {
	user: null,
	profile: null,
	perfumes: [],
	albums: [],
	basket: [],
	loading: false,
	error: null,
	profileNotCreated: false,
};

export const signInUser = createAsyncThunk(
	"user/signInUser",
	async (
		{
			email,
			password,
			router,
		}: {
			email: string;
			password: string;
			router: ReturnType<typeof useRouter>;
		},
		{ rejectWithValue, dispatch },
	) => {
		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw new Error(error.message);
		await dispatch(fetchUserData());
		router.push("/perfumes/home");
		return true;
	},
);

export const signUpUser = createAsyncThunk(
	"user/signUpUser",
	async (
		{
			email,
			password,
			router,
		}: {
			email: string;
			password: string;
			router: ReturnType<typeof useRouter>;
		},
		{ rejectWithValue },
	) => {
		try {
			const { error } = await supabaseClient.auth.signUp({
				email,
				password,
			});
			if (error) throw new Error(error.message);

			router.push("/login");
			return true;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const logoutUser = createAsyncThunk(
	"user/logoutUser",
	async (_, { dispatch }) => {
		await supabaseClient.auth.signOut();
		dispatch(logout());
	},
);

export const fetchUserData = createAsyncThunk(
	"user/fetchUserData",
	async (_, { rejectWithValue }) => {
		try {
			const { data: user, error: userError } =
				await supabaseClient.auth.getUser();
			if (userError || !user)
				throw new Error(userError?.message || "User not found");

			const { data, error: profileError } = await supabaseClient.rpc(
				"fetch_user",
				{
					user_id: user.user.id,
				},
			);

			const profile = data as fetch_user_result;

			if (profileError) {
				return { user, profile: null, profileNotCreated: true };
			}

			return { user, ...profile, profileNotCreated: false };
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const createProfile = createAsyncThunk(
	"user/createProfile",
	async (
		data: {
			name: string;
			gender: string;
			bio: string;
			imgFiles?: File | null;
		},
		{ rejectWithValue, dispatch },
	) => {
		try {
			const user = (await supabaseClient.auth.getUser()).data;
			if (!user || !user.user) throw new Error("User not found");

			let avatarUrl = null;
			if (data.imgFiles) {
				const { error: uploadError } = await supabaseClient.storage
					.from("IMAGES")
					.upload(`Avatars/${user.user.id}`, data.imgFiles);

				if (uploadError)
					throw new Error(
						`Error uploading file: ${uploadError.message}`,
					);

				const { data: publicUrlData } = supabaseClient.storage
					.from("IMAGES")
					.getPublicUrl(`Avatars/${user.user.id}`);

				avatarUrl = publicUrlData?.publicUrl || null;
			}

			const { data: profileData, error: profileError } =
				await supabaseClient
					.from("profiles")
					.insert({
						id: user.user.id,
						name: data.name,
						bio: data.bio,
						gender: data.gender,
						images: avatarUrl,
					})
					.select()
					.single();

			if (profileError)
				throw new Error(
					`Error creating profile: ${profileError.message}`,
				);

			await dispatch(fetchUserData());
			return profileData;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateProfile = createAsyncThunk(
	"user/updateProfile",
	async (
		{ formData }: { formData: ProfileSettingsProps },
		{ rejectWithValue, dispatch, getState },
	) => {
		try {
			// Get current user from state
			const state = getState() as { user: UserState };
			const userId = state.user.user?.id;

			if (!userId) {
				throw new Error("User not authenticated");
			}

			// Prepare update data
			const updateData: Record<string, any> = {
				name: formData.name,
				bio: formData.bio,
				gender: formData.gender,
			};

			// Handle image changes if there's a new image
			if (formData.newImageFile) {
				// If there was a previous image, delete it first
				if (state.user.profile?.images) {
					const previousImagePath =
						state.user.profile.images.split("/IMAGES/")[1];
					if (previousImagePath) {
						const { error: deleteError } =
							await supabaseClient.storage
								.from("IMAGES")
								.remove([previousImagePath]);

						if (deleteError) {
							console.error(
								"Error deleting previous image:",
								deleteError,
							);
						}
					}
				}

				// Add timestamp to avoid caching issues
				const timestamp = Date.now();
				const fileName = `${userId}_${timestamp}`;

				// Upload the new image with the timestamp in the name
				const { error: uploadError } = await supabaseClient.storage
					.from("IMAGES")
					.upload(`Avatars/${fileName}`, formData.newImageFile);

				if (uploadError) {
					throw new Error(
						`Error uploading file: ${uploadError.message}`,
					);
				}

				// Get the public URL
				const { data: publicUrlData } = supabaseClient.storage
					.from("IMAGES")
					.getPublicUrl(`Avatars/${fileName}`);

				updateData.images = publicUrlData?.publicUrl || null;
			} else if (formData.images === null && state.user.profile?.images) {
				// If the image was removed (set to null)
				const previousImagePath =
					state.user.profile.images.split("/IMAGES/")[1];
				if (previousImagePath) {
					await supabaseClient.storage
						.from("IMAGES")
						.remove([previousImagePath]);
				}
				updateData.images = null;
			}

			// Update the profile in the database
			const { data: profileData, error: profileError } =
				await supabaseClient
					.from("profiles")
					.update(updateData)
					.eq("id", userId)
					.select()
					.single();

			if (profileError) {
				throw new Error(
					`Error updating profile: ${profileError.message}`,
				);
			}

			// Refresh user data
			await dispatch(fetchUserData());
			return profileData;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const fetchSuggestedPerfumes = createAsyncThunk(
	"perfume/fetchSuggestedPerfumes",
	async (
		{ filters }: { filters: Filters },
		{ rejectWithValue, dispatch },
	) => {
		try {
			console.log("Fetching suggested perfumes with filters:", filters);
			const { data, error } = await supabaseClient
				.rpc("filter_perfumes", filters)
				.select();
			if (error) throw error;

			const perfumes = data as suggestedPerfume[];

			dispatch(
				updateProfile({
					formData: {
						suggestions_perfumes: perfumes,
					} as ProfileSettingsProps,
				}),
			);

			return perfumes;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const addMyPerfume = createAsyncThunk(
	"perfume/addMyPerfume",
	async (
		{ formData }: { formData: PerfumeForInsert },
		{ rejectWithValue, getState },
	) => {
		console.log("Adding perfume with data state 1 :", formData);

		// Get state (corrected to match store structure)
		const state = getState() as { user: UserState };
		const profile = state.user.profile;

		if (!profile) throw new Error("User profile is required");

		console.log("Adding perfume with data state 1.1 :", profile);

		try {
			// Handle image uploads if there are any files
			let imageUrls: string[] = formData.images;
			const folderName = `perfumes/${profile.id}/${formData.name}`;
			if (formData.imagesFiles && formData.imagesFiles.length > 0) {
				const uploadResult = await uploadImagesToSupabase(
					folderName,
					formData.imagesFiles,
				);

				if (
					uploadResult.results.length !== formData.imagesFiles.length
				) {
					throw new Error("Some images failed to upload");
				}

				imageUrls = uploadResult.results.map(
					(result) => result.publicUrl,
				);
			}

			console.log("Adding perfume with data state 2 :", formData);

			// Prepare the data for insertion, explicitly excluding imagesFiles and imagePreviews
			const { imagesFiles, imagePreviews, ...cleanedFormData } = formData; // Destructure to exclude unwanted fields

			const perfumeData = {
				...cleanedFormData,
				images: imageUrls,
				user_id: profile.id,
				user: profile
					? {
							id: profile.id,
							username: profile.name,
							avatar: profile.images || null,
						}
					: null,
			};

			console.log("Adding perfume with data state 3 :", perfumeData);

			// Insert into Supabase
			const { data, error } = await supabaseClient
				.from("perfumes")
				.insert([perfumeData])
				.select();

			if (error) {
				// If images were uploaded, rollback on error
				if (imageUrls.length > 0) {
					const filePaths = imageUrls.map((url) => {
						const path = url.split("/IMAGES/")[1];
						return path;
					});
					await rollbackUploadedFiles(filePaths);
				}
				throw error;
			}

			console.log("Adding perfume with data state 4 :", data);
			// Return the newly added perfume
			return data[0];
		} catch (error: any) {
			console.log("Adding perfume with data state 5 :", error);
			return rejectWithValue({
				message: error.message || "Failed to add perfume",
				code: error.code,
				details: error.details,
			});
		}
	},
);

export const editPerfume = createAsyncThunk(
	"perfume/editPerfume",
	async (
		{ formData }: { formData: PerfumeForUpdate },
		{ rejectWithValue, getState },
	) => {
		console.log("Editing perfume with data state 1 :", { formData });

		const state = getState() as { user: UserState };
		const profile = state.user.profile;

		console.log("Editing perfume with data state 1.1 :", profile);

		try {
			if (!profile) throw new Error("User profile is required");

			const { data: existingPerfume, error: fetchError } =
				await supabaseClient
					.from("perfumes")
					.select("images")
					.eq("id", formData.id)
					.single();

			if (fetchError) {
				throw new Error("Failed to fetch existing perfume data");
			}

			const originalImages: string[] = existingPerfume.images || [];
			console.log("Original images from DB:", originalImages);

			const submittedImages: string[] = formData.images || [];
			const imagesToDelete = originalImages.filter(
				(url) => !submittedImages.includes(url),
			);
			console.log("Images to delete:", imagesToDelete);

			if (imagesToDelete.length > 0) {
				const filePathsToDelete = imagesToDelete.map(
					(url) => url.split("/IMAGES/")[1],
				);
				await rollbackUploadedFiles(filePathsToDelete);
				console.log("Deleted old images:", filePathsToDelete);
			}

			let finalImageUrls: string[] = submittedImages;
			const folderName = `perfumes/${profile.id}/${formData.name}`;
			if (formData.imagesFiles && formData.imagesFiles.length > 0) {
				const uploadResult = await uploadImagesToSupabase(
					folderName,
					formData.imagesFiles,
				);

				if (
					uploadResult.results.length !== formData.imagesFiles.length
				) {
					const uploadedPaths = uploadResult.results.map(
						(result) => result.publicUrl.split("/IMAGES/")[1],
					);
					await rollbackUploadedFiles(uploadedPaths);
					throw new Error("Some images failed to upload");
				}

				const newImageUrls = uploadResult.results.map(
					(result) => result.publicUrl,
				);
				finalImageUrls = [...finalImageUrls, ...newImageUrls];
				console.log("Uploaded new images:", newImageUrls);
			}

			console.log("Final images to update:", finalImageUrls);

			const { imagesFiles, imagePreviews, ...cleanedFormData } = formData;
			const perfumeData = {
				...cleanedFormData,
				images: finalImageUrls,
				user_id: profile.id,
				user: {
					id: profile.id,
					username: profile.name,
					avatar: profile.images || null,
				},
				updated_at: new Date().toISOString(),
			};

			console.log("Editing perfume with data state 3 :", perfumeData);
			const { data, error } = await supabaseClient
				.from("perfumes")
				.update(perfumeData)
				.eq("id", perfumeData.id)
				.select();

			if (error) {
				if (formData.imagesFiles?.length) {
					const newFilePaths = finalImageUrls
						.filter((url) => !originalImages.includes(url))
						.map((url) => url.split("/IMAGES/")[1]);
					await rollbackUploadedFiles(newFilePaths);
				}
				throw error;
			}

			console.log("Editing perfume with data state 4 :", data);
			return data;
		} catch (error: any) {
			console.log("Editing perfume with data state 5 :", error);
			return rejectWithValue({
				message: error.message || "Failed to edit perfume",
				code: error.code,
				details: error.details,
			});
		}
	},
);

export const removePerfume = createAsyncThunk(
	"perfume/removePerfume",
	async (
		{
			perfumeId,
			router,
		}: { perfumeId: string; router: ReturnType<typeof useRouter> },
		{ rejectWithValue, getState },
	) => {
		console.log("Removing perfume with data state 1 :", perfumeId);

		// Get state
		const state = getState() as { user: UserState };
		const profile = state.user.profile;

		console.log("Removing perfume with data state 1.1 :", profile);

		try {
			if (!profile) throw new Error("User profile is required");

			// 1. Fetch the perfume to get image URLs for cleanup
			const { data: perfumeData, error: fetchError } =
				await supabaseClient
					.from("perfumes")
					.select("images")
					.eq("id", perfumeId)
					.single();

			if (fetchError || !perfumeData) {
				throw fetchError || new Error("Perfume not found");
			}

			console.log("Removing perfume with data state 2 :", perfumeData);

			// 2. Clean up images from storage before deleting the row
			if (perfumeData.images && perfumeData.images.length > 0) {
				const filePaths = perfumeData.images.map(
					(url: string) => url.split("/IMAGES/")[1],
				);
				await rollbackUploadedFiles(filePaths);
				console.log(
					"Removing perfume with data state 3 : Images cleaned up",
				);
			} else {
				console.log(
					"Removing perfume with data state 3 : No images to clean up",
				);
			}

			// 3. Delete the perfume from Supabase after images are removed
			const { error: deleteError } = await supabaseClient
				.from("perfumes")
				.delete()
				.eq("id", perfumeId);

			if (deleteError) {
				throw deleteError;
			}

			console.log(
				"Removing perfume with data state 4 : Deleted from database",
			);
			router.back();
			return { id: perfumeId }; // Return the ID for state update
		} catch (error: any) {
			console.log("Removing perfume with data state 5 :", error);
			return rejectWithValue({
				message: error.message || "Failed to remove perfume",
				code: error.code,
				details: error.details,
			});
		}
	},
);

export const addNewAlbum = createAsyncThunk(
	"user/addNewAlbum",
	async (
		{ album }: { album: AlbumForInsert },
		{ rejectWithValue, getState },
	) => {
		console.log("Adding new album with data state 1 :", album);
		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			// Handle image uploads if there are any files
			let imageUrl: string | null = null;
			if (album.imageFile) {
				const folderName = `albums/${profile.id}`;
				const fileName = `${album.title}_${Date.now()}`;
				const filePath = `${folderName}/${fileName}`;

				// Upload image to storage
				const { error: uploadError } = await supabaseClient.storage
					.from("IMAGES")
					.upload(filePath, album.imageFile);

				if (uploadError) {
					throw new Error(
						`Error uploading album image: ${uploadError.message}`,
					);
				}

				// Get public URL of uploaded image
				const { data: publicUrlData } = supabaseClient.storage
					.from("IMAGES")
					.getPublicUrl(filePath);

				imageUrl = publicUrlData?.publicUrl || null;
			}

			// Prepare album data for insertion by removing file objects
			const { imageFile, ...cleanedAlbumData } = album;

			// Add the image URL to the album data
			const albumToInsert = {
				...cleanedAlbumData,
				images: imageUrl, // Use the uploaded image URL
				user_id: profile.id,
			};

			console.log("Adding new album with data state 2:", albumToInsert);

			const { data, error } = await supabaseClient
				.from("albums")
				.insert([albumToInsert])
				.select();

			if (error) {
				// If there was an error, remove the uploaded image
				if (imageUrl) {
					const filePath = imageUrl.split("/IMAGES/")[1];
					await rollbackUploadedFiles([filePath]);
				}
				throw error;
			}

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateAlbum = createAsyncThunk(
	"user/upDateAlbum",
	async (
		{ album }: { album: AlbumForInsert },
		{ rejectWithValue, getState },
	) => {
		console.log("Updating album with data state 1:", album);
		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			// Fetch the existing album to get its current image
			const { data: existingAlbum, error: fetchError } =
				await supabaseClient
					.from("albums")
					.select("images")
					.eq("id", album.id)
					.single();

			if (fetchError)
				throw new Error(
					`Error fetching existing album: ${fetchError.message}`,
				);
			let imageUrl = album.images;
			if (album.imageFile) {
				if (existingAlbum?.images) {
					const oldImagePath =
						existingAlbum.images.split("/IMAGES/")[1];
					if (oldImagePath) {
						const { error: deleteError } =
							await supabaseClient.storage
								.from("IMAGES")
								.remove([oldImagePath]);

						if (deleteError) {
							console.error(
								"Error deleting previous album image:",
								deleteError,
							);
						}
					}
				}

				const folderName = `albums/${profile.id}`;
				const fileName = `${album.title}_${Date.now()}`;
				const filePath = `${folderName}/${fileName}`;

				const { error: uploadError } = await supabaseClient.storage
					.from("IMAGES")
					.upload(filePath, album.imageFile);

				if (uploadError) {
					throw new Error(
						`Error uploading album image: ${uploadError.message}`,
					);
				}

				const { data: publicUrlData } = supabaseClient.storage
					.from("IMAGES")
					.getPublicUrl(filePath);

				imageUrl = publicUrlData?.publicUrl || null;
			} else if (album.images === null && existingAlbum?.images) {
				const oldImagePath = existingAlbum.images.split("/IMAGES/")[1];
				if (oldImagePath) {
					await supabaseClient.storage
						.from("IMAGES")
						.remove([oldImagePath]);
				}
				imageUrl = null;
			}

			const { imageFile, ...cleanedAlbumData } = album;

			const albumToUpdate = {
				...cleanedAlbumData,
				images: imageUrl,
				user_id: profile.id,
			};

			console.log("Updating album with data state 2:", albumToUpdate);

			const { data, error } = await supabaseClient
				.from("albums")
				.update(albumToUpdate)
				.eq("id", album.id)
				.select();

			if (error) {
				if (album.imageFile && imageUrl) {
					const filePath = imageUrl.split("/IMAGES/")[1];
					await rollbackUploadedFiles([filePath]);
				}
				throw error;
			}

			console.log("Album updated successfully:", data);
			return data;
		} catch (error: any) {
			console.error("Error updating album:", error);
			return rejectWithValue(error.message);
		}
	},
);

export const removeAlbum = createAsyncThunk(
	"user/removeAlbum",
	async ({ albumId }: { albumId: string }, { rejectWithValue, getState }) => {
		console.log("Removing album with data state 1:", albumId);

		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			// 1. Fetch the album to get its image URL for cleanup
			const { data: albumData, error: fetchError } = await supabaseClient
				.from("albums")
				.select("images")
				.eq("id", albumId)
				.single();

			if (fetchError) {
				throw new Error(`Error fetching album: ${fetchError.message}`);
			}

			console.log("Removing album with data state 2:", albumData);

			// 2. Delete the image from storage if it exists
			if (albumData.images) {
				const imagePath = albumData.images.split("/IMAGES/")[1];
				if (imagePath) {
					const { error: deleteImageError } =
						await supabaseClient.storage
							.from("IMAGES")
							.remove([imagePath]);

					if (deleteImageError) {
						console.error(
							"Error deleting album image:",
							deleteImageError,
						);
					} else {
						console.log("Successfully deleted album image");
					}
				}
			}

			// 3. Delete the album from the database
			const { error: deleteError } = await supabaseClient
				.from("albums")
				.delete()
				.eq("id", albumId);

			if (deleteError) {
				throw new Error(`Error deleting album: ${deleteError.message}`);
			}

			console.log("Album successfully deleted");
			return { id: albumId };
		} catch (error: any) {
			console.error("Error removing album:", error);
			return rejectWithValue(error.message || "Failed to remove album");
		}
	},
);

export const togglePerfumeToAlbum = createAsyncThunk(
	"user/togglePerfumeToAlbum",
	async (
		{
			album,
			perfumeId,
		}: { album: { albumId: string; add: boolean }[]; perfumeId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			const updatedAlbums = await Promise.all(
				album.map(async ({ albumId, add }) => {
					const { data: albumData, error: fetchError } =
						await supabaseClient
							.from("albums")
							.select("perfumes_id")
							.eq("id", albumId)
							.single();

					if (fetchError) {
						throw new Error(
							`Error fetching album ${albumId}: ${fetchError.message}`,
						);
					}

					let currentPerfumeIds: string[] =
						albumData.perfumes_id || [];
					let updatedPerfumeIds: string[];

					if (add) {
						// Add perfume to album
						updatedPerfumeIds = [...currentPerfumeIds, perfumeId];
					} else {
						// Remove perfume from album
						updatedPerfumeIds = currentPerfumeIds.filter(
							(id) => id !== perfumeId,
						);
					}

					const { data: updatedAlbum, error: updateError } =
						await supabaseClient
							.from("albums")
							.update({
								perfumes_id: updatedPerfumeIds,
							})
							.eq("id", albumId)
							.select();

					if (updateError) {
						throw new Error(
							`Error updating album ${albumId}: ${updateError.message}`,
						);
					}

					return {
						id: albumId,
						perfumes_id: updatedPerfumeIds,
						isAdded: add,
					};
				}),
			);

			return updatedAlbums;
		} catch (error: any) {
			console.error("Error toggling perfume in album:", error);
			return rejectWithValue(
				error.message || "Failed to toggle perfume in album",
			);
		}
	},
);

export const toggleLikeAlbum = createAsyncThunk(
	"user/toggleLikeAlbum",
	async ({ albumId }: { albumId: string }, { rejectWithValue, getState }) => {
		console.log(`Toggling like for album ${albumId}`);

		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");
			const userId = profile.id;

			// 1. Fetch the current album to get its likes array
			const { data: album, error: fetchError } = await supabaseClient
				.from("albums")
				.select("likes")
				.eq("id", albumId)
				.single();

			if (fetchError) {
				throw new Error(`Error fetching album: ${fetchError.message}`);
			}

			// 2. Toggle the user's like status
			const currentLikes: string[] = album.likes || [];
			let updatedLikes: string[];
			let action: string;

			// Check if user has already liked the album
			if (currentLikes.includes(userId)) {
				// User already liked it, so remove the like
				updatedLikes = currentLikes.filter((id) => id !== userId);
				action = "unliked";
			} else {
				// User hasn't liked it yet, so add the like
				updatedLikes = [...currentLikes, userId];
				action = "liked";
			}

			// 3. Update the album in the database
			const { data: updatedAlbum, error: updateError } =
				await supabaseClient
					.from("albums")
					.update({
						likes: updatedLikes,
					})
					.eq("id", albumId)
					.select();

			if (updateError) {
				throw new Error(`Error updating album: ${updateError.message}`);
			}

			console.log(
				`User ${userId} successfully ${action} album ${albumId}`,
			);
			return {
				id: albumId,
				likes: updatedLikes,
				isLiked: action === "liked",
			};
		} catch (error: any) {
			console.error("Error toggling album like:", error);
			return rejectWithValue(
				error.message || "Failed to toggle album like",
			);
		}
	},
);

export const addPerfumeToBasket = createAsyncThunk(
	"user/addPerfumeToBasket",
	async (
		{ perfumeId }: { perfumeId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			const { data: basketData, error: fetchError } = await supabaseClient
				.from("baskets")
				.insert({
					amount: 1,
					user_id: profile.id,
					perfume_id: perfumeId,
				})
				.select()
				.single();

			if (fetchError) {
				throw new Error(`Error fetching basket: ${fetchError.message}`);
			}

			return basketData;
		} catch (error: any) {
			console.error("Error adding perfume to basket:", error);
			return rejectWithValue(
				error.message || "Failed to add perfume to basket",
			);
		}
	},
);

export const removePerfumeFromBasket = createAsyncThunk(
	"user/removePerfumeFromBasket",
	async (
		{ basketId }: { basketId: string },
		{ rejectWithValue, getState },
	) => {
		try {
			const state = getState() as { user: UserState };
			const profile = state.user.profile;

			if (!profile) throw new Error("User profile is required");

			const { error: fetchError } = await supabaseClient
				.from("baskets")
				.delete()
				.eq("id", basketId)
				.select();

			if (fetchError) {
				throw new Error(`Error fetching basket: ${fetchError.message}`);
			}

			return basketId;
		} catch (error: any) {
			console.error("Error removing perfume from basket:", error);
			return rejectWithValue(
				error.message || "Failed to remove perfume from basket",
			);
		}
	},
);

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.profile = null;
			state.loading = false;
			state.error = null;
			state.profileNotCreated = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchUserData.fulfilled,
				(
					state,
					action: PayloadAction<{
						user: { user: User };
						profile: Profile | null;
						albums?: any[] | null;
						baskets?: any[] | null;
						perfumes?: Perfume[] | null;
						profileNotCreated: boolean;
					}>,
				) => {
					const {
						user,
						profile,
						albums,
						baskets,
						perfumes,
						profileNotCreated,
					} = action.payload;
					state.user = user.user;
					state.profile = profile;
					state.albums = albums || null;
					state.basket = baskets || null;
					state.perfumes = perfumes || null;
					state.profileNotCreated = profileNotCreated;
					state.loading = false;
				},
			)
			.addCase(
				fetchUserData.rejected,
				(state, action: PayloadAction<any>) => {
					state.error = action.payload;
					state.loading = false;
				},
			)
			.addCase(createProfile.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				createProfile.fulfilled,
				(state, action: PayloadAction<Profile>) => {
					state.profile = action.payload;
					state.profileNotCreated = false;
					state.loading = false;
				},
			)
			.addCase(
				createProfile.rejected,
				(state, action: PayloadAction<any>) => {
					state.error = action.payload;
					state.loading = false;
				},
			)
			.addCase(updateProfile.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				updateProfile.fulfilled,
				(state, action: PayloadAction<Profile>) => {
					state.profile = action.payload;
					state.loading = false;
				},
			)
			.addCase(
				updateProfile.rejected,
				(state, action: PayloadAction<any>) => {
					state.error = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchSuggestedPerfumes.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				fetchSuggestedPerfumes.fulfilled,
				(state, action: PayloadAction<suggestedPerfume[]>) => {
					if (state.profile) {
						state.profile.suggestions_perfumes = action.payload;
					}
					state.loading = false;
				},
			)
			.addCase(
				fetchSuggestedPerfumes.rejected,
				(state, action: PayloadAction<any>) => {
					state.error = action.payload;
					state.loading = false;
				},
			)
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.profile = null;
				state.loading = false;
				state.error = null;
				state.profileNotCreated = false;
			})
			.addCase(
				logoutUser.rejected,
				(state, action: PayloadAction<any>) => {
					state.error = action.payload;
					state.loading = false;
				},
			)
			.addCase(addMyPerfume.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				addMyPerfume.fulfilled,
				(state, action: PayloadAction<Perfume>) => {
					state.loading = false;
					if (state.perfumes) {
						state.perfumes = [...state.perfumes, action.payload];
					} else {
						state.perfumes = [action.payload];
					}
				},
			)
			.addCase(
				addMyPerfume.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload.message || "Failed to add perfume";
				},
			)
			.addCase(editPerfume.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				editPerfume.fulfilled,
				(state, action: PayloadAction<Perfume[]>) => {
					state.loading = false;
					if (state.perfumes && action.payload.length > 0) {
						const updatedPerfume = action.payload[0];
						state.perfumes = state.perfumes.map((perfume) =>
							perfume.id === updatedPerfume.id
								? updatedPerfume
								: perfume,
						);
					}
				},
			)
			.addCase(
				editPerfume.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload.message || "Failed to edit perfume";
				},
			)
			.addCase(removePerfume.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removePerfume.fulfilled,
				(state, action: PayloadAction<{ id: string }>) => {
					state.loading = false;
					if (state.perfumes) {
						state.perfumes = state.perfumes.filter(
							(perfume) => perfume.id !== action.payload.id,
						);
					}
				},
			)
			.addCase(
				removePerfume.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload.message || "Failed to remove perfume";
				},
			)
			.addCase(addNewAlbum.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				addNewAlbum.fulfilled,
				(state, action: PayloadAction<Album[]>) => {
					state.loading = false;
					if (state.albums && action.payload.length > 0) {
						// Create a set of existing album IDs for quick lookup
						const existingIds = new Set(
							state.albums.map((album) => album.id),
						);
						// Filter out any new albums that already exist in the state
						const uniqueNewAlbums = action.payload.filter(
							(album) => !existingIds.has(album.id),
						);
						state.albums = [...state.albums, ...uniqueNewAlbums];
					} else if (action.payload.length > 0) {
						state.albums = action.payload;
					}
				},
			)
			.addCase(
				addNewAlbum.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload.message || "Failed to add album";
				},
			)
			.addCase(updateAlbum.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				updateAlbum.fulfilled,
				(state, action: PayloadAction<Album[]>) => {
					state.loading = false;
					if (state.albums && action.payload.length > 0) {
						const updatedAlbum = action.payload[0];
						state.albums = state.albums.map((album) =>
							album.id === updatedAlbum.id ? updatedAlbum : album,
						);
					}
				},
			)
			.addCase(
				updateAlbum.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload.message || "Failed to update album";
				},
			)
			.addCase(removeAlbum.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removeAlbum.fulfilled,
				(state, action: PayloadAction<{ id: string }>) => {
					state.loading = false;
					if (state.albums) {
						state.albums = state.albums.filter(
							(album) => album.id !== action.payload.id,
						);
					}
				},
			)
			.addCase(
				removeAlbum.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload || "Failed to remove album";
				},
			)
			.addCase(togglePerfumeToAlbum.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				togglePerfumeToAlbum.fulfilled,
				(
					state,
					action: PayloadAction<
						Array<{
							id: string;
							perfumes_id: string[];
							isAdded: boolean;
						}>
					>,
				) => {
					state.loading = false;
					if (state.albums) {
						// Handle multiple album updates
						action.payload.forEach((updatedAlbum) => {
							state.albums = state.albums!.map((album) => {
								if (album.id === updatedAlbum.id) {
									return {
										...album,
										perfumes_id: updatedAlbum.perfumes_id,
									};
								}
								return album;
							});
						});
					}
				},
			)
			.addCase(
				togglePerfumeToAlbum.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload || "Failed to toggle perfume in album";
				},
			)
			.addCase(toggleLikeAlbum.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				toggleLikeAlbum.fulfilled,
				(
					state,
					action: PayloadAction<{
						id: string;
						likes: string[];
						isLiked: boolean;
					}>,
				) => {
					state.loading = false;

					// If the album exists in state, update its likes array
					if (state.albums) {
						state.albums = state.albums.map((album) => {
							if (album.id === action.payload.id) {
								return {
									...album,
									likes: action.payload.likes,
								};
							}
							return album;
						});
					}
				},
			)
			.addCase(
				toggleLikeAlbum.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload || "Failed to toggle album like";
				},
			)
			.addCase(addPerfumeToBasket.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				addPerfumeToBasket.fulfilled,
				(state, action: PayloadAction<Basket>) => {
					state.loading = false;
					if (state.basket) {
						const existingIndex = state.basket.findIndex(
							(item) => item.id === action.payload.id,
						);
						if (existingIndex !== -1) {
							state.basket[existingIndex] = action.payload;
						} else {
							state.basket = [...state.basket, action.payload];
						}
					}
				},
			)
			.addCase(addPerfumeToBasket.rejected, (state) => {
				state.loading = false;
				state.error = "Failed to toggle album like";
			})
			.addCase(removePerfumeFromBasket.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				removePerfumeFromBasket.fulfilled,
				(state, action: PayloadAction<string>) => {
					state.loading = false;
					if (state.basket) {
						state.basket = state.basket.filter(
							(item) => item.id !== action.payload,
						);
					}
				},
			)
			.addCase(
				removePerfumeFromBasket.rejected,
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error =
						action.payload ||
						"Failed to remove perfume from basket";
				},
			);
	},
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
