import React, { useState } from 'react';
import Navbar from '../../compulsory/client/Navbar';
import Sidebar from '../../compulsory/client/Sidebar';
import { useSidebar } from './contexts/ClientSidebarContext';

function MainLayout({ children }) {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="flex flex-col h-screen overflow-y-auto custom-scrollbar">
      <Navbar />
      <div className="flex flex-1 bg-[rgba(228, 227, 227, 1)]">
        <Sidebar />
        <div
          className={`px-4 flex-1 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'ml-[5rem] m' : 'ml-[20rem]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
