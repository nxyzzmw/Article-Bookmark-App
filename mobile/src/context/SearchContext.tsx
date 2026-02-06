import React, { createContext, useState } from 'react';

export const SearchContext = createContext<any>(null);

export const SearchProvider = ({ children }: any) => {
  const [homeSearchText, setHomeSearchText] =
    useState('');
  const [readingSearchText, setReadingSearchText] =
    useState('');

  return (
    <SearchContext.Provider
      value={{
        homeSearchText,
        setHomeSearchText,
        readingSearchText,
        setReadingSearchText,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
