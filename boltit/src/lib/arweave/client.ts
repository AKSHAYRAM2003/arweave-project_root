/**
 * Arweave Client
 * 
 * This module provides utilities for interacting with the Arweave network
 * including initialization, transaction management, and data retrieval.
 */

import Arweave from 'arweave';

// Initialize the Arweave client
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Define ArConnect window interface
declare global {
  interface Window {
    arweaveWallet: {
      connect: (permissions: string[], appInfo?: { name: string, logo: string }) => Promise<void>;
      disconnect: () => Promise<void>;
      getActiveAddress: () => Promise<string>;
      getAllAddresses: () => Promise<string[]>;
      getWalletNames: () => Promise<{ [addr: string]: string }>;
      sign: (transaction: any, options?: { name?: string }) => Promise<any>;
      signature: (data: Uint8Array, options?: { name?: string }) => Promise<any>;
      encrypt: (data: Uint8Array, options?: { name?: string }) => Promise<any>;
      decrypt: (data: Uint8Array, options?: { name?: string }) => Promise<any>;
      getPermissions: () => Promise<string[]>;
      getActivePublicKey: () => Promise<any>;
    };
  }
}

/**
 * Check if ArConnect wallet extension is available
 */
export const isArConnectAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.arweaveWallet !== undefined;
};

/**
 * Connect to ArConnect wallet
 * @returns The wallet address if successful
 */
export async function connectToArweave(): Promise<string | null> {
  try {
    if (!isArConnectAvailable()) {
      throw new Error('ArConnect extension not found');
    }

    // Request all necessary permissions for the app with app info
    await window.arweaveWallet.connect(
      [
        'ACCESS_ADDRESS', 
        'SIGN_TRANSACTION', 
        'SIGNATURE',
        'ACCESS_PUBLIC_KEY',
        'DISPATCH'
      ],
      {
        name: 'BoltIt', 
        logo: 'https://arweave.net/logo.png' // Replace with your actual logo URL when available
      }
    );
    
    const address = await window.arweaveWallet.getActiveAddress();
    return address;
  } catch (error) {
    console.error('Error connecting to ArConnect:', error);
    return null;
  }
}

/**
 * Disconnect from ArConnect wallet
 */
export async function disconnectFromArweave(): Promise<void> {
  try {
    if (isArConnectAvailable()) {
      await window.arweaveWallet.disconnect();
    }
  } catch (error) {
    console.error('Error disconnecting from ArConnect:', error);
  }
}

/**
 * Get current wallet address if connected
 */
export async function getCurrentAddress(): Promise<string | null> {
  try {
    if (!isArConnectAvailable()) {
      return null;
    }
    return await window.arweaveWallet.getActiveAddress();
  } catch (error) {
    console.error('Error getting active address:', error);
    return null;
  }
}

/**
 * Create and submit a transaction to Arweave
 * @param data The data to store in the transaction
 * @param tags The tags to add to the transaction
 * @returns The transaction ID if successful
 */
export async function createAndSubmitTransaction(
  data: any,
  tags: { name: string; value: string }[]
): Promise<string | null> {
  try {
    // Convert data to string if it's an object
    const dataToStore = typeof data === 'object' ? JSON.stringify(data) : data.toString();
    
    // Create the transaction
    const tx = await arweave.createTransaction({ data: dataToStore });
    
    // Add all tags
    for (const tag of tags) {
      tx.addTag(tag.name, tag.value);
    }
    
    // Sign the transaction with ArConnect
    await window.arweaveWallet.sign(tx);
    
    // Submit the transaction
    const response = await arweave.transactions.post(tx);
    
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`Transaction submission failed with status ${response.status}`);
    }
    
    return tx.id;
  } catch (error) {
    console.error('Error creating and submitting transaction:', error);
    return null;
  }
}