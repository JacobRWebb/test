'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Pokemon Battle</h1>
          <p className="text-gray-600">Sign in to create and battle with custom Pokemon!</p>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 
                     rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 
                     transition-colors duration-200"
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={20}
            height={20}
          />
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
}
