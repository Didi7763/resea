import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const COLORS = {
    primary: '#246BFD',
    secondary: '#FFD300',
    tertiary: "#6C4DDA",
    success: "#0ABE75",
    black: "#181A20",
    black2: "#1D272F",
    info: "#246BFD",
    warning: "#FACC15",
    error: "#F75555",
    disabled: "#D8D8D8",
    white: "#FFFFFF",
    secondaryWhite: "#F8F8F8",
    tertiaryWhite: "#F7F7F7",
    
    // Couleurs de base
    green: "#0ABE75",
    red: "#F75555",
    orange: "#FF9500",
    yellow: "#FFCC00",
    blue: "#246BFD",
    
    gray: "#9E9E9E",
    gray2: "#35383F",
    gray3: "#9E9E9E",
    dark1: "#000000",
    dark2: "#1F222A",
    dark3: "#35383F",
    
    // Grayscale cohérent avec alias pour compatibilité
    greyscale900: "#212121",
    greyscale800: "#424242",
    grayscale700: "#616161",
    grayscale600: "#757575",
    grayscale500: "#9E9E9E",
    grayscale400: "#BDBDBD",
    grayscale300: "#E0E0E0",
    grayscale200: "#EEEEEE",
    grayscale100: "#F5F5F5",
    
    // Alias pour compatibilité (greyscale -> grayscale)
    greyscale700: "#616161",
    greyscale600: "#757575",
    greyscale500: "#9E9E9E",
    greyscale400: "#BDBDBD",
    greyscale300: "#E0E0E0",
    greyscale200: "#EEEEEE",
    greyscale100: "#F5F5F5",
    
    // Transparences
    tansparentPrimary: "rgba(36, 107, 253, 0.08)",
    transparentSecondary: "rgba(108,77,218, .15)",
    transparentTertiary: "rgba(51, 94, 247, .1)",
    transparentRed: "rgba(255,62,61, .15)",
    transparentWhite: "rgba(255,255,255, .2)",
    transparentWhite2: "rgba(255,255,255, .5)",
    transparentPrimary: "rgba(36, 107, 253, 0.08)",
    
    // Couleurs spéciales
    blackTie: "#474747",
    grayTie: '#BCBCBC',

    // Couleurs pour notifications
    security: '#246BFD',
    card: "#FB9400",
    payment: "#6949FF",
    update: "#FF5A5F",
    account: "#1BAC4B",
    transparentSecurity: "rgba(36, 107, 253, 0.08)",
    transparentCard: "rgba(251, 148, 0, 0.08)",
    transparentPayment: "rgba(105, 73, 255, 0.08)",
    transparentUpdate: "rgba(255, 90, 95, 0.08)",
    transparentAccount: "rgba(27, 172, 75, 0.08)",
};

export const SIZES = {
    // Global SIZES
    base: 8,
    font: 14,
    radius: 30,
    padding: 8,
    padding2: 12,
    padding3: 16,

    // FONTS Sizes
    largeTitle: 50,
    h1: 36,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // App Dimensions
    width,
    height,
};

export const FONTS = {
    largeTitle: { fontFamily: 'black', fontSize: SIZES.largeTitle, lineHeight: 55, color: "black" },
    h1: { fontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 36, color: "black" },
    h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30, color: "black" },
    h3: { fontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 22, color: "black" },
    h4: { fontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 20 },
    body1: { fontFamily: 'regular', fontSize: SIZES.body1, lineHeight: 36, color: "black" },
    body2: { fontFamily: 'regular', fontSize: SIZES.body2, lineHeight: 30, color: "black" },
    body3: { fontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22, color: "black" },
    body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20, color: "black" },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;