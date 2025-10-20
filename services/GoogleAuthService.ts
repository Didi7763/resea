import * as AuthSession from 'expo-auth-session';
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

class GoogleAuthService {
  private static instance: GoogleAuthService;
  private discovery: AuthSession.DiscoveryDocument | null = null;

  private constructor() {
    // Initialiser WebBrowser pour l'authentification
    WebBrowser.maybeCompleteAuthSession();
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
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

  // Obtenir le document de découverte Google
  private async getDiscovery(): Promise<AuthSession.DiscoveryDocument> {
    if (!this.discovery) {
      this.discovery = await AuthSession.fetchDiscoveryAsync(
        'https://accounts.google.com'
      );
    }
    return this.discovery;
  }

  // Créer la requête d'authentification
  private createAuthRequest(): AuthSession.AuthRequest {
    return new AuthSession.AuthRequest({
      clientId: this.getClientId(),
      scopes: GOOGLE_AUTH_CONFIG.SCOPES,
      redirectUri: GOOGLE_AUTH_CONFIG.REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    });
  }

  // Effectuer l'authentification Google
  public async signInWithGoogle(): Promise<AuthResponse> {
    try {
      
      const discovery = await this.getDiscovery();
      const request = this.createAuthRequest();
      
      const result = await request.promptAsync(discovery);
      
      if (result.type === 'success' && result.params.code) {
        
        // Échanger le code contre un token d'accès
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.getClientId(),
            code: result.params.code,
            redirectUri: GOOGLE_AUTH_CONFIG.REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
          },
          discovery
        );

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

  // Déconnexion (optionnel - pour nettoyer les tokens)
  public async signOut(): Promise<void> {
    try {
      // Pour Google, la déconnexion se fait côté client
      // On peut nettoyer les tokens stockés localement
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  }

  // Vérifier si l'utilisateur est connecté (optionnel)
  public async isAuthenticated(): Promise<boolean> {
    try {
      // Cette méthode peut être utilisée pour vérifier si un token valide existe
      // Pour l'instant, on retourne false car on ne stocke pas encore les tokens
      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification d\'authentification:', error);
      return false;
    }
  }
}

export default GoogleAuthService;