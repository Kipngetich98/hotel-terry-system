import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  minimumThreshold: number;
  costPerUnit: number;
  supplierId: number;
  expiryDate: string | null;
  lastRestocked: string;
}

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  expectedDeliveryDate: string | null;
  receivedDate: string | null;
  notes: string | null;
}

interface InventoryState {
  items: InventoryItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
}

const initialState: InventoryState = {
  items: [],
  suppliers: [],
  purchaseOrders: [],
  isLoading: false,
  error: null,
  lastSyncedAt: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchInventoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action: PayloadAction<{
      items: InventoryItem[];
      suppliers: Supplier[];
      purchaseOrders: PurchaseOrder[];
    }>) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.suppliers = action.payload.suppliers;
      state.purchaseOrders = action.payload.purchaseOrders;
      state.lastSyncedAt = Date.now();
      state.error = null;
    },
    fetchInventoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      state.items.push(action.payload);
    },
    removeInventoryItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex((supplier) => supplier.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload);
    },
    removeSupplier: (state, action: PayloadAction<number>) => {
      state.suppliers = state.suppliers.filter((supplier) => supplier.id !== action.payload);
    },
    updatePurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.purchaseOrders.findIndex((po) => po.id === action.payload.id);
      if (index !== -1) {
        state.purchaseOrders[index] = action.payload;
      }
    },
    addPurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.purchaseOrders.push(action.payload);
    },
    removePurchaseOrder: (state, action: PayloadAction<number>) => {
      state.purchaseOrders = state.purchaseOrders.filter((po) => po.id !== action.payload);
    },
  },
});

export const {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  updateInventoryItem,
  addInventoryItem,
  removeInventoryItem,
  updateSupplier,
  addSupplier,
  removeSupplier,
  updatePurchaseOrder,
  addPurchaseOrder,
  removePurchaseOrder,
} = inventorySlice.actions;

export default inventorySlice.reducer;
