import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import patientsData from '@/data/patients.json';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  clinic: string;
  phone: string;
  lastVisit: string;
}

type SortField = 'name' | 'age' | 'lastVisit';
type SortOrder = 'asc' | 'desc';

interface DirectoryState {
  patients: Patient[];
  filteredPatients: Patient[];
  searchQuery: string;
  statusFilter: string;
  clinicFilter: string;
  sortField: SortField;
  sortOrder: SortOrder;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
}

const initialState: DirectoryState = {
  patients: [],
  filteredPatients: [],
  searchQuery: '',
  statusFilter: 'all',
  clinicFilter: 'all',
  sortField: 'name',
  sortOrder: 'asc',
  currentPage: 1,
  itemsPerPage: 8,
  isLoading: true,
};

const applyFiltersAndSort = (state: DirectoryState): Patient[] => {
  let result = [...state.patients];

  // Search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.clinic.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (state.statusFilter !== 'all') {
    result = result.filter((p) => p.status === state.statusFilter);
  }

  // Clinic filter
  if (state.clinicFilter !== 'all') {
    result = result.filter((p) => p.clinic === state.clinicFilter);
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0;
    switch (state.sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'age':
        comparison = a.age - b.age;
        break;
      case 'lastVisit':
        comparison = new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        break;
    }
    return state.sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
};

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    fetchPatientsStart: (state) => {
      state.isLoading = true;
    },
    fetchPatientsSuccess: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      state.filteredPatients = applyFiltersAndSort(state);
      state.isLoading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      state.filteredPatients = applyFiltersAndSort(state);
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
      state.filteredPatients = applyFiltersAndSort(state);
    },
    setClinicFilter: (state, action: PayloadAction<string>) => {
      state.clinicFilter = action.payload;
      state.currentPage = 1;
      state.filteredPatients = applyFiltersAndSort(state);
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      if (state.sortField === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortOrder = 'asc';
      }
      state.filteredPatients = applyFiltersAndSort(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  setSearchQuery,
  setStatusFilter,
  setClinicFilter,
  setSortField,
  setCurrentPage,
} = directorySlice.actions;

export const fetchPatients = () => (dispatch: any) => {
  dispatch(fetchPatientsStart());
  
  setTimeout(() => {
    dispatch(fetchPatientsSuccess(patientsData.patients));
  }, 500);
};

export default directorySlice.reducer;
