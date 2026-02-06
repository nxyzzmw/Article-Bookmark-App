import React, { createContext, useState } from 'react';

export const SearchContext = createContext<any>(null);

export const SearchProvider = ({ children }: any) => {
  const [searchText, setSearchText] = useState('');

  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText }}
    >
      {children}
    </SearchContext.Provider>
  );
};
