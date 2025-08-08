import { validate } from 'validate.js';

// Configuration des messages en français
validate.validators.presence.message = "est requis";
validate.validators.email.message = "n'est pas une adresse email valide";
validate.validators.length.wrongLength = "doit contenir exactement %{count} caractères";
validate.validators.length.tooShort = "doit contenir au moins %{count} caractères";
validate.validators.length.tooLong = "doit contenir au maximum %{count} caractères";
validate.validators.numericality.notValid = "doit être un nombre valide";
validate.validators.numericality.notInteger = "doit être un nombre entier";
validate.validators.numericality.notGreaterThan = "doit être supérieur à %{count}";
validate.validators.numericality.notGreaterThanOrEqualTo = "doit être supérieur ou égal à %{count}";
validate.validators.numericality.notEqualTo = "ne doit pas être égal à %{count}";
validate.validators.numericality.notLessThan = "doit être inférieur à %{count}";
validate.validators.numericality.notLessThanOrEqualTo = "doit être inférieur ou égal à %{count}";

interface Constraints {
    [key: string]: {
        presence?: { allowEmpty: boolean; message?: string };
        format?: { pattern: RegExp; message: string; flags?: string };
        email?: { message?: string } | boolean;
        length?: { minimum?: number; maximum?: number; is?: number; message?: string };
        numericality?: { message?: string; onlyInteger?: boolean };
    };
}

export const validateString = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined; // Pas d'erreur pour les champs vides lors de la saisie
    }

    // Validation spécifique par type de champ
    if (id === 'phoneNumber') {
        // Validation du numéro de téléphone
        const phonePattern = /^(\+|00)?[0-9\s\-\(\)]+$/;
        if (!phonePattern.test(value)) {
            return "Numéro de téléphone invalide";
        }
        // Vérifier la longueur minimale
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 8) {
            return "Le numéro doit contenir au moins 8 chiffres";
        }
    } else if (id === 'fullName' || id === 'firstName' || id === 'lastName') {
        // Validation des noms
        const namePattern = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        if (!namePattern.test(value)) {
            return "Ne doit contenir que des lettres";
        }
        if (value.length < 2) {
            return "Doit contenir au moins 2 caractères";
        }
    } else if (id === 'bio' || id === 'description' || id === 'about') {
        // Validation des champs de texte long
        if (value.length < 10) {
            return "Doit contenir au moins 10 caractères";
        }
    } else if (id === 'address' || id === 'street' || id === 'addressLine1' || id === 'addressLine2') {
        // Validation des adresses
        if (value.length < 5) {
            return "L'adresse doit contenir au moins 5 caractères";
        }
    } else if (id === 'postalCode') {
        // Validation du code postal
        const postalPattern = /^[0-9A-Z\s\-]+$/i;
        if (!postalPattern.test(value)) {
            return "Code postal invalide";
        }
    }

    return undefined;
};

export const validateEmail = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    const constraints: Constraints = {
        [id]: {
            email: {
                message: "Adresse email invalide"
            }
        }
    };

    const validationResult = validate({ [id]: value }, constraints);
    return validationResult && validationResult[id]?.[0];
};

export const validatePassword = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    // Validation personnalisée du mot de passe
    if (value.length < 6) {
        return "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Pour confirmPassword, vérifier la correspondance
    if (id === 'confirmPassword' || id === 'confirmNewPassword') {
        // Cette vérification devrait être faite dans le composant avec les deux valeurs
        return undefined;
    }

    return undefined;
};

export const validateNumber = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    // Vérifier si c'est un nombre valide
    if (isNaN(Number(value))) {
        return "Doit être un nombre valide";
    }

    return undefined;
};

export const validateCreditCardNumber = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    // Accepter les formats avec ou sans tirets
    const cardPattern = /^(?:\d{4}-){3}\d{4}$|^\d{16}$/;
    if (!cardPattern.test(value)) {
        return "Numéro de carte invalide (format: 1234-5678-9012-3456)";
    }

    return undefined;
};
  
export const validateCVV = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    // CVV doit être 3 ou 4 chiffres
    const cvvPattern = /^[0-9]{3,4}$/;
    if (!cvvPattern.test(value)) {
        return "CVV invalide (3 ou 4 chiffres)";
    }

    return undefined;
};
  
export const validateExpiryDate = (id: string, value: string): string | undefined => {
    // Ne pas valider si la valeur est vide
    if (!value || value.trim() === '') {
        return undefined;
    }

    // Format MM/YY
    const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryPattern.test(value)) {
        return "Date invalide (format: MM/YY)";
    }

    // Vérifier si la date n'est pas expirée
    const match = value.match(expiryPattern);
    if (match) {
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return "La carte est expirée";
        }
    }

    return undefined;
};