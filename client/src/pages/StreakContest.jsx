// contexts/StreakContext.js
import React, { createContext, useContext } from 'react';
import useStreak from '../Components/useStreak';

const StreakContext = createContext();

export const StreakProvider = ({ children }) => {
    const streak = useStreak();
    return (
        <StreakContext.Provider value={streak}>
            {children}
        </StreakContext.Provider>
    );
};

export const useStreakContext = () => useContext(StreakContext);