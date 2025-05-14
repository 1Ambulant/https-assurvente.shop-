import React from 'react';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';

interface NavbarProps {
  openSidebar: () => void;
  userName: string;
  userRole: UserRole;
}

const Navbar: React.FC<NavbarProps> = ({ openSidebar, userName, userRole }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button 
              className="px-4 text-gray-500 md:hidden" 
              onClick={openSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">secursales.shop</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button className="p-1 mr-4 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
            </div>

            <div className="relative ml-3">
              <div className="flex items-center">
                <div className="hidden md:flex md:flex-col md:items-end md:mr-4">
                  <span className="text-sm font-medium text-gray-900">{userName}</span>
                  <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                </div>
                
                <div className="relative">
                  <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </button>
                  
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 inline mr-2" />
                      Settings
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;