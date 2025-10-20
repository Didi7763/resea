# 📱 Guide de dépannage iPhone - REASA

## 🚨 Problème : "Could not connect to the server" sur iPhone

### 📋 Solutions par ordre de priorité

#### ✅ **Solution 1 : Connexion manuelle (Le plus simple)**

1. **Ouvrez Expo Go** sur votre iPhone
2. **Appuyez sur l'onglet "Projects"**
3. **Tapez "Enter URL manually"**
4. **Saisissez cette URL exacte** : 
   ```
   exp://192.168.1.82:8081
   ```
5. **Appuyez sur "Connect"**

#### ✅ **Solution 2 : Vérification du réseau**

1. **Vérifiez que votre iPhone et PC sont sur le même WiFi**
2. **Désactivez temporairement les VPN** sur les deux appareils
3. **Redémarrez votre routeur WiFi** si nécessaire
4. **Essayez de pinguer votre PC depuis l'iPhone** :
   - Ouvrez Safari sur iPhone
   - Allez sur `http://192.168.1.82:8081`
   - Vous devriez voir la page Metro

#### ✅ **Solution 3 : Tunnel Cloudflare (Alternative)**

Si les solutions précédentes ne marchent pas :

1. **Installez Cloudflare Tunnel** :
   ```bash
   npm install -g @cloudflare/cli
   ```

2. **Démarrez avec tunnel** :
   ```bash
   npx expo start --tunnel
   ```

#### ✅ **Solution 4 : TestFlight (Recommandé pour test final)**

Pour une expérience native complète :

1. **Build iOS avec EAS** :
   ```bash
   npx eas build --platform ios --profile preview
   ```

2. **Suivez les étapes de configuration Apple Developer**

3. **Téléchargez via TestFlight**

### 🔧 **Solution temporaire : Simulateur iOS**

Si vous avez un Mac, utilisez le simulateur :

1. **Installez Xcode** sur votre Mac
2. **Ouvrez le simulateur iOS** 
3. **Démarrez Expo** avec :
   ```bash
   npx expo start --ios
   ```

### 🆘 **Si rien ne fonctionne**

1. **Utilisez la version web** sur Safari iPhone :
   - Allez sur `http://192.168.1.82:8081` dans Safari
   - L'expérience sera similaire à l'app

2. **Partagez l'APK Android** pour tester les fonctionnalités

3. **Construisez une version production** quand vous êtes prêt

### ⚡ **Conseils rapides**

- ✅ **PC et iPhone sur même WiFi**
- ✅ **Pas de VPN actif**
- ✅ **Firewall Windows désactivé temporairement**
- ✅ **Expo Go à jour sur iPhone**

### 📞 **URLs à tester manuellement**

1. **Metro Bundler** : `http://192.168.1.82:8081`
2. **Expo URL** : `exp://192.168.1.82:8081`
3. **Local** : `exp://127.0.0.1:8081` (ne marchera pas pour iPhone)

---

💡 **La solution 1 (connexion manuelle) résout 90% des cas !**

