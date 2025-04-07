import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientAuth } from './contexts/ClientAuthContext';
import { useSidebar } from './contexts/ClientSidebarContext';
import api from '../../lib/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  PowerIcon,
  UserIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentCurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { FaFacebook, FaYoutube } from 'react-icons/fa';

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const navigate = useNavigate();
  const { user, setIsAuthenticated } = useClientAuth();
  const { sidebarCollapsed } = useSidebar(); // Get sidebar state
  const profileDropdownRef = useRef(null);

  // Get client profile data
  const profilePhoto = user?.profile_photo;
  const username = user?.username;
  const fullName =
    user?.first_name && user?.last_name
      ? user.first_name.concat(' ', user.last_name)
      : 'User Name';

  // Social/community links data
  const communityLinks = [
    {
      name: 'Community',
      icon: <UsersIcon className="h-5 w-5" />,
      href: '/community',
      textColor: 'text-indigo-600',
      hoverTextColor: 'group-hover:text-indigo-700',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      href: 'https://facebook.com/your-page',
      textColor: 'text-blue-600',
      hoverTextColor: 'group-hover:text-blue-700',
    },
    {
      name: 'YouTube',
      icon: <FaYoutube className="h-5 w-5" />,
      href: 'https://youtube.com/your-channel',
      textColor: 'text-red-600',
      hoverTextColor: 'group-hover:text-red-700',
    },
  ];

  // Navigate to pricing page
  const handleCheckPriceClick = () => {
    navigate('/plans-packages');
  };

  // Add click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    // Add event listener if dropdown is open
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await api.post('/api/client/logout');
      setIsAuthenticated(false);
      navigate('/client/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <nav className="sticky top-0 h-16 min-h-[4rem] bg-gray-50 border-b border-gray-200 shadow-sm z-50">
        <div className="h-full px-4 mx-auto flex items-center justify-between transition-all duration-300">
          {/* Left Section - Logo */}
          <div
            className={`flex-shrink-0 ${sidebarCollapsed ? 'ml-[5.2rem]' : ''}`}
          >
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                AutoWriteX
              </span>
            </Link>
          </div>

          {/* Middle Section - Community Links */}
          <div
            className={`hidden md:flex items-center justify-center space-x-2 transition-all duration-300 ${
              sidebarCollapsed ? 'mx-auto' : 'ml-[calc(20%-4rem)]'
            }`}
          >
            {communityLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : '_self'}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`
      group flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium text-sm
      transition-all duration-300 
      ${link.textColor} hover:bg-gray-100
      ${activeLink === index ? 'bg-gray-100' : ''}
    `}
                onMouseEnter={() => setActiveLink(index)}
                onMouseLeave={() => setActiveLink(null)}
              >
                <span className={`${link.textColor} ${link.hoverTextColor}`}>
                  {link.icon}
                </span>
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Plans and Packages */}
            {/* Button Design Option 01 */}
            {/* <button
              onClick={handleCheckPriceClick}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-orange-900 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-md border border-orange-200 hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <CurrencyDollarIcon className="h-4 w-4" />
              Check Pricing
            </button> */}

            {/* Button Design Option 02 */}
            <button
              onClick={handleCheckPriceClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded border border-orange-600/20 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow-orange-500/10 hover:shadow-md"
            >
              <DocumentCurrencyDollarIcon className="h-4 w-4" />
              Check Pricing
            </button>

            {/* Button Design Option 03 */}
            {/* <button
              onClick={handleCheckPriceClick}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-600 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <DocumentCurrencyDollarIcon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Check Pricing</span>
            </button> */}

            {/* Notification Bell */}
            <button className="p-2 hover:bg-gray-100 rounded-full relative group">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 animate-ping"></span>
            </button>

            {/* Mobile menu button - shows community links in dropdown on mobile */}
            <div className="md:hidden relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                onClick={() => setIsProfileOpen(false)} // Close profile menu if open
              >
                <UsersIcon className="h-6 w-6 text-gray-600" />
                <span className="sr-only">Community Links</span>
              </button>

              {/* Mobile dropdown for community links */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden">
                {communityLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={
                      link.href.startsWith('http') ? 'noopener noreferrer' : ''
                    }
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span
                      className={`text-white p-1 rounded-full ${link.color}`}
                    >
                      {link.icon}
                    </span>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Dropdown - Add ref to this container */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {/* Profile Image - Show photo if available, otherwise show icon */}
                {profilePhoto ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                        console.error('Failed to load profile image');
                      }}
                    />
                  </div>
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                )}

                {/* Toggle between ChevronDown and ChevronUp based on isProfileOpen state */}
                {isProfileOpen ? (
                  <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-blue-600">
                      @{username}
                    </div>
                    <div className="text-base font-semibold text-gray-800">
                      {fullName}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to="/client/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/client/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <PowerIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}

export default Navbar;
