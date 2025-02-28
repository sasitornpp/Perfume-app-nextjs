"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { type useRouter } from "next/navigation";

interface UserState {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	error: string | null;
	profileNotCreated: boolean;
}

const initialState: UserState = {
	user: null,
	profile: null,
	loading: false,
	error: null,
	profileNotCreated: false,
};

// ✅ Action: Sign In
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
		{ rejectWithValue },
	) => {
		try {
			const { error } = await supabaseClient.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw new Error(error.message);

			router.push("/survey-form");
			return true;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

// ✅ Action: Sign Up
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

// ✅ Action: Sign Out
export const logoutUser = createAsyncThunk(
	"user/logoutUser",
	async (_, { dispatch }) => {
		await supabaseClient.auth.signOut();
		dispatch(logout());
	},
);

// ✅ Action: Fetch User Data
export const fetchUserData = createAsyncThunk(
	"user/fetchUserData",
	async (_, { rejectWithValue }) => {
		try {
			const { data: user, error: userError } =
				await supabaseClient.auth.getUser();
			if (userError || !user)
				throw new Error(userError?.message || "User not found");

			const { data: profile, error: profileError } = await supabaseClient
				.from("profiles")
				.select("*")
				.eq("id", user.user.id)
				.single();

			// Handle profile errors properly
			if (profileError && profileError.code !== "PGRST116") {
				console.error("Profile fetch error:", profileError);
				return rejectWithValue(profileError.message);
			}

			if (profileError) {
				return { user, profile: null, profileNotCreated: true };
			}

			return { user, profile, profileNotCreated: false };
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

// ✅ Action: Create Profile
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

// ✅ Action: Update Profile
export const updateProfile = createAsyncThunk(
	"user/updateProfile",
	async (
		data: { columns: string; values: any },
		{ rejectWithValue, dispatch },
	) => {
		try {
			const user = (await supabaseClient.auth.getUser()).data;
			if (!user || !user.user) throw new Error("User not found");
			console.log(data);
			const { data: profileData, error: profileError } =
				await supabaseClient
					.from("profiles")
					.update({ [data.columns]: data.values })
					.eq("id", user.user.id)
					.select()
					.single();

			if (profileError)
				throw new Error(
					`Error updating profile: ${profileError.message}`,
				);

			await dispatch(fetchUserData());
			return profileData;
		} catch (error: any) {
			return rejectWithValue(error.message);
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
		updateWishlist: (
			state,
			action: PayloadAction<{ wishlist: string[] }>,
		) => {
			if (state.profile) {
				state.profile = {
					...state.profile,
					wishlist: action.payload.wishlist,
				};
			}
		},
		updateBasket: (state, action: PayloadAction<{ basket: string[] }>) => {
			if (state.profile) {
				state.profile = {
					...state.profile,
					basket: action.payload.basket,
				};
			}
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
						profileNotCreated: boolean;
					}>,
				) => {
					state.user = action.payload.user.user;
					state.profile = action.payload.profile;
					state.profileNotCreated = action.payload.profileNotCreated;
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
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.profile = null;
				state.loading = false;
				state.error = null;
				state.profileNotCreated = false;
			});
	},
});

export const { logout, updateWishlist, updateBasket } = userSlice.actions;
export default userSlice.reducer;
