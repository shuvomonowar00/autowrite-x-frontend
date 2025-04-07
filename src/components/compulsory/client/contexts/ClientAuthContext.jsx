import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../lib/api';

const ClientAuthContext = createContext(null);

export const ClientAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check client authentication
        const response = await api.get('/api/client/check-auth');
        if (response.data.authenticated) {
          setIsAuthenticated(true);

          // Fetch client user data
          try {
            const userResponse = await api.get('/api/client/check-auth');
            setUser(userResponse.data.user);
          } catch (error) {
            console.error('Error fetching client data:', error);
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const refreshUserData = async () => {
    try {
      const response = await api.get('/api/client/check-auth');
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Error refreshing client data:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ClientAuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        refreshUserData,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);
