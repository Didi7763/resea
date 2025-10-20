import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleUser } from '../services/GoogleAuthService';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'facebook' | 'apple' | 'phone';
}

const AUTH_STORAGE_KEY = '@reasa_auth_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis le stockage au démarrage
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (googleUser: GoogleUser) => {
    const userData: User = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      provider: 'google'
    };

    await saveUser(userData);
    return userData;
  };

  const loginWithPhone = async (phoneNumber: string, userId: string) => {
    const userData: User = {
      id: userId,
      email: '', // Pas d'email pour l'authentification par téléphone
      name: `Utilisateur ${phoneNumber}`,
      provider: 'phone'
    };

    await saveUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedData };
    await saveUser(updatedUser);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithPhone,
    logout,
    updateUser,
    refreshUser: loadUser
  };
};

export default useAuth;

