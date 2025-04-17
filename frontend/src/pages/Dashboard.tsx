import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOffline } = useSelector((state: RootState) => state.ui);

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
          <p className="text-2xl font-bold mt-2">KES 0.00</p>
          <div className="mt-2 text-sm text-success">+0% from yesterday</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Active Orders</h3>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="mt-2 text-sm">0 preparing, 0 ready</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-text-light text-sm font-medium">Low Stock Items</h3>
          <p className="text-2xl font-bold mt-2">0</p>
          <div className="mt-2 text-sm text-warning">0 items below threshold</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-text-light">
            No recent activity to display.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
