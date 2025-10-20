# 🚀 Guide Authentification Google - REASA

## 📋 Étapes de configuration

### 1. Configuration Google Cloud Console

1. **Accédez à [Google Cloud Console](https://console.cloud.google.com/)**
2. **Créez un nouveau projet** ou sélectionnez un projet existant
3. **Activez l'API Google+ ou People API** :
   - Allez dans "API et services" > "Bibliothèque"
   - Recherchez "Google+ API" ou "People API"
   - Cliquez sur "Activer"

4. **Créez des identifiants OAuth 2.0** :
   - Allez dans "API et services" > "Identifiants"
   - Cliquez sur "Créer des identifiants" > "ID client OAuth 2.0"
   - Sélectionnez "Application Android"
   - **Nom du package** : `com.didier23.Reasa`
   - **Empreinte SHA-1** : Vous pouvez la générer avec :
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```

### 2. Configuration dans app.json

Remplacez les valeurs dans votre `app.json` :

```json
{
  "expo": {
    "extra": {
      "googleClientId": "VOTRE_VRAI_CLIENT_ID.apps.googleusercontent.com",
      "googleClientIdIOS": "VOTRE_CLIENT_ID_IOS.apps.googleusercontent.com"
    }
  }
}
```

### 3. Structure des fichiers créés

```
├── services/
│   └── GoogleAuthService.ts     # Service d'authentification Google
├── hooks/
│   └── useAuth.ts              # Hook pour gérer l'authentification
├── app/
│   └── welcome.tsx             # Page modifiée avec auth Google
└── GOOGLE_AUTH_GUIDE.md        # Ce guide
```

## 🔧 Comment ça fonctionne

### Service GoogleAuthService

- **`signInAsync()`** : Lance le processus d'authentification
- **`getUserInfo()`** : Récupère les infos de l'utilisateur
- **`signOutAsync()`** : Déconnecte l'utilisateur
- **`isConfigured()`** : Vérifie si les identifiants sont configurés

### Hook useAuth

- **`loginWithGoogle()`** : Sauvegarde l'utilisateur Google
- **`loginWithPhone()`** : Pour l'auth par téléphone
- **`logout()`** : Déconnecte et supprime les données
- **`updateUser()`** : Met à jour les infos utilisateur

## 🧪 Test de l'authentification

1. **Compilez l'APK** :
   ```bash
   npx eas build --platform android --profile preview
   ```

2. **Installez sur votre téléphone**

3. **Testez la connexion Google** :
   - Ouvrez l'app
   - Cliquez sur "Continuer avec Google"
   - Suivez le processus d'authentification

## 🔍 Données récupérées

Quand un utilisateur se connecte avec Google, vous obtenez :

```typescript
interface GoogleUser {
  id: string;           // ID unique Google
  email: string;        // Adresse email
  name: string;         // Nom complet
  picture: string;      // URL de la photo de profil
  given_name: string;   // Prénom
  family_name: string;  // Nom de famille
}
```

## 🛠️ Personnalisation

### Modifier le comportement après connexion

Dans `app/welcome.tsx`, modifiez la fonction `handleGoogleLogin()` :

```typescript
if (user) {
  // Sauvegarder l'utilisateur
  await loginWithGoogle(user);
  
  // AJOUTEZ ICI votre logique personnalisée :
  // - Envoi vers votre API backend
  // - Création de profil utilisateur
  // - Synchronisation des données
  
  // Redirection
  router.replace('/(tabs)');
}
```

### Ajouter des données personnalisées

Modifiez le hook `useAuth.ts` pour inclure plus d'informations :

```typescript
const userData: User = {
  id: googleUser.id,
  email: googleUser.email,
  name: googleUser.name,
  picture: googleUser.picture,
  provider: 'google',
  // AJOUTEZ ICI :
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  preferences: {}
};
```

## 🔐 Sécurité

1. **Ne jamais exposer vos Client IDs** dans le code source public
2. **Utilisez des variables d'environnement** pour la production
3. **Validez toujours les tokens** côté serveur
4. **Implémentez une expiration de session**

## 🐛 Dépannage

### Erreur "Configuration requise"
- Vérifiez que vous avez remplacé les Client IDs dans `app.json`

### Erreur "Invalid client"
- Vérifiez que le package name correspond exactement
- Vérifiez l'empreinte SHA-1

### L'authentification ne s'ouvre pas
- Vérifiez que `expo-web-browser` est installé
- Vérifiez que l'API Google+ est activée

## 🚀 Déploiement

Pour la production :

1. **Créez des identifiants de production** dans Google Cloud Console
2. **Utilisez EAS Secrets** pour les Client IDs :
   ```bash
   eas secret:create --scope project --name GOOGLE_CLIENT_ID --value "votre-client-id"
   ```

3. **Modifiez app.json** :
   ```json
   {
     "extra": {
       "googleClientId": "$GOOGLE_CLIENT_ID"
     }
   }
   ```

## 📞 Support

En cas de problème :
1. Vérifiez les logs de l'application
2. Consultez la documentation Expo : https://docs.expo.dev/guides/authentication/
3. Vérifiez la console Google Cloud pour les erreurs d'API

---

✅ **Votre authentification Google est maintenant prête !**

