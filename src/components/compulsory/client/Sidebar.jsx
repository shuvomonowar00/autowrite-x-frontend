import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  ArrowLeftCircleIcon,
  Bars3Icon,
  CreditCardIcon,
  SparklesIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';
import { useSidebar } from './contexts/ClientSidebarContext';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    if (!sidebarCollapsed && isExpanded) {
      setIsExpanded(false);
    }

    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle navigation with auto-expansion
  const handleNavigation = (path) => {
    // Ensure sidebar is expanded when clicking any nav item
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
    navigate(path);
  };

  // Toggle submenu expanded state only (not the sidebar)
  const toggleSubmenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-50">
        <div
          className={`h-screen bg-gray-50 border-r border-gray-200 shadow-md flex flex-col transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-[5rem]' : 'w-[20rem]'
          }`}
        >
          {/* Logo and Toggle Section */}
          <div
            className={`flex items-center justify-between pt-[0.7rem] pb-3 ${sidebarCollapsed ? 'px-4' : 'px-6'}`}
          >
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  AutoWriteX
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className={`text-gray-500 hover:text-blue-600 transition-colors rounded-full p-2 hover:bg-white hover:shadow-sm ${sidebarCollapsed ? 'justify-center' : ''}`}
              aria-label={
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
            >
              {sidebarCollapsed ? (
                <Bars3Icon className="h-6 w-6" />
              ) : (
                // <ArrowLeftCircleIcon className="h-6 w-6" />
                <ChevronDoubleLeftIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="px-0 py-0">
            <div className="border-b border-gray-200 shadow-sm h-[1px] w-full"></div>
          </div>

          {/* Credits and Upgrade Section */}
          {!sidebarCollapsed && (
            <div className="px-3 py-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Available Credits
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Basic Plan
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        1,250 / 2,000
                      </span>
                      <span className="text-xs text-gray-500">Credits</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: '62.5%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigation('/plans-packages')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Upgrade Plan</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-grow mt-[1.5rem] px-2 py-2">
            <nav className="space-y-2">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 group relative overflow-hidden ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title="Dashboard"
              >
                <HomeIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-600 transition-colors duration-300" />
                {!sidebarCollapsed && (
                  <span className="font-medium tracking-wide">Dashboard</span>
                )}
              </button>
              <button
                onClick={() => handleNavigation('/all-post-history')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 group relative overflow-hidden ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title="All Post History"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-600 transition-colors duration-300" />
                {!sidebarCollapsed && (
                  <span className="font-medium tracking-wide">
                    All Post History
                  </span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={toggleSubmenu}
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? 'justify-center' : 'justify-between'
                  } px-4 py-3 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 group`}
                  title="Write Info Article"
                >
                  <div
                    className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <PencilIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-600 transition-colors duration-300" />
                    {!sidebarCollapsed && (
                      <span className="font-medium tracking-wide">
                        Write Info Article
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed &&
                    (isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4 text-blue-600 transition-transform duration-300" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-blue-600 transition-transform duration-300" />
                    ))}
                </button>
                {!sidebarCollapsed && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40' : 'max-h-0'}`}
                  >
                    <div className="pl-4 ml-4 border-l-2 border-blue-100 space-y-1 mt-1">
                      <button
                        onClick={() =>
                          handleNavigation('/bulk-article-generation')
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 group"
                      >
                        <DocumentTextIcon className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                        <span className="font-medium tracking-wide">
                          Bulk Article
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                {sidebarCollapsed && isExpanded && (
                  <div className="absolute left-full top-0 w-48 ml-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                    <button
                      onClick={() =>
                        handleNavigation('/bulk-article-generation')
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 group"
                    >
                      <DocumentTextIcon className="h-6 w-6 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                      <span className="font-medium tracking-wide">
                        Bulk Article
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Footer Copyright Section */}
          <div className="mt-auto px-2 py-4 border-t border-gray-200">
            <div
              className={`text-center text-xs text-gray-500 ${sidebarCollapsed ? 'px-0' : 'px-4'}`}
            >
              {!sidebarCollapsed ? (
                <>
                  <p>&copy; {currentYear} AutoWriteX. All rights reserved.</p>
                  <p className="mt-1 text-gray-500">Version 1.0.0</p>
                </>
              ) : (
                <p>&copy; {currentYear}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
