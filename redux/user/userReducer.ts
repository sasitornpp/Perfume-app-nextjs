"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { type useRouter } from "next/navigation";
import { suggestedPerfume, Filters, Perfume } from "@/types/perfume";
import { fetch_user_result } from "@/types/profile";

interface UserState {
	user: User | null;
	profile: Profile | null;
	perfumes: Perfume[] | null;
	albums: any[] | null;
	basket: any[] | null;
	loading: boolean;
	error: string | null;
	profileNotCreated: boolean;
}

const initialState: UserState = {
	user: null,
	profile: null,
	perfumes: null,
	albums: null,
	basket: null,
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

			router.push("/perfumes/home");
			window.location.reload();
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
		{ rejectWithValue, dispatch, getState },
	) => {
		try {
			// Get current user from state
			const state = getState() as { user: UserState };
			const userId = state.user.user?.id;

			const { data: profileData, error: profileError } =
				await supabaseClient
					.from("profiles")
					.update({ [data.columns]: data.values })
					.eq("id", userId)
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
					columns: "suggestions_perfumes",
					values: perfumes,
				}),
			);

			return perfumes;
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
						basket?: any[] | null;
						perfumes?: Perfume[] | null;
						profileNotCreated: boolean;
					}>,
				) => {
					const {
						user,
						profile,
						albums,
						basket,
						perfumes,
						profileNotCreated,
					} = action.payload;
					state.user = user.user;
					state.profile = profile;
					state.albums = albums || null;
					state.basket = basket || null;
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
			);
	},
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
