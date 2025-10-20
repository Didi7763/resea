import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface SocialButtonV2Props {
    title: string;
    icon: string;
    onPress: () => void;
    iconStyles?: StyleProp<ImageStyle>;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const SocialButtonV2: React.FC<SocialButtonV2Props> = ({ title, icon, onPress, iconStyles, style, disabled }) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    borderColor: dark ? COLORS.dark2 : COLORS.grayscale200,
                    opacity: disabled ? 0.6 : 1,
                },
                style
            ]}>
            <Image
                source={icon as ImageSourcePropType}
                resizeMode='contain'
                style={[styles.icon, iconStyles]}
            />
            <Text style={[
                styles.title,
                { color: dark ? COLORS.white : COLORS.black }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        height: 54,
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 22,
        borderRadius: 16,
        borderColor: "gray",
        borderWidth: 1,
        flexDirection: "row",
        marginTop: 12,
    } as ViewStyle,
    icon: {
        height: 24,
        width: 24,
        marginRight: 32,
    } as ImageStyle,
    title: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.black,
    } as TextStyle,
});

export default SocialButtonV2;