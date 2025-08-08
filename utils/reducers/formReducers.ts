export const reducer = (state: any, action: any) => {
    const { validationResult, inputId, inputValue } = action;

    // Nettoyer la valeur d'entrée pour éviter les valeurs indésirables
    let cleanedValue = inputValue;
    if (typeof inputValue === 'string') {
        // Supprimer les valeurs de test automatiques communes
        const testValues = ['test', 'Test', 'TEST', 'example', 'demo'];
        if (testValues.includes(inputValue.trim())) {
            cleanedValue = '';
        }
        // Nettoyer les espaces en début et fin
        cleanedValue = inputValue.trim();
    }

    const updatedValues = {
        ...state.inputValues,
        [inputId]: cleanedValue,
    };

    const updatedValidities = {
        ...state.inputValidities,
        [inputId]: validationResult, // undefined = pas d'erreur, string = message d'erreur
    };

    // Un formulaire est valide si :
    // 1. Aucun champ n'a d'erreur de validation (tous undefined)
    // 2. Tous les champs ont une valeur non vide
    
    let updatedFormIsValid = true;

    // Étape 1: Vérifier s'il y a des erreurs de validation
    for (const key in updatedValidities) {
        const validity = updatedValidities[key];
        // Si c'est une chaîne, c'est un message d'erreur
        if (typeof validity === 'string' && validity.length > 0) {
            updatedFormIsValid = false;
            break;
        }
    }

    // Étape 2: Vérifier que tous les champs ont une valeur si pas d'erreur
    if (updatedFormIsValid) {
        for (const key in updatedValues) {
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