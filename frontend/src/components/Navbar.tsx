import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isOffline } = useSelector((state: RootState) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b shadow-sm h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-text hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Network Status Indicator */}
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${isOffline ? 'bg-danger' : 'bg-success'}`}></span>
          <span className="text-sm text-text-light">{isOffline ? 'Offline' : 'Online'}</span>
        </div>

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user.fullName.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user.fullName}</span>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
