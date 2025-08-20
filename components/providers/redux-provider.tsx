"use client"

import type React from "react"

import { useRef } from 'react'
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"

interface ReduxProviderProps {
  children: React.ReactNode;
  preloadedState?: any; // Use a more specific type if possible
}

export function ReduxProvider({ children, preloadedState }: ReduxProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore(preloadedState);
  }

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}