# 🔐 Authentification Google - Documentation

## 📋 Vue d'ensemble

Cette implémentation utilise `expo-auth-session` pour gérer le flux OAuth 2.0 de Google de manière sécurisée et moderne.

## 🏗️ Architecture

### Fichiers créés/modifiés :

1. **`constants/auth.ts`** - Configuration des CLIENT_ID Google
2. **`services/GoogleAuthService.ts`** - Service principal d'authentification
3. **`hooks/useGoogleAuth.ts`** - Hook React pour gérer l'état d'authentification
4. **`app/google-auth-test.tsx`** - Page de test et démonstration
5. **`app/welcome.tsx`** - Intégration du bouton de test
6. **`app.json`** - Configuration du plugin expo-auth-session

## 🔧 Configuration

### 1. Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez un projet existant
3. Activez l'API Google+ API
4. Créez des identifiants OAuth 2.0 :
   - **Android** : `com.macdy007.reasa`
   - **iOS** : `com.macdy007.reasa`
   - **Web** : `https://auth.expo.io/@macdy007/reasa`

### 2. Configuration des CLIENT_ID

Dans `constants/auth.ts`, remplacez les CLIENT_ID par les vôtres :

```typescript
export const GOOGLE_AUTH_CONFIG = {
  ANDROID_CLIENT_ID: "VOTRE_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  IOS_CLIENT_ID: "VOTRE_IOS_CLIENT_ID.apps.googleusercontent.com", 
  WEB_CLIENT_ID: "VOTRE_WEB_CLIENT_ID.apps.googleusercontent.com",
  // ...
};
```

## 🚀 Utilisation

### Hook useGoogleAuth

```typescript
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const MyComponent = () => {
  const { user, isLoading, isAuthenticated, signIn, signOut } = useGoogleAuth();

  const handleLogin = async () => {
    await signIn();
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Bienvenue {user?.name} !</Text>
      ) : (
        <Button onPress={handleLogin} title="Se connecter avec Google" />
      )}
    </View>
  );
};
```

### Service GoogleAuthService

```typescript
import GoogleAuthService from '../services/GoogleAuthService';

const authService = GoogleAuthService.getInstance();
const result = await authService.signInWithGoogle();

if (result.success) {
  console.log('Utilisateur connecté:', result.user);
  console.log('Token d\'accès:', result.accessToken);
}
```

## 📱 Fonctionnalités

### ✅ Implémenté

1. **Flux OAuth 2.0 complet** avec `expo-auth-session`
2. **Récupération des informations utilisateur** (nom, email, photo)
3. **Gestion d'état** avec hook React personnalisé
4. **Interface utilisateur** pour afficher les informations
5. **Gestion des erreurs** et états de chargement
6. **Préparation pour le backend** avec token d'accès

### 🔄 Flux d'authentification

1. L'utilisateur clique sur "Se connecter avec Google"
2. L'écran officiel de connexion Google s'ouvre
3. L'utilisateur s'authentifie
4. Le code d'autorisation est échangé contre un token d'accès
5. Les informations utilisateur sont récupérées via l'API Google
6. L'utilisateur est connecté et les informations sont affichées

## 🔗 Intégration Backend

### Envoi des données au backend

```typescript
// Dans hooks/useGoogleAuth.ts, décommentez cette ligne :
// await sendToBackend(result.accessToken, result.user);

// Fonction d'envoi au backend :
const response = await fetch('VOTRE_BACKEND_URL/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accessToken: result.accessToken,
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      picture: result.user.picture
    }
  })
});
```

## 🧪 Test

1. Lancez l'application : `npx expo start`
2. Allez sur la page d'accueil
3. Cliquez sur "🧪 Test Auth Google"
4. Testez la connexion/déconnexion
5. Vérifiez les informations utilisateur affichées

## 🔒 Sécurité

- ✅ Utilisation de PKCE (Proof Key for Code Exchange)
- ✅ Tokens d'accès temporaires
- ✅ Validation côté serveur recommandée
- ✅ Gestion sécurisée des CLIENT_ID

## 🐛 Dépannage

### Erreurs courantes :

1. **"Invalid client"** : Vérifiez vos CLIENT_ID dans `constants/auth.ts`
2. **"Redirect URI mismatch"** : Vérifiez l'URI de redirection dans Google Cloud Console
3. **"Network error"** : Vérifiez votre connexion internet

### Logs de débogage :

Les logs détaillés sont affichés dans la console :
- 🚀 Début de l'authentification
- 📱 Ouverture de l'écran de connexion
- ✅ Code d'autorisation reçu
- 🎉 Token d'accès obtenu
- 📤 Token disponible pour le backend

## 📚 Ressources

- [Documentation expo-auth-session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google+ API](https://developers.google.com/+/api/)

## 🎯 Prochaines étapes

1. **Intégration backend** : Envoyer les données à votre serveur
2. **Persistance** : Stocker les tokens localement
3. **Gestion de session** : Maintenir la connexion entre les sessions
4. **Sécurité renforcée** : Validation côté serveur des tokens









