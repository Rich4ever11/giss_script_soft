import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const GeoDataContextProv = createContext<any>({});

export function GeoDataContext({ children }: { children: React.ReactNode }) {
  const [netcdfData, setNetcdfData] = useState({});
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    console.log(netcdfData);
  }, [netcdfData]);

  const value: any = {
    netcdfData,
    setNetcdfData,
  };

  return (
    <GeoDataContextProv.Provider value={value}>
      {children}
    </GeoDataContextProv.Provider>
  );
}

export function useGeoData() {
  return useContext(GeoDataContextProv);
}
