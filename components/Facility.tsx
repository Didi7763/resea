import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface FacilityProps {
    name: string;
    icon: ImageSourcePropType; // Type for image source
    iconColor: string;
    backgroundColor: string;
}

const Facility: React.FC<FacilityProps> = ({ name, icon, iconColor, backgroundColor }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.iconContainer, { backgroundColor }]}>
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={[styles.icon, { tintColor: iconColor }]}
                />
            </TouchableOpacity>
            {name.length > 7 ? (
                <Text style={[styles.name, { color: colors.text }]}>
                    {name.substring(0, 7)}...
                </Text>
            ) : (
                <Text style={[styles.name, { color: colors.text }]}>
                    {name}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
        width: (SIZES.width - 32) / 4,
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        height: 24,
        width: 24,
    },
    name: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.black,
    },
});

export default Facility;
