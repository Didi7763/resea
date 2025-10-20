export const GOOGLE_AUTH_CONFIG = {
  // CLIENT_ID depuis Google Cloud Console
  ANDROID_CLIENT_ID: "771772054586-s470ghj1hbt6andof49n34vrou5jvi9r.apps.googleusercontent.com",
  IOS_CLIENT_ID: "771772054586-5ovbaousmc1flsj6mvlnlf4lfek5n0v2.apps.googleusercontent.com",
  WEB_CLIENT_ID: "771772054586-s470ghj1hbt6andof49n34vrou5jvi9r.apps.googleusercontent.com",
  
  // URI de redirection pour Expo (changez selon votre environnement)
  // REDIRECT_URI: "https://auth.expo.io/@macdy007/reasa", // Pour production
  REDIRECT_URI: "exp://192.168.1.82:8081", // Pour tests locaux
  
  // Scopes demandés
  SCOPES: [
    "openid",
    "profile", 
    "email"
  ]
};

export const GOOGLE_AUTH_SCOPES = GOOGLE_AUTH_CONFIG.SCOPES.join(" ");
