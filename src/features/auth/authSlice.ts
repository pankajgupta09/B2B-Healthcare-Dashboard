import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import credentials from '@/data/credentials.json';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const storedAuth = localStorage.getItem('healthcare_auth');
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      return {
        isAuthenticated: true,
        user: parsed.user,
        isLoading: false,
        error: null,
      };
    } catch {
      localStorage.removeItem('healthcare_auth');
    }
  }
  return {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

interface LoginPayload {
  email: string;
  password: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('healthcare_auth', JSON.stringify({ user: action.payload }));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('healthcare_auth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export const login = (payload: LoginPayload) => (dispatch: any) => {
  dispatch(loginStart());
  
  // Simulate API delay
  setTimeout(() => {
    if (payload.email === credentials.email && payload.password === credentials.password) {
      dispatch(loginSuccess(credentials.user));
    } else {
      dispatch(loginFailure('Invalid email or password. Please try again.'));
    }
  }, 800);
};

export default authSlice.reducer;
