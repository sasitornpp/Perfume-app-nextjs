import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { supabaseClient } from "@/utils/supabase/client";

interface UserState {
  userAuth: any;
  user: User | null;
  loading: boolean;
  error: string | null;
  authentication: boolean;
}

const initialState: UserState = {
  userAuth: null,
  user: null,
  loading: false,
  error: null,
  authentication: false,
};


export const fetchAuthUser = createAsyncThunk("user/fetchAuth", async () => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || "User not found");
  }

  return user;
});


export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (userId: string) => {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as User;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuth: (state, action: PayloadAction<any>) => {
      state.userAuth = action.payload;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authentication = true;
    },

    clearUser: (state) => {
      state.user = null;
      state.authentication = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ ดึง user จาก Supabase Auth
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userAuth = action.payload;
        state.authentication = true;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch auth user";
        state.authentication = false;
      })

      // ✅ ดึงข้อมูลจาก Table `users`
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authentication = true;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
