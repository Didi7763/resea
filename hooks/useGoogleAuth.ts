import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import GoogleAuthServiceSimple, { GoogleUser, AuthResponse } from '../services/GoogleAuthServiceSimple';

interface UseGoogleAuthReturn {
  user: GoogleUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearUser: () => void;
}

export const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Tentative de connexion Google...');
      
      const authService = GoogleAuthServiceSimple.getInstance();
      const result: AuthResponse = await authService.signInWithGoogle();
      
      if (result.success && result.user) {
        console.log('✅ Connexion Google réussie:', result.user);
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Afficher les informations de l'utilisateur
        Alert.alert(
          'Connexion réussie ! 🎉',
          `Bienvenue ${result.user.name} !\nEmail: ${result.user.email}`,
          [{ text: 'OK' }]
        );
        
        // Ici vous pouvez envoyer le token ou l'email à votre backend
        if (result.accessToken) {
          console.log('📤 Token d\'accès disponible pour le backend:', result.accessToken);
          // await sendToBackend(result.accessToken, result.user);
        }
        
      } else {
        console.error('❌ Échec de la connexion Google:', result.error);
        Alert.alert(
          'Erreur de connexion',
          result.error || 'Une erreur est survenue lors de la connexion',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Erreur dans useGoogleAuth signIn:', error);
      Alert.alert(
        'Erreur',
        'Une erreur inattendue est survenue',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Tentative de déconnexion...');
      
      const authService = GoogleAuthServiceSimple.getInstance();
      await authService.signOut();
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Déconnexion réussie');
      Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès', [{ text: 'OK' }]);
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Erreur lors de la déconnexion', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    clearUser
  };
};

// Fonction utilitaire pour envoyer les données au backend
export const sendToBackend = async (accessToken: string, user: GoogleUser) => {
  try {
    console.log('📡 Envoi des données au backend...');
    
    // Exemple d'envoi au backend
    const response = await fetch('YOUR_BACKEND_URL/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Données envoyées au backend avec succès:', data);
      return data;
    } else {
      console.error('❌ Erreur backend:', response.status);
      throw new Error('Erreur lors de l\'envoi au backend');
    }
  } catch (error) {
    console.error('❌ Erreur dans sendToBackend:', error);
    throw error;
  }
};
