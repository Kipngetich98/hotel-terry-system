import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Settings: React.FC = () => {
  const { isOffline } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'system'>('profile');
  
  const demoUsers = [
    { id: 1, fullName: 'Admin User', email: 'admin@example.com', role: 'admin', isActive: true },
    { id: 2, fullName: 'Manager User', email: 'manager@example.com', role: 'manager', isActive: true },
    { id: 3, fullName: 'Staff User', email: 'staff@example.com', role: 'staff', isActive: true },
    { id: 4, fullName: 'Accountant User', email: 'accountant@example.com', role: 'accountant', isActive: true },
    { id: 5, fullName: 'Inactive User', email: 'inactive@example.com', role: 'staff', isActive: false },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className={`px-3 py-1 rounded-full text-white text-sm ${isOffline ? 'bg-warning' : 'bg-success'}`}>
          {isOffline ? 'Offline Mode' : 'Online'}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-light hover:text-text hover:border-gray-300'
            }`}
          >
            System Settings
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium">Profile Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text-light">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={user?.fullName || ''}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-light">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  defaultValue={user?.email || ''}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-light">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                  value={user?.role || ''}
                  disabled
                />
              </div>
            </div>
            
            <div className="pt-5">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-text-light">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-text-light">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-5 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-medium">User Management</h2>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Add User
              </button>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demoUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text capitalize">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark mr-3">Edit</button>
                      <button className="text-danger hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium">System Settings</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium">Restaurant Information</h3>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-text-light">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      id="restaurantName"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      defaultValue="AUNTY'S COMFORT FOOD LIMITED"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-light">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      defaultValue="+254 700 000000"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-text-light">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      defaultValue="Nairobi, Kenya"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-md font-medium">Payment Settings</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label htmlFor="mpesaPaybill" className="block text-sm font-medium text-text-light">
                      M-Pesa Paybill Number
                    </label>
                    <input
                      type="text"
                      id="mpesaPaybill"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      defaultValue="123456"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-light">
                      Enabled Payment Methods
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="mpesa"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="mpesa" className="ml-2 block text-sm text-text">
                          M-Pesa
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="cash"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="cash" className="ml-2 block text-sm text-text">
                          Cash
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="card"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="card" className="ml-2 block text-sm text-text">
                          Card
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-md font-medium">Tax Settings</h3>
                <div className="mt-2">
                  <label htmlFor="taxRate" className="block text-sm font-medium text-text-light">
                    VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    defaultValue="16"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-5 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
