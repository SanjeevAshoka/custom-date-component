import React, { createContext, useState, ReactNode, useContext } from 'react';
import { EnglishData } from './Locale/english';
import { FrenchData } from './Locale/french';
import { PolishData } from './Locale/polish';
import { GeorgianData } from './Locale/georgian';


interface AppContextType {
    data: any;
    languageUpdate: (data: string) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<{langData: any, currLang: string}>({langData: EnglishData, currLang: 'En'});
    const languageUpdate = (selectedLanguage: string)=>{
        switch(selectedLanguage){
            case 'En': setData(()=>({langData: EnglishData, currLang: 'En'}));  break;
            case 'Fr': setData(()=>({langData: FrenchData, currLang: 'Fr'})); break;
            case 'Pl': setData(()=>({langData: PolishData, currLang: 'Pl'})); break;
            case 'Gr': setData(()=>({langData: GeorgianData, currLang: 'Gr'})); break;
            default: setData(()=>({langData: EnglishData, currLang: 'En'}));  break;
        }
    }
    return (
        <AppContext.Provider value={{ data, languageUpdate }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
