import { createContext, ReactNode, useContext, useState } from "react";

interface Plant {
  id: number;
  name: string;
  description: string;
  temperature: number;
  moisture: number;
  humidity: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  imageData: string;
  imageType: string;
  imageName: string;
}

interface PlantContextType {
  plants: Plant[] | null;
  setPlants: (plants: Plant[] | null) => void;
}

export const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantContextProvider = ({children} : {children: ReactNode}) => {
    const [plants, setPlants] = useState<Plant[] | null>([]);

  return (
    <PlantContext.Provider value={{ plants, setPlants }}>
      {children}
    </PlantContext.Provider>
  );
};

// Custom hook for easier usage
export const usePlantContext = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlantContext must be used within a PlantContextProvider');
  }
  return context;
};