"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-6 px-8 md:px-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="font-bold text-xl">B</span>
          </div>
          <span className="font-bold text-xl">BoltIt</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-400 transition">How it Works</a>
          <a href="#about" className="hover:text-blue-400 transition">About</a>
          <Link href="/login" className="px-4 py-2 bg-transparent border border-white rounded-full hover:bg-white hover:text-black transition">
            Login
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-2xl">☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-32 px-8 md:px-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Secure Your Insurance Claims Forever
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            BoltIt uses Arweave's permanent storage to provide tamper-proof insurance policy management and claim verification.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/register" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-center font-medium transition-colors">
              Create Account
            </Link>
            <a href="#learn-more" className="px-6 py-3 bg-transparent border border-blue-500 rounded-full text-center font-medium hover:bg-blue-500/10 transition-colors">
              Learn More
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 blur-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 w-full max-w-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold">Insurance Policy</h3>
                    <p className="text-xs text-gray-400">Verified on Arweave</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Policy Number</span>
                    <span className="font-mono">POL-28394</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Insurance Type</span>
                    <span>Home Insurance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500">Verified</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-xs">
                  <span className="text-gray-500">Stored permanently</span>
                  <span className="font-mono text-gray-400">0x7E9f...8A3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-8 md:px-16 bg-black/50">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Policy Vault</h3>
            <p className="text-gray-400">
              Store insurance policies permanently and securely on the Arweave blockchain. Never lose your policy documents again.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">ClaimProof</h3>
            <p className="text-gray-400">
              Create tamper-proof evidence for insurance claims with permanent timestamps and verification. No more claim disputes.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">ClaimTracker</h3>
            <p className="text-gray-400">
              Document and track all communications with insurance companies. Create a verifiable timeline for your claims.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 px-8 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Connect your wallet</h3>
                <p className="text-gray-400">Connect your Arweave wallet or create a new one to get started with BoltIt.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload your documents</h3>
                <p className="text-gray-400">Upload insurance policies and claim evidence to store them permanently on Arweave.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Access anywhere, anytime</h3>
                <p className="text-gray-400">Your documents are permanently stored and accessible from anywhere with verification links.</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-20 blur-xl"></div>
              <div className="relative bg-black/80 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
                {!imageError ? (
                  <Image 
                    src="/demo-screenshot.png" 
                    alt="BoltIt Dashboard" 
                    width={600} 
                    height={400} 
                    className="rounded-lg"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center">
                    <span>Dashboard Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-8 md:px-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to secure your insurance claims?</h2>
          <p className="text-xl mb-10 text-gray-300">
            Join BoltIt today and experience the benefits of permanent, tamper-proof insurance documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-center font-bold text-lg transition-colors">
              Get Started
            </Link>
            <Link href="/about" className="px-8 py-4 bg-transparent border border-white rounded-full text-center font-bold text-lg hover:bg-white hover:text-black transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">B</span>
            </div>
            <span className="font-bold">BoltIt</span>
          </div>
          <div className="flex gap-8 mb-6 md:mb-0">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition">How it Works</a>
            <a href="#about" className="text-gray-400 hover:text-white transition">About</a>
          </div>
          <div className="flex gap-4">
            <a href="https://twitter.com" className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="https://github.com" className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2025 BoltIt. All rights reserved. Powered by Arweave.</p>
        </div>
      </footer>
    </div>
  );
}
