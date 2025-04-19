import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      if (action.payload.user.isActive !== false) {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
        } else {
          sessionStorage.setItem('user', JSON.stringify(action.payload.user));
          sessionStorage.setItem('token', action.payload.token);
        }
      } else {
        state.isLoading = false;
        state.error = 'Your account is inactive. Please contact an administrator.';
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      
      const storedUser = localStorage.getItem('user');
      const sessionUser = sessionStorage.getItem('user');
      
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
      
      if (sessionUser) {
        sessionStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateUser } = authSlice.actions;

export default authSlice.reducer;
