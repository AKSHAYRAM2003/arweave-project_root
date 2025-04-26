"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { 
    connectWallet, 
    isAuthenticated, 
    isRegistered, 
    isLoading: authLoading, 
    isArConnectInstalled,
    walletAddress
  } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(true); // Start with wallet options shown
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated and registered
  useEffect(() => {
    if (isAuthenticated && isRegistered && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isRegistered, authLoading, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConnectWallet = async () => {
    setError("");
    setConnectingWallet(true);
    
    try {
      const address = await connectWallet();
      
      if (!address) {
        setError("Failed to connect wallet. Please try again.");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError("An error occurred while connecting your wallet.");
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Email login is not implemented yet
      setError("Email login is not implemented yet. Please use ArConnect.");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">B</span>
            </div>
            <span className="font-bold">BoltIt</span>
          </Link>
        </div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-center text-gray-400 mb-8">Log in to access your secure insurance documents</p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Authentication status */}
        {isAuthenticated && walletAddress && !isRegistered && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
              <h3 className="font-medium mb-2">Wallet Connected, But Not Registered</h3>
              <p className="text-sm mb-4">Your wallet is connected, but you need to create an account.</p>
              <Link
                href="/register"
                className="inline-block w-full text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
              >
                Register Now
              </Link>
            </div>
          </div>
        )}

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-900/50 backdrop-blur-sm py-8 px-6 shadow rounded-xl border border-gray-800">
            {!showWalletOptions ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-500/50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <p className="text-center text-sm text-gray-400 mb-4">
                  Connect your Arweave wallet to continue
                </p>
                
                {isArConnectInstalled ? (
                  <button 
                    onClick={handleConnectWallet}
                    disabled={connectingWallet || (isAuthenticated && walletAddress)}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-500/50 disabled:cursor-not-allowed"
                  >
                    {connectingWallet ? (
                      "Connecting..."
                    ) : isAuthenticated && walletAddress ? (
                      "Wallet Connected"
                    ) : (
                      <>
                        <span className="mr-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                            <path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </span>
                        Connect ArConnect
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-200 mb-2">ArConnect extension not detected</p>
                    <p className="text-xs text-gray-400">
                      To use wallet features, please install the{' '}
                      <a 
                        href="https://www.arconnect.io/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        ArConnect browser extension
                      </a>
                      .
                    </p>
                  </div>
                )}
                
                {walletAddress && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-500">Wallet Connected</h3>
                        <div className="flex items-center mt-1 text-xs text-gray-300">
                          <span className="font-mono">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <span className="text-center text-xs text-gray-500">Other options</span>
                  <a 
                    href="https://chrome.google.com/webstore/detail/arconnect/einnioafmpimabjcddiinlhmijaionap"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Get ArConnect Extension
                  </a>
                </div>
                
                <button 
                  className="w-full text-xs text-gray-400 hover:text-white"
                  onClick={() => setShowWalletOptions(false)}
                >
                  Use email & password instead
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900/50 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowWalletOptions(!showWalletOptions)}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {showWalletOptions ? "Email & Password" : "Arweave Wallet"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-blue-500 hover:text-blue-400">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Image/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 z-0"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-12">
          <div className="w-full max-w-lg">
            <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-800">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Secure Insurance Management</h3>
                <p className="text-gray-300 text-sm">
                  Your data is stored permanently and securely on the Arweave blockchain.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Tamper-proof policy storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Immutable claim evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Verified communication history</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Documents Stored</span>
                    <span>1.2M+</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}