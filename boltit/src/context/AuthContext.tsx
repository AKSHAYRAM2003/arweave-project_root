'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  connectToArweave, 
  disconnectFromArweave, 
  getCurrentAddress,
  isArConnectAvailable
} from '@/lib/arweave/client';
import { checkUserRegistration, getUserProfile } from '@/lib/arweave/query';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  username: string | null;
  isLoading: boolean;
  isRegistered: boolean;
  isArConnectInstalled: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
  checkRegistrationStatus: (address?: string) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  walletAddress: null,
  username: null,
  isLoading: true,
  isRegistered: false,
  isArConnectInstalled: false,
  connectWallet: async () => null,
  disconnectWallet: async () => {},
  checkRegistrationStatus: async () => false,
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isArConnectInstalled, setIsArConnectInstalled] = useState(false);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if ArConnect is installed
        const arConnectAvailable = isArConnectAvailable();
        setIsArConnectInstalled(arConnectAvailable);
        
        if (!arConnectAvailable) {
          setIsLoading(false);
          return;
        }
        
        const address = await getCurrentAddress();
        
        if (address) {
          setWalletAddress(address);
          setIsAuthenticated(true);
          
          try {
            // Check if user is registered
            const registered = await checkUserRegistration(address);
            setIsRegistered(registered);
            
            if (registered) {
              // Get user profile
              const profile = await getUserProfile(address);
              if (profile && profile.username) {
                setUsername(profile.username);
              }
            }
          } catch (error) {
            console.error('Error checking registration:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      const address = await connectToArweave();
      
      if (address) {
        setWalletAddress(address);
        setIsAuthenticated(true);
        
        // Check if user is registered
        try {
          const registered = await checkUserRegistration(address);
          setIsRegistered(registered);
          
          if (registered) {
            // Get user profile
            const profile = await getUserProfile(address);
            if (profile && profile.username) {
              setUsername(profile.username);
            }
          }
        } catch (error) {
          console.error('Error checking registration after connect:', error);
        }
      }
      
      return address;
    } catch (error) {
      console.error('Wallet connection error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await disconnectFromArweave();
      setIsAuthenticated(false);
      setWalletAddress(null);
      setUsername(null);
      setIsRegistered(false);
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check registration status
  const checkRegistrationStatus = async (address?: string): Promise<boolean> => {
    try {
      const addrToCheck = address || walletAddress;
      if (!addrToCheck) return false;
      
      const registered = await checkUserRegistration(addrToCheck);
      setIsRegistered(registered);
      return registered;
    } catch (error) {
      console.error('Registration check error:', error);
      return false;
    }
  };

  // Build the value object for the context provider
  const contextValue: AuthContextType = {
    isAuthenticated,
    walletAddress,
    username,
    isLoading,
    isRegistered,
    isArConnectInstalled,
    connectWallet,
    disconnectWallet,
    checkRegistrationStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}