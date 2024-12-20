'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/types/pokemon';

interface NavigationProps {
  selectedPokemon?: Pokemon[];
  onBattle?: () => void;
}

export default function Navigation({ selectedPokemon = [], onBattle }: NavigationProps) {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const navigationItems = [
    {
      id: 'pokemon',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Pokemon',
      panel: (
        <div className="p-4 space-y-4">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Browse Pokemon
          </Link>
          <Link
            href="/create"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Create Pokemon
          </Link>
        </div>
      ),
    },
    {
      id: 'battle',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Battle',
      panel: (
        <div className="p-4 space-y-4">
          {selectedPokemon.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedPokemon.length === 1
                  ? "Select one more Pokemon to battle!"
                  : "Ready to battle!"}
              </p>
              <div className="space-y-2">
                {selectedPokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                  >
                    <div className="w-8 h-8 relative">
                      <Image
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm capitalize">{pokemon.name}</span>
                  </div>
                ))}
              </div>
              {selectedPokemon.length === 2 && (
                <button
                  onClick={onBattle}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Battle!
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Select Pokemon to start a battle!
            </p>
          )}
          <Link
            href="/arena"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Battle Arena
          </Link>
        </div>
      ),
    },
    {
      id: 'profile',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Profile',
      panel: (
        <div className="p-4 space-y-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto" />
          ) : session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Icon Bar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePanel(activePanel === item.id ? null : item.id);
              setIsExpanded(true);
            }}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === item.id
                ? 'text-white bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Expandable Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 overflow-hidden"
          >
            <div className="h-full">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className={`${activePanel === item.id ? 'block' : 'hidden'}`}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.label}
                    </h2>
                    <button
                      onClick={() => {
                        setActivePanel(null);
                        setIsExpanded(false);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {item.panel}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
