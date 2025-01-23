import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

// Simulated login function
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;