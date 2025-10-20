import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps, Image, ImageSourcePropType } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface InputProps extends Omit<TextInputProps, 'onBlur'> {
  id: string;
  icon?: string;
  errorText?: string[];
  onInputChanged: (id: string, text: string) => void;
  onBlur?: (id: string, text: string) => void;
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const { dark } = useTheme();
  const { id, onInputChanged, value, onBlur } = props;
  const textInputRef = useRef<TextInput>(null);

  const handleFocus = useCallback(() => {
    console.log(`🎯 [${id}] FOCUS - Champ reçoit le focus`);
    setIsFocused(true);
  }, [id]);

  const handleBlur = useCallback(() => {
    console.log(`🎯 [${id}] BLUR - Champ perd le focus`);
    setIsFocused(false);
    if (onBlur && value !== undefined) {
      onBlur(id, value);
    }
  }, [id, value, onBlur]);

  const onChangeText = useCallback((text: string) => {
    console.log(`⌨️ [${id}] onChangeText appelé avec:`, text);
    onInputChanged(id, text);
  }, [id, onInputChanged]);

  const inputContainerStyle = useMemo(() => [
    styles.inputContainer,
    {
      borderColor: isFocused ? COLORS.primary : dark ? COLORS.dark2 : COLORS.grayscale200,
      backgroundColor: dark ? COLORS.dark2 : COLORS.white,
    },
  ], [isFocused, dark]);

  const iconStyle = useMemo(() => [
    styles.icon,
    {
      tintColor: isFocused ? COLORS.primary : '#BCBCBC',
    },
  ], [isFocused]);

  const inputStyle = useMemo(() => [
    styles.input, 
    { color: dark ? COLORS.white : COLORS.black }
  ], [dark]);

  return (
    <View style={styles.container}>
      <View style={inputContainerStyle}>
        {props.icon && (
          <Image
            source={props.icon as ImageSourcePropType}
            style={iconStyle}
          />
        )}
        <TextInput
          ref={ref || textInputRef}
          {...props}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputStyle}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor || (dark ? COLORS.grayscale400 : COLORS.grayscale500)}
          autoCapitalize="none" />
      </View>
      {props.errorText && props.errorText.length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding2,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    height: 20,
    width: 20,
    tintColor: '#BCBCBC',
  },
  input: {
    color: COLORS.black,
    flex: 1,
    fontFamily: 'regular',
    fontSize: 14,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Input;