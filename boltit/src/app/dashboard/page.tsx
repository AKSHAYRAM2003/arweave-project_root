"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserPolicies, getUserClaims } from "@/lib/arweave/query";

export default function Dashboard() {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isRegistered, 
    walletAddress, 
    username,
    isLoading: authLoading, 
    disconnectWallet 
  } = useAuth();

  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!authLoading && isAuthenticated && !isRegistered) {
      router.push('/register');
    }
  }, [isAuthenticated, isRegistered, authLoading, router]);

  // Load user data if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && isRegistered && walletAddress) {
        setIsLoading(true);
        try {
          // Load user policies
          const userPolicies = await getUserPolicies(walletAddress);
          setPolicies(userPolicies || []);
          
          // Load user claims
          const userClaims = await getUserClaims(walletAddress);
          setClaims(userClaims || []);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, isRegistered, walletAddress]);

  const handleLogout = async () => {
    await disconnectWallet();
    router.push('/');
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If authenticated and registered, show dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-black/50 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl">BoltIt</span>
            </Link>
            
            <div className="hidden md:flex space-x-6 items-center">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2 py-1 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`px-2 py-1 ${activeTab === 'policies' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Policy Vault
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-2 py-1 ${activeTab === 'claims' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Claims
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-2 py-1 ${activeTab === 'timeline' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Timeline
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block bg-gray-800 rounded-full px-4 py-1 text-sm">
                <span className="font-mono">{walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}</span>
              </div>
              <div className="relative group">
                <button className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm font-medium">{username || "User"}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{walletAddress}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between">
        <button
          onClick={() => setActiveTab('overview')}
          className={`text-sm px-2 py-1 ${activeTab === 'overview' ? 'bg-blue-500/20 text-blue-400 rounded' : 'text-gray-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`text-sm px-2 py-1 ${activeTab === 'policies' ? 'bg-blue-500/20 text-blue-400 rounded' : 'text-gray-400'}`}
        >
          Policies
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`text-sm px-2 py-1 ${activeTab === 'claims' ? 'bg-blue-500/20 text-blue-400 rounded' : 'text-gray-400'}`}
        >
          Claims
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`text-sm px-2 py-1 ${activeTab === 'timeline' ? 'bg-blue-500/20 text-blue-400 rounded' : 'text-gray-400'}`}
        >
          Timeline
        </button>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {username || "User"}</h1>
          <p className="text-gray-400">Manage your insurance documents securely on Arweave</p>
        </div>
        
        {/* Tab content */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats card - Policies */}
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Policy Vault</h3>
                    <p className="text-xs text-gray-400">Store insurance policies permanently</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{policies.length}</p>
                    <p className="text-sm text-gray-400">Policies stored</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('policies')}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Stats card - Claims */}
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">ClaimProof</h3>
                    <p className="text-xs text-gray-400">Evidence for insurance claims</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{claims.length}</p>
                    <p className="text-sm text-gray-400">Claims filed</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('claims')}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    View Claims
                  </button>
                </div>
              </div>

              {/* Stats card - Interactions */}
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">ClaimTracker</h3>
                    <p className="text-xs text-gray-400">Chronological interactions</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-400">Interactions</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('timeline')}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                  >
                    View Timeline
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-colors text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium">Upload Policy</h3>
                  <p className="text-xs text-gray-400 mt-1">Store a new insurance policy</p>
                </button>

                <button className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-colors text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium">New Claim Evidence</h3>
                  <p className="text-xs text-gray-400 mt-1">Add evidence for a claim</p>
                </button>

                <button className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-colors text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium">Log Interaction</h3>
                  <p className="text-xs text-gray-400 mt-1">Record communication</p>
                </button>

                <button className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-800 transition-colors text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium">Verify Document</h3>
                  <p className="text-xs text-gray-400 mt-1">Check document authenticity</p>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400">Loading your activity...</p>
                  </div>
                ) : (
                  <div className="p-6">
                    {policies.length === 0 && claims.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                          Start by uploading an insurance policy or creating a new claim to see your activity here.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-800">
                        {/* We would map through activity items here */}
                        <li className="py-4">
                          <p className="text-gray-400 text-sm">Your recent activity will appear here.</p>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'policies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Policy Vault</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload New Policy
              </button>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-400">Loading your policies...</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Policies Found</h3>
                  <p className="text-gray-400 max-w-sm mx-auto mb-6">
                    You haven't uploaded any insurance policies yet. Upload a policy to get started.
                  </p>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm">
                    Upload Your First Policy
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Insurer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Stored</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {policies.map((policy, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {policy.tags?.find((t: any) => t.name === "Policy-Name")?.value || "Unnamed Policy"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {policy.tags?.find((t: any) => t.name === "Insurer")?.value || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {policy.block?.timestamp 
                              ? new Date(policy.block.timestamp * 1000).toLocaleDateString() 
                              : "Pending confirmation"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-xs text-gray-400">
                            {policy.id?.substring(0, 8)}...{policy.id?.substring(policy.id.length - 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                            <a 
                              href={`https://viewblock.io/arweave/tx/${policy.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-300"
                            >
                              Explorer
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'claims' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">ClaimProof</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Claim
              </button>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-400">Loading your claims...</p>
                </div>
              ) : claims.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Claims Found</h3>
                  <p className="text-gray-400 max-w-sm mx-auto mb-6">
                    You haven't created any insurance claims yet. Create a claim to get started.
                  </p>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm">
                    Create Your First Claim
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claim Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Filed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {/* Claims would be mapped here */}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">ClaimTracker Timeline</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Interaction
              </button>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Timeline Coming Soon</h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-6">
                  This feature is under development. Soon you'll be able to record and track all your interactions with insurance companies.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2025 BoltIt. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}