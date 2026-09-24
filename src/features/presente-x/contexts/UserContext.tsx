import React, { createContext, useContext, useEffect, useState } from "react";

export interface CurrentUser {
  id: number;
  full_name: string;
  total_points: number;
  coins_balance: number;
  current_streak: number;
  longest_streak: number;
  last_visit_date?: string | null;
}

interface UserContextValue {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("presente_x_current_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("presente_x_current_user");
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "presente_x_current_user",
        JSON.stringify(currentUser),
      );
    } else {
      localStorage.removeItem("presente_x_current_user");
    }
  }, [currentUser]);

  const clearUser = () => setCurrentUser(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const usePresenterUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("usePresenterUser must be used within UserProvider");
  }
  return context;
};
