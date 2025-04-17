import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id?: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Order {
  id?: number;
  orderNumber?: string;
  tableNumber?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: 'mpesa' | 'cash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  pendingOrders: Order[];
  isLoading: boolean;
  error: string | null;
  unsyncedOrders: Order[];
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  pendingOrders: [],
  isLoading: false,
  error: null,
  unsyncedOrders: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<{ tableNumber?: string }>) => {
      state.currentOrder = {
        tableNumber: action.payload.tableNumber,
        status: 'pending',
        items: [],
        totalAmount: 0,
        paymentStatus: 'pending',
      };
    },
    addOrderItem: (state, action: PayloadAction<OrderItem>) => {
      if (!state.currentOrder) return;
      
      const existingItemIndex = state.currentOrder.items.findIndex(
        (item) => item.menuItemId === action.payload.menuItemId
      );
      
      if (existingItemIndex !== -1) {
        state.currentOrder.items[existingItemIndex].quantity += action.payload.quantity;
        state.currentOrder.items[existingItemIndex].totalPrice = 
          state.currentOrder.items[existingItemIndex].quantity * 
          state.currentOrder.items[existingItemIndex].unitPrice;
      } else {
        state.currentOrder.items.push(action.payload);
      }
      
      state.currentOrder.totalAmount = state.currentOrder.items.reduce(
        (total, item) => total + item.totalPrice, 0
      );
    },
    removeOrderItem: (state, action: PayloadAction<number>) => {
      if (!state.currentOrder) return;
      
      state.currentOrder.items = state.currentOrder.items.filter(
        (item) => item.menuItemId !== action.payload
      );
      
      state.currentOrder.totalAmount = state.currentOrder.items.reduce(
        (total, item) => total + item.totalPrice, 0
      );
    },
    updateOrderItemQuantity: (state, action: PayloadAction<{ menuItemId: number; quantity: number }>) => {
      if (!state.currentOrder) return;
      
      const item = state.currentOrder.items.find(
        (item) => item.menuItemId === action.payload.menuItemId
      );
      
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.quantity * item.unitPrice;
        
        state.currentOrder.totalAmount = state.currentOrder.items.reduce(
          (total, item) => total + item.totalPrice, 0
        );
      }
    },
    setPaymentMethod: (state, action: PayloadAction<'mpesa' | 'cash' | 'card'>) => {
      if (!state.currentOrder) return;
      state.currentOrder.paymentMethod = action.payload;
    },
    completeOrder: (state) => {
      if (!state.currentOrder) return;
      
      state.unsyncedOrders.push({
        ...state.currentOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      state.currentOrder = null;
    },
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.pendingOrders = action.payload.filter(
        (order) => order.status !== 'delivered' && order.status !== 'cancelled'
      );
      state.error = null;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    syncUnsyncedOrders: (state, action: PayloadAction<number[]>) => {
      state.unsyncedOrders = state.unsyncedOrders.filter(
        (order, index) => !action.payload.includes(index)
      );
    },
  },
});

export const {
  createOrder,
  addOrderItem,
  removeOrderItem,
  updateOrderItemQuantity,
  setPaymentMethod,
  completeOrder,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  syncUnsyncedOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
