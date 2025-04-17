import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar } from '../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar onToggleSidebar={handleToggleSidebar} />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        
        <footer className="p-4 text-center text-sm text-text-light border-t">
          &copy; {new Date().getFullYear()} AUNTY'S COMFORT FOOD LIMITED. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
