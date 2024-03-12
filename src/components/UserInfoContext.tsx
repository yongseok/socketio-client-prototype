import React, { createContext, useContext, useState } from 'react';

interface UserInfoContextType {
  userId: string;
  setUserId: (userId: string) => void;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined
);

interface UserInfoProviderProps {
  children: React.ReactNode;
}

export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({
  children,
}) => {
  const [userId, setUserId] = useState('');

  return (
    <UserInfoContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = (): UserInfoContextType => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
};
