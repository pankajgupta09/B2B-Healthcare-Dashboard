import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dashboardData from '@/data/dashboard.json';

interface DashboardStats {
  patients: number;
  doctors: number;
  appointments: number;
  clinics: number;
}

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface DashboardState {
  stats: DashboardStats;
  recentActivity: Activity[];
  isLoading: boolean;
}

const initialState: DashboardState = {
  stats: {
    patients: 0,
    doctors: 0,
    appointments: 0,
    clinics: 0,
  },
  recentActivity: [],
  isLoading: true,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.isLoading = true;
    },
    fetchDashboardSuccess: (state, action: PayloadAction<{ stats: DashboardStats; recentActivity: Activity[] }>) => {
      state.stats = action.payload.stats;
      state.recentActivity = action.payload.recentActivity;
      state.isLoading = false;
    },
  },
});

export const { fetchDashboardStart, fetchDashboardSuccess } = dashboardSlice.actions;

export const fetchDashboard = () => (dispatch: any) => {
  dispatch(fetchDashboardStart());
  
  // Simulate API delay
  setTimeout(() => {
    dispatch(fetchDashboardSuccess({
      stats: dashboardData.stats,
      recentActivity: dashboardData.recentActivity,
    }));
  }, 600);
};

export default dashboardSlice.reducer;
