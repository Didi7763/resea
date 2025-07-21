import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { ScrollView } from 'react-native-virtualized-view';
import { gallery } from '../data';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const Gallery = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { colors, dark } = useTheme();
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode='contain'
                            style={[styles.backIcon, {
                                tintColor: dark ? COLORS.white : COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Gallery</Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode='contain'
                        style={[styles.moreIcon, {
                            tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const renderContent = () => {
        return (
            <View>
                <Text style={[styles.title, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Bedroom</Text>
                <FlatList
                    data={gallery.bedrooms}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={item.image}
                            resizeMode='cover'
                            style={styles.galleryImage}
                        />
                    )}
                />
                <Text style={[styles.title, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Bathroom</Text>
                <FlatList
                    data={gallery.bathrooms}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={item.image}
                            resizeMode='cover'
                            style={styles.galleryImage}
                        />
                    )}
                />
                <Text style={[styles.title, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Living Room</Text>
                <FlatList
                    data={gallery.livingrooms}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={item.image}
                            resizeMode='cover'
                            style={styles.galleryImage}
                        />
                    )}
                />
                <Text style={[styles.title, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Kitchen</Text>
                <FlatList
                    data={gallery.kitchens}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={item.image}
                            resizeMode='cover'
                            style={styles.galleryImage}
                        />
                    )}
                />
                <Text style={[styles.title, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Parking</Text>
                <FlatList
                    data={gallery.parkings}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Image
                            source={item.image}
                            resizeMode='cover'
                            style={styles.galleryImage}
                        />
                    )}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
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
    headerContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        marginBottom: 0
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    title: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.black,
        marginVertical: 16
    },
    galleryImage: {
        width: 102,
        height: 102,
        borderRadius: 16,
        marginRight: 6
    }
})

export default Gallery