export const reducer = (state: any, action: any) => {
    const { validationResult, inputId, inputValue } = action;

    const updatedValues = {
        ...state.inputValues,
        [inputId]: inputValue,
    };

    const updatedValidities = {
        ...state.inputValidities,
        [inputId]: validationResult, // undefined = pas d'erreur, string = message d'erreur
    };

    // Un formulaire est valide si :
    // 1. Aucun champ n'a d'erreur de validation (tous undefined ou null)
    // 2. Tous les champs requis ont une valeur non vide
    
    let updatedFormIsValid = true;

    // Liste des champs requis selon le formulaire
    const requiredFields = Object.keys(state.inputValues);

    // Étape 1: Vérifier s'il y a des erreurs de validation
    for (const key in updatedValidities) {
        const validity = updatedValidities[key];
        // Si c'est une chaîne non vide, c'est un message d'erreur
        if (validity && typeof validity === 'string' && validity.length > 0) {
            updatedFormIsValid = false;
            break;
        }
    }

    // Étape 2: Vérifier que tous les champs requis ont une valeur
    if (updatedFormIsValid) {
        for (const key of requiredFields) {
            const value = updatedValues[key];
            if (!value || value.toString().trim() === '') {
                updatedFormIsValid = false;
                break;
            }
        }
    }

    return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
    };
};