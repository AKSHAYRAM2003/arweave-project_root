/**
 * Arweave GraphQL Query Utilities
 * 
 * This module provides functions for querying Arweave using GraphQL,
 * specifically for user-related transactions and insurance documents.
 */

import { arweave } from './client';

/**
 * Search for transactions by wallet address and tags
 */
export async function queryTransactionsByOwnerAndTags(
  owner: string,
  tags: { name: string; values: string[] }[]
) {
  try {
    // Construct the tags part of the query
    const tagsQuery = tags
      .map(tag => `{ name: "${tag.name}", values: [${tag.values.map(v => `"${v}"`).join(', ')}] }`)
      .join(', ');
    
    // Construct the full GraphQL query
    const query = `
      query {
        transactions(
          owners: ["${owner}"],
          tags: [${tagsQuery}],
          first: 100
        ) {
          edges {
            node {
              id
              owner {
                address
              }
              tags {
                name
                value
              }
              block {
                timestamp
                height
              }
            }
          }
        }
      }
    `;
    
    // Execute the query
    const response = await arweave.api.post('/graphql', { query });
    
    if (response.status !== 200 || !response.data || !response.data.data) {
      throw new Error('Failed to query Arweave GraphQL endpoint');
    }
    
    return response.data.data.transactions.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error querying transactions:', error);
    throw error;
  }
}

/**
 * Check if a user has registered by looking for registration transactions
 */
export async function checkUserRegistration(walletAddress: string): Promise<boolean> {
  try {
    // DEVELOPMENT WORKAROUND: Check localStorage for registration status
    if (typeof window !== 'undefined' && localStorage.getItem('boltit-registered') === 'true') {
      console.log('DEV MODE: Using localStorage registration status');
      return true;
    }
    
    // Fallback to checking Arweave transactions (will be used in production)
    const tags = [
      { name: 'App-Name', values: ['BoltIt'] },
      { name: 'Action', values: ['Register'] }
    ];
    
    const transactions = await queryTransactionsByOwnerAndTags(walletAddress, tags);
    return transactions && transactions.length > 0;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
}

/**
 * Get user profile data from Arweave
 */
export async function getUserProfile(walletAddress: string) {
  try {
    // DEVELOPMENT WORKAROUND: Return stored username from localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('boltit-registered') === 'true') {
      const username = localStorage.getItem('boltit-username') || 'User';
      console.log('DEV MODE: Using localStorage for user profile');
      return {
        username,
        registeredAt: Date.now(),
        walletAddress
      };
    }
    
    // Original code - attempt to get profile from Arweave
    const tags = [
      { name: 'App-Name', values: ['BoltIt'] },
      { name: 'Action', values: ['Register'] }
    ];
    
    const transactions = await queryTransactionsByOwnerAndTags(walletAddress, tags);
    
    if (!transactions || transactions.length === 0) {
      return null;
    }
    
    // Get the most recent registration transaction
    const latestTransaction = transactions[0];
    
    // Fetch transaction data
    const txData = await arweave.transactions.getData(latestTransaction.id, { decode: true, string: true });
    
    try {
      return JSON.parse(txData as string);
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Get all insurance policies for a user
 */
export async function getUserPolicies(walletAddress: string) {
  try {
    const tags = [
      { name: 'App-Name', values: ['BoltIt'] },
      { name: 'Content-Type', values: ['Policy'] }
    ];
    
    return await queryTransactionsByOwnerAndTags(walletAddress, tags);
  } catch (error) {
    console.error('Error getting user policies:', error);
    return [];
  }
}

/**
 * Get all claims evidence for a user
 */
export async function getUserClaims(walletAddress: string) {
  try {
    const tags = [
      { name: 'App-Name', values: ['BoltIt'] },
      { name: 'Content-Type', values: ['ClaimEvidence'] }
    ];
    
    return await queryTransactionsByOwnerAndTags(walletAddress, tags);
  } catch (error) {
    console.error('Error getting user claims:', error);
    return [];
  }
}

/**
 * Get transaction data by ID
 */
export async function getTransactionData(transactionId: string) {
  try {
    const data = await arweave.transactions.getData(transactionId, { decode: true, string: true });
    try {
      return JSON.parse(data as string);
    } catch {
      return data;
    }
  } catch (error) {
    console.error('Error getting transaction data:', error);
    return null;
  }
}

/**
 * Register a new user by creating a registration transaction
 */
export async function registerUser(username: string, walletAddress: string) {
  try {
    console.log('Starting user registration for:', username, walletAddress);
    
    // Create data object with user information
    const userData = {
      username,
      registeredAt: Date.now()
    };
    
    // DEVELOPMENT WORKAROUND: Skip actual transaction for testing
    // This will let you test the UI without requiring AR tokens
    console.log('DEV MODE: Skipping actual transaction submission');
    
    // Generate a fake transaction ID for development
    const fakeTransactionId = `DEV-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Store username in localStorage to maintain state across pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('boltit-username', username);
      localStorage.setItem('boltit-registered', 'true');
    }
    
    return {
      txId: fakeTransactionId,
      success: true,
      devMode: true
    };
    
    // Note: Original transaction code is commented out for development
    /*
    // Create the transaction with proper data formatting
    const data = JSON.stringify(userData);
    console.log('Creating transaction with data:', data);
    
    // Create transaction with data as string buffer
    const tx = await arweave.createTransaction({ 
      data: arweave.utils.stringToBuffer(data)
    });
    
    // Add tags for easy querying
    tx.addTag('App-Name', 'BoltIt');
    tx.addTag('Action', 'Register');
    tx.addTag('User-Address', walletAddress);
    tx.addTag('Username', username);
    tx.addTag('Version', '1.0');
    tx.addTag('Content-Type', 'application/json');
    
    console.log('Transaction created, waiting for signature...');
    
    try {
      // Sign the transaction with ArConnect
      await window.arweaveWallet.sign(tx);
      console.log('Transaction signed successfully, submitting to network...');
      
      // Submit the transaction
      const response = await arweave.transactions.post(tx);
      console.log('Transaction submission response:', response);
      
      if (response.status === 200 || response.status === 202) {
        console.log('Registration successful, transaction ID:', tx.id);
        return { 
          txId: tx.id,
          success: true 
        };
      } else {
        throw new Error(`Transaction submission failed with status ${response.status}`);
      }
    } catch (signError) {
      console.error('Error during transaction signing or submission:', signError);
      return { 
        success: false, 
        error: signError instanceof Error ? signError.message : 'Error during transaction signing' 
      };
    }
    */
  } catch (error) {
    console.error('Error registering user:', error);
    // Provide more detailed error information
    let errorMessage = 'Unknown error during registration';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}