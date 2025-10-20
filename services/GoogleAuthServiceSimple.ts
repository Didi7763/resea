import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { GOOGLE_AUTH_CONFIG } from '../constants/auth';

// Interface pour les données utilisateur Google
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  success: boolean;
  user?: GoogleUser;
  error?: string;
  accessToken?: string;
}

class GoogleAuthServiceSimple {
  private static instance: GoogleAuthServiceSimple;

  private constructor() {
    // Initialiser WebBrowser pour l'authentification
    WebBrowser.maybeCompleteAuthSession();
  }

  public static getInstance(): GoogleAuthServiceSimple {
    if (!GoogleAuthServiceSimple.instance) {
      GoogleAuthServiceSimple.instance = new GoogleAuthServiceSimple();
    }
    return GoogleAuthServiceSimple.instance;
  }

  // Obtenir le CLIENT_ID approprié selon la plateforme
  private getClientId(): string {
    switch (Platform.OS) {
      case 'android':
        return GOOGLE_AUTH_CONFIG.ANDROID_CLIENT_ID;
      case 'ios':
        return GOOGLE_AUTH_CONFIG.IOS_CLIENT_ID;
      case 'web':
        return GOOGLE_AUTH_CONFIG.WEB_CLIENT_ID;
      default:
        return GOOGLE_AUTH_CONFIG.WEB_CLIENT_ID;
    }
  }

  // Effectuer l'authentification Google
  public async signInWithGoogle(): Promise<AuthResponse> {
    try {
      
      const clientId = this.getClientId();
      const redirectUri = GOOGLE_AUTH_CONFIG.REDIRECT_URI;
      const scopes = GOOGLE_AUTH_CONFIG.SCOPES.join(' ');
      
      // Construire l'URL d'autorisation Google
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&access_type=offline` +
        `&prompt=consent`;
      
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        
        // Extraire le code d'autorisation de l'URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
          // Échanger le code contre un token d'accès
          const tokenResult = await this.exchangeCodeForToken(code);
          
          if (tokenResult.accessToken) {
            
            // Récupérer les informations de l'utilisateur
            const userInfo = await this.getUserInfo(tokenResult.accessToken);
            
            return {
              success: true,
              user: userInfo,
              accessToken: tokenResult.accessToken
            };
          } else {
            console.error('❌ Échec de l\'échange de token');
            return {
              success: false,
              error: 'Échec de l\'échange de token d\'accès'
            };
          }
        } else {
          console.error('❌ Code d\'autorisation non trouvé dans l\'URL');
          return {
            success: false,
            error: 'Code d\'autorisation non trouvé'
          };
        }
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Authentification annulée'
        };
      } else {
        console.error('❌ Erreur lors de l\'authentification:', result);
        return {
          success: false,
          error: 'Erreur lors de l\'authentification'
        };
      }
    } catch (error) {
      console.error('❌ Erreur dans signInWithGoogle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  // Échanger le code contre un token d'accès
  private async exchangeCodeForToken(code: string): Promise<{ accessToken?: string }> {
    try {
      const clientId = this.getClientId();
      const redirectUri = GOOGLE_AUTH_CONFIG.REDIRECT_URI;
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: '', // Pas de client_secret pour les applications mobiles
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        return { accessToken: data.access_token };
      } else {
        console.error('❌ Erreur lors de l\'échange de token:', response.status);
        return {};
      }
    } catch (error) {
      console.error('❌ Erreur dans exchangeCodeForToken:', error);
      return {};
    }
  }

  // Récupérer les informations de l'utilisateur depuis Google
  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const userData = await response.json();
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        given_name: userData.given_name,
        family_name: userData.family_name
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos utilisateur:', error);
      throw error;
    }
  }

  // Déconnexion
  public async signOut(): Promise<void> {
    try {
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  }
}

export default GoogleAuthServiceSimple;









