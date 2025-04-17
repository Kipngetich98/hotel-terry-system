import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar } from '../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import OfflineIndicator from './OfflineIndicator';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { isOffline } = useSelector((state: RootState) => state.ui);
  
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        dispatch(toggleSidebar());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden" 
          onClick={handleToggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div 
        className={`flex flex-col flex-1 w-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Navbar onToggleSidebar={handleToggleSidebar} />
        
        {isOffline && (
          <div className="bg-yellow-50 border-b border-yellow-100 p-2 shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center text-yellow-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">You are currently offline. Some features may be limited.</span>
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto px-2 md:px-4">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </main>
        
        <footer className="p-4 text-center text-sm text-gray-500 border-t bg-white shadow-inner">
          <div className="container mx-auto">
            &copy; {new Date().getFullYear()} AUNTY'S COMFORT FOOD LIMITED. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
