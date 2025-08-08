import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';
import Button from '@/components/Button';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const baseAmount = [
    {
        id: "1",
        amount: "5 000 FCFA"
    },
    {
        id: "2",
        amount: "10 000 FCFA"
    },
    {
        id: "3",
        amount: "20 000 FCFA"
    },
    {
        id: "4",
        amount: "50 000 FCFA"
    },
    {
        id: "5",
        amount: "100 000 FCFA"
    },
    {
        id: "6",
        amount: "150 000 FCFA"
    },
    {
        id: "7",
        amount: "200 000 FCFA"
    },
    {
        id: "8",
        amount: "300 000 FCFA"
    },
    {
        id: "9",
        amount: "500 000 FCFA"
    }
]

// Topup amount screen
const TopupAmount = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [selectedAmount, setSelectedAmount] = useState("120 000 FCFA");
    const { colors, dark } = useTheme();

    const handleAmountSelection = (amount: any) => {
        setSelectedAmount(amount);
    };
    
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Top Up E-wallet" />
                <View>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Enter the amount of top up</Text>
                    <TextInput
                        placeholder='120 000 FCFA'
                        placeholderTextColor={COLORS.primary}
                        style={[styles.input, {
                            color: COLORS.primary,
                            borderColor: dark ? COLORS.white : COLORS.primary,
                        }]}
                        value={selectedAmount}
                        onChangeText={setSelectedAmount}
                    />
                    <FlatList
                        data={baseAmount}
                        keyExtractor={item => item.id}
                        numColumns={3}
                        columnWrapperStyle={{ gap: 4 }}
                        style={{ marginVertical: 22 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.amountContainer, {
                                    borderColor: dark ? COLORS.white : COLORS.primary,
                                }]}
                                onPress={() => handleAmountSelection(item.amount)}>
                                <Text style={[styles.amount, {
                                    color: dark ? COLORS.white : COLORS.primary,
                                }]}>{item.amount}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button
                        title="Continue"
                        filled
                        onPress={() => navigation.navigate("topupmethods")}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    title: {
        fontSize: 16,
        fontFamily: "regular",
        color: COLORS.greyscale900,
        marginLeft: 12,
        marginVertical: 32,
        textAlign: "center"
    },
    input: {
        width: SIZES.width - 32,
        height: 112,
        borderRadius: 32,
        color: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        fontFamily: "extraBold",
        textAlign: "center"
    },
    amountContainer: {
        width: (SIZES.width - 48) / 3,
        height: 42,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLORS.primary,
        borderWidth: 2,
        marginBottom: 12
    },
    amount: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.primary,
        textAlign: "center"
    }
})

export default TopupAmount;