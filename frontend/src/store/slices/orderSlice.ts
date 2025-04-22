import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id?: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  customization?: {
    spiceLevel?: 'mild' | 'medium' | 'spicy' | 'extra spicy';
    cookingPreference?: 'rare' | 'medium rare' | 'medium' | 'medium well' | 'well done';
    specialInstructions?: string;
  };
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
  transactionReference?: string;
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
    updateOrderStatus: (state, action: PayloadAction<{ orderId: number; status: string }>) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.pendingOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        state.pendingOrders[orderIndex].status = status as any;
        
        if (status === 'delivered' || status === 'cancelled') {
          const completedOrder = state.pendingOrders[orderIndex];
          state.pendingOrders.splice(orderIndex, 1);
          
          if (!state.orders.some(order => order.id === orderId)) {
            state.orders.push({
              ...completedOrder,
              status: status as any,
              updatedAt: new Date().toISOString()
            });
          } else {
            const orderIdx = state.orders.findIndex(order => order.id === orderId);
            if (orderIdx !== -1) {
              state.orders[orderIdx].status = status as any;
              state.orders[orderIdx].updatedAt = new Date().toISOString();
            }
          }
        }
      }
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
    setTransactionReference: (state, action: PayloadAction<string>) => {
      if (!state.currentOrder) return;
      state.currentOrder.transactionReference = action.payload;
      state.currentOrder.paymentStatus = 'paid';
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
    setItemCustomization: (state, action: PayloadAction<{ menuItemId: number; customization: any }>) => {
      if (!state.currentOrder) return;
      
      const item = state.currentOrder.items.find(
        (item) => item.menuItemId === action.payload.menuItemId
      );
      
      if (item) {
        item.customization = action.payload.customization;
      }
    },
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      
      try {
        const savedCompletedOrders = localStorage.getItem('completedOrders');
        const completedOrderIds = savedCompletedOrders ? 
          JSON.parse(savedCompletedOrders).map((order: any) => order.id) : [];
          
        const filteredOrders = action.payload.filter(order => 
          !completedOrderIds.includes(order.id)
        );
        
        state.orders = action.payload;
        state.pendingOrders = filteredOrders.filter(
          (order) => order.status !== 'delivered' && order.status !== 'cancelled'
        );
      } catch (error) {
        console.error('Error processing completed orders from localStorage:', error);
        state.orders = action.payload;
        state.pendingOrders = action.payload.filter(
          (order) => order.status !== 'delivered' && order.status !== 'cancelled'
        );
      }
      
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
  setTransactionReference,
  completeOrder,
  setItemCustomization,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  syncUnsyncedOrders,
  updateOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
