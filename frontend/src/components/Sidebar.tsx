import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['staff', 'manager', 'admin', 'accountant'] },
    { path: '/pos', label: 'Point of Sale', icon: '💰', roles: ['staff', 'manager', 'admin'] },
    { path: '/inventory', label: 'Inventory', icon: '📦', roles: ['manager', 'admin'] },
    { path: '/accounting', label: 'Accounting', icon: '📝', roles: ['accountant', 'admin'] },
    { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin'] },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white border-r shadow-sm transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center justify-center h-16 border-b ${isOpen ? 'px-4' : 'px-2'}`}>
          {isOpen ? (
            <h1 className="text-lg font-bold text-primary truncate">AUNTY'S COMFORT</h1>
          ) : (
            <h1 className="text-xl font-bold text-primary">AC</h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              if (!user || !item.roles.includes(user.role)) {
                return null;
              }

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center py-2 px-4 ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-text hover:bg-gray-100'
                      } ${!isOpen && 'justify-center'}`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    {isOpen && <span className="ml-3">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {user && (
          <div className={`p-4 border-t ${!isOpen && 'text-center'}`}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user.fullName.charAt(0)}
              </div>
              {isOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-text-light truncate capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
