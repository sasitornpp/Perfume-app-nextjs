import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/user";

interface UserState {
	user: User | null;
	profile: Profile | null;
}

const initialState: UserState = {
	user: null,
	profile: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<any>) => {
			state.user = action.payload;
		},
		clearUser: (state) => {
			state.user = null;
		},
		setProfile: (state, action: PayloadAction<any>) => {
			state.profile = action.payload;
		},
		clearProfile: (state) => {
			state.profile = null;
		},
	},
});

export const { setUser, setProfile, clearUser, clearProfile } =
	userSlice.actions;
export default userSlice.reducer;
