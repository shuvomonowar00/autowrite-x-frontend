import React, { createContext, useContext, useState } from 'react';

// Create a context with default values
const SidebarContext = createContext({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
});

// Provider component that wraps your app
export function SidebarProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Create the value object with state and setter
  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// Custom hook to use the sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
