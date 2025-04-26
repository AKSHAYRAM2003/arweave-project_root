"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/lib/arweave/query";

export default function Register() {
  const router = useRouter();
  const { 
    connectWallet, 
    isAuthenticated, 
    walletAddress, 
    isRegistered, 
    isLoading: authLoading,
    isArConnectInstalled
  } = useAuth();
  
  const [step, setStep] = useState(1);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Redirect if already registered
  useEffect(() => {
    if (isAuthenticated && isRegistered && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isRegistered, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleConnectWallet = async () => {
    setError("");
    setConnectingWallet(true);
    
    try {
      const address = await connectWallet();
      if (address) {
        setStep(2); // Move to profile completion step after successful connection
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while connecting your wallet.");
      console.error(error);
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    // Password strength check
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setStep(2); // Move to profile completion step
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRegistering(true);
    
    try {
      // Basic validation
      if (!formData.username) {
        setError("Username is required");
        setRegistering(false);
        return;
      }

      if (!formData.acceptTerms) {
        setError("You must accept the terms and conditions");
        setRegistering(false);
        return;
      }

      if (!walletAddress && (!formData.password || !formData.confirmPassword)) {
        setError("Password is required");
        setRegistering(false);
        return;
      }

      if (!walletAddress && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setRegistering(false);
        return;
      }

      if (walletAddress) {
        // Register with wallet
        console.log("Starting registration with wallet:", walletAddress);
        console.log("Username:", formData.username);
        
        const result = await registerUser(formData.username, walletAddress);
        console.log("Registration result:", result);
        
        if (result.success) {
          setRegistrationSuccess(true);
          setTransactionId(result.txId || "");
          
          // Wait briefly before redirecting to show success message
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          // Show the specific error message from Arweave
          setError(`Registration failed: ${result.error || "Please check browser console for details"}`);
        }
      } else {
        // Here we'd implement email registration
        // For now, show an error as we're focusing on wallet registration
        setError("Email registration not implemented yet. Please use ArConnect.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      // More detailed error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`An error occurred during registration: ${errorMessage}`);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Left Column - Registration Form */}
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
          <h1 className="text-center text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-center text-gray-400 mb-8">
            {step === 1 
              ? "Start by connecting your wallet or creating an account" 
              : "Complete your profile to get started"}
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Registration success message */}
        {registrationSuccess && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-200">
              <h3 className="font-medium mb-2">Registration Successful!</h3>
              <p className="text-sm mb-2">Your account has been successfully registered on Arweave.</p>
              <p className="text-xs">Transaction ID: <span className="font-mono break-all">{transactionId}</span></p>
              <p className="text-sm mt-2">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {!registrationSuccess && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-900/50 backdrop-blur-sm py-8 px-6 shadow rounded-xl border border-gray-800">
              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Connect Your Wallet</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      Connecting a wallet allows you to store your insurance documents permanently on Arweave.
                    </p>
                    
                    {isArConnectInstalled ? (
                      <button 
                        onClick={handleConnectWallet}
                        disabled={connectingWallet}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mb-3"
                      >
                        <span className="mr-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                            <path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </span>
                        {connectingWallet ? 'Connecting...' : 'Connect ArConnect Wallet'}
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
                    
                    <a 
                      href="https://chrome.google.com/webstore/detail/arconnect/einnioafmpimabjcddiinlhmijaionap"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Get ArConnect Extension
                    </a>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900/50 text-gray-400">Or</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium mb-4">Register with Email</h2>
                    <form onSubmit={handleEmailContinue}>
                      <div className="space-y-4">
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
                            value={formData.email}
                            onChange={handleInputChange}
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
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleRegister} className="space-y-6">
                    {walletAddress && (
                      <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        This will be publicly visible on the blockchain
                      </p>
                    </div>

                    {!walletAddress && (
                      <>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        required
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-400">
                        I agree to the{" "}
                        <a href="#" className="text-blue-500 hover:text-blue-400">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-500 hover:text-blue-400">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Storage Notice
                      </label>
                      <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700 text-xs text-gray-400">
                        <p className="mb-2">
                          Your public data will be stored permanently on the Arweave blockchain:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Username and public profile</li>
                          <li>Document verification hashes</li>
                          <li>Transaction timestamps</li>
                        </ul>
                        <p className="mt-2">
                          Private data (email, password) will be stored securely off-chain.
                        </p>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={registering}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-500/50 disabled:cursor-not-allowed"
                      >
                        {registering ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Right Column - Information */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 z-0"></div>
        <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-12">
          <div className="w-full max-w-lg">
            <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Why Choose BoltIt?</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-1">Permanent Storage</h4>
                    <p className="text-sm text-gray-400">
                      Once your documents are stored on Arweave, they remain accessible forever with a single payment.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-1">Tamper-Proof</h4>
                    <p className="text-sm text-gray-400">
                      Blockchain verification ensures your insurance documents cannot be altered after uploading.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold mb-1">Verifiable Timeline</h4>
                    <p className="text-sm text-gray-400">
                      Create an immutable record of all interactions with insurance companies for dispute resolution.
                    </p>
                  </div>
                </div>
              </div>
              
              {step === 2 && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Registration Progress</span>
                    <span className="text-sm">2/2</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}