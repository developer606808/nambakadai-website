import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"

export interface Store {
  id: number;
  name: string;
  slug: string;
  description: string;
  ownerId: number;
  logoUrl?: string;
  bannerUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  stateId?: number;
  cityId?: number;
  pincode?: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
}

interface User {
  id: number
  name: string
  email: string
  role: "USER" | "SELLER" | "ADMIN"
  avatar?: string
  verified?: boolean
  store?: Store | null; // Changed from stores?: any[] to store?: Store | null;
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
}

// Removed loginUser async thunk. Login will now be handled directly by next-auth's signIn function.

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch user data');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;