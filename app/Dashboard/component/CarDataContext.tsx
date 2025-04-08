import React, { createContext, useState, useCallback, ReactNode } from "react";

interface CarDataContextType {
  refreshKey: number;
  refreshData: () => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

export const CarDataContext = createContext<CarDataContextType>({
  refreshKey: 0,
  refreshData: () => {},
  sortOrder: "asc",
  setSortOrder: () => {},
});

interface CarDataProviderProps {
  children: ReactNode;
}

export const CarDataProvider: React.FC<CarDataProviderProps> = ({
  children,
}) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const refreshData = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <CarDataContext.Provider
      value={{ refreshKey, refreshData, sortOrder, setSortOrder }}
    >
      {children}
    </CarDataContext.Provider>
  );
};
