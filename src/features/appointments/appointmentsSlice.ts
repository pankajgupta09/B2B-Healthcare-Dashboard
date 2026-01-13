import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import appointmentsData from '@/data/appointments.json';

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'Consultation' | 'Follow-up' | 'Check-up' | 'Surgery';
  status: 'confirmed' | 'pending' | 'cancelled';
  clinic: string;
}

interface AppointmentsState {
  appointments: Appointment[];
  selectedDate: string;
  viewMode: 'daily' | 'weekly';
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  appointments: [],
  selectedDate: new Date().toISOString().split('T')[0],
  viewMode: 'daily',
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess: (state) => {
      state.appointments = appointmentsData.appointments as Appointment[];
      state.loading = false;
    },
    fetchAppointmentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'daily' | 'weekly'>) => {
      state.viewMode = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload);
      if (index !== -1) {
        state.appointments[index].status = 'cancelled';
      }
    },
  },
});

export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  setSelectedDate,
  setViewMode,
  addAppointment,
  updateAppointment,
  cancelAppointment,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
