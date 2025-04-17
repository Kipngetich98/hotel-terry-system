import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  isLoading: false,
  error: null,
  lastSyncedAt: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchMenuStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<{ items: MenuItem[]; categories: Category[] }>) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.categories = action.payload.categories;
      state.lastSyncedAt = Date.now();
      state.error = null;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload);
    },
    removeMenuItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((category) => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    },
  },
});

export const {
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
  updateMenuItem,
  addMenuItem,
  removeMenuItem,
  updateCategory,
  addCategory,
  removeCategory,
} = menuSlice.actions;

export default menuSlice.reducer;
