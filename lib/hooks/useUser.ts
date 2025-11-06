import { useState, useEffect } from "react";
import { generateUserId, generateUserColor, getUserIdentity, saveUserIdentity } from "../utils/user";

export interface User {
  id: string;
  name: string;
  color: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage
    const stored = getUserIdentity();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const createUser = (name: string) => {
    const id = generateUserId();
    const color = generateUserColor();
    const newUser = { id, name, color };

    setUser(newUser);
    saveUserIdentity(id, name, color);

    return newUser;
  };

  const updateUserName = (name: string) => {
    if (!user) return;

    const updatedUser = { ...user, name };
    setUser(updatedUser);
    saveUserIdentity(updatedUser.id, name, updatedUser.color);
  };

  return {
    user,
    isLoading,
    createUser,
    updateUserName,
  };
};
