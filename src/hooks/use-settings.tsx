
"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type { ISettings } from '@/models/Setting';
import type { ICategory } from '@/models/Category';

interface SettingsContextType {
  settings: ISettings;
  categories: ICategory[];
  updateSettings: (newSettings: Partial<ISettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ 
    children, 
    initialSettings, 
    initialCategories 
}: { 
    children: ReactNode, 
    initialSettings: ISettings, 
    initialCategories: ICategory[] 
}) => {
  const [settings, setSettings] = useState<ISettings>(initialSettings);

  const updateSettings = useCallback((newSettings: Partial<ISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, categories: initialCategories, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
