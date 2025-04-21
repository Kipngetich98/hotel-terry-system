import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import logger from '../utils/logger';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOffline } = useSelector((state: RootState) => state.ui);
  const { orders, pendingOrders } = useSelector((state: RootState) => state.order);
  const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);
  const dispatch = useDispatch();
  
  const [todaySales, setTodaySales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [preparingOrders, setPreparingOrders] = useState(0);
  const [readyOrders, setReadyOrders] = useState(0);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime() && order.paymentStatus === 'paid';
    });
    
    const todayTotal = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    setTodaySales(todayTotal);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === yesterday.getTime() && order.paymentStatus === 'paid';
    });
    
    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    if (yesterdayTotal > 0) {
      const percentChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
      setSalesChange(Math.round(percentChange));
    } else if (todayTotal > 0) {
      setSalesChange(100); // If yesterday was 0 and today has sales, that's a 100% increase
    } else {
      setSalesChange(0);
    }
    
    const preparing = pendingOrders.filter(order => order.status === 'preparing').length;
    const ready = pendingOrders.filter(order => order.status === 'ready').length;
    
    setPreparingOrders(preparing);
    setReadyOrders(ready);
    
    const lowStock = inventoryItems.filter(item => {
      return item.quantity <= item.minimumThreshold;
    });
    
    setLowStockItems(lowStock);
    
    logger.info('Dashboard data updated', {
      todaySales,
      salesChange,
      activeOrders: pendingOrders.length,
      lowStockItems: lowStock.length
    });
  }, [orders, pendingOrders, inventoryItems]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
          {isOffline ? 'Offline Mode' : 'Online'}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold">Welcome, {user?.fullName || 'User'}!</h2>
        <p className="text-text-light mt-2">
          This is the management dashboard for AUNTY'S COMFORT FOOD LIMITED.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Today's Sales</h3>
          <p className="text-2xl font-bold mt-2">KES {todaySales.toFixed(2)}</p>
          <div className={`mt-2 text-sm ${salesChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {salesChange >= 0 ? '+' : ''}{salesChange}% from yesterday
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Active Orders</h3>
          <p className="text-2xl font-bold mt-2">{pendingOrders.length}</p>
          <div className="mt-2 text-sm">{preparingOrders} preparing, {readyOrders} ready</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Low Stock Items</h3>
          <p className="text-2xl font-bold mt-2">{lowStockItems.length}</p>
          <div className="mt-2 text-sm text-warning">{lowStockItems.length} items below threshold</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">Recent Activity</h3>
        </div>
        <div className="p-6">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Order #{order.id || index}</p>
                    <p className="text-sm text-text-light">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown date'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'paid' ? 'bg-success text-white' : 
                    order.paymentStatus === 'pending' ? 'bg-warning text-white' : 
                    'bg-danger text-white'
                  }`}>
                    {order.paymentStatus?.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-light">
              No recent activity to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
