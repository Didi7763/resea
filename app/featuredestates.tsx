import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { category, facilities, featuredEstates, ratings } from '../data';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { FontAwesome } from "@expo/vector-icons";
import VerticalEstateCard from '../components/VerticalEstateCard';
import HorizontalEstateCard from '@/components/HorizontalEstateCard';
import NotFoundCard from '@/components/NotFoundCard';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

interface CustomSliderHandleProps {
    enabled: boolean;
    markerStyle: object;
}

interface FeaturedHotelsProps {
    navigation: NavigationProp<any>;
}

interface Rating {
    id: string;
    title: string;
}

interface Category {
    id: string;
    name: string;
}

interface Facility {
    id: string,
    name: string
}
// Handler slider
const CustomSliderHandle: React.FC<CustomSliderHandleProps> = ({ enabled, markerStyle }) => {
    return (
        <View
            style={[
                markerStyle,
                {
                    backgroundColor: enabled ? COLORS.primary : 'lightgray',
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                },
            ]}
        />
    );
};

const FeaturedEstates = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const refRBSheet = useRef<any>(null);
    const { dark, colors } = useTheme();
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["1"]);
    const [selectedRating, setSelectedRating] = useState<string[]>(["1"]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 100]); // Initial price range

    const handleSliderChange = (values: number[]) => {
        if (values.length === 2) {
            setPriceRange([values[0], values[1]]);
        }
    };
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
                    <Text style={[styles.headerTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>
                        Featured
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode='contain'
                        style={[styles.moreIcon, {
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render content
    */
    const renderContent = () => {
        const [selectedTab, setSelectedTab] = useState('row');
        const [searchQuery, setSearchQuery] = useState('');
        const [filteredEstates, setFilteredEstates] = useState(featuredEstates);
        const [resultsCount, setResultsCount] = useState(0);

        useEffect(() => {
            handleSearch();
        }, [searchQuery, selectedTab]);


        const handleSearch = () => {
            const estates = featuredEstates.filter((estate) =>
                estate.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredEstates(estates);
            setResultsCount(estates.length);
        };

        return (
            <View>
                {/* Search Bar */}
                <View
                    style={[styles.searchBarContainer, {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
                    }]}>
                    <TouchableOpacity
                        onPress={handleSearch}>
                        <Image
                            source={icons.search2}
                            resizeMode='contain'
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor={COLORS.gray}
                        style={[styles.searchInput, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.filter}
                            resizeMode='contain'
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                </View>


                <View style={styles.reusltTabContainer}>
                    <Text style={[styles.tabText, {
                        color: dark ? COLORS.secondaryWhite : COLORS.black
                    }]}>{resultsCount} founds</Text>
                    <View style={styles.viewDashboard}>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedTab('column');
                                setSearchQuery(''); // Clear search query when changing tab
                            }}>
                            <Image
                                source={selectedTab === 'column' ? icons.document2 : icons.document2Outline}
                                resizeMode='contain'
                                style={styles.dashboardIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedTab('row');
                                setSearchQuery(''); // Clear search query when changing tab
                            }}>
                            <Image
                                source={selectedTab === 'row' ? icons.dashboard : icons.dashboardOutline}
                                resizeMode='contain'
                                style={styles.dashboardIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Results container  */}
                <View>
                    {/* Estates result list */}
                    <ScrollView 
                     showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                        marginVertical: 16
                    }}>
                        {resultsCount && resultsCount > 0 ? (
                            <>
                                {
                                    selectedTab === 'row' ? (
                                        <FlatList
                                            data={filteredEstates}
                                            keyExtractor={(item) => item.id}
                                            numColumns={2}
                                            columnWrapperStyle={{ gap: 16 }}
                                            renderItem={({ item }) => {
                                                return (
                                                    <VerticalEstateCard
                                                        name={item.name}
                                                        image={item.image}
                                                        rating={item.rating}
                                                        price={item.price}
                                                        location={item.location}
                                                        onPress={() => navigation.navigate("estatedetails")}
                                                    />
                                                )
                                            }}
                                        />
                                    ) : (
                                        <FlatList
                                            data={filteredEstates}
                                            keyExtractor={(item) => item.id}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => {
                                                return (
                                                    <HorizontalEstateCard
                                                        name={item.name}
                                                        image={item.image}
                                                        rating={item.rating}
                                                        price={item.price}
                                                        location={item.location}
                                                        onPress={() => navigation.navigate("estatedetails")}
                                                    />
                                                );
                                            }}
                                        />
                                    )
                                }
                            </>
                        ) : (
                            <NotFoundCard />
                        )}
                    </ScrollView>
                </View>
            </View>
        )
    }

    // Toggle category selection
    const toggleCategory = (categoryId: string) => {
        const updatedCategories = [...selectedCategories];
        const index = updatedCategories.indexOf(categoryId);

        if (index === -1) {
            updatedCategories.push(categoryId);
        } else {
            updatedCategories.splice(index, 1);
        }

        setSelectedCategories(updatedCategories);
    };


    // toggle rating selection
    const toggleRating = (ratingId: string) => {
        const updatedRatings = [...selectedRating];
        const index = updatedRatings.indexOf(ratingId);

        if (index === -1) {
            updatedRatings.push(ratingId);
        } else {
            updatedRatings.splice(index, 1);
        }

        setSelectedRating(updatedRatings);
    };

    // Function to toggle selected facility
    const toggleFacility = (facilityId: string) => {
        // Check if the facility is already selected
        if (selectedFacilities.includes(facilityId)) {
            // If selected, remove it
            setSelectedFacilities(selectedFacilities.filter(id => id !== facilityId));
        } else {
            // If not selected, add it
            setSelectedFacilities([...selectedFacilities, facilityId]);
        }
    };

    const renderFacilitiesItem = ({ item }: { item: Facility }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedFacilities.includes(item.id) ? COLORS.primary : "transparent",
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => toggleFacility(item.id)}>

            <Text style={{
                color: selectedFacilities.includes(item.id) ? COLORS.white : COLORS.primary
            }}>{item.name}</Text>
        </TouchableOpacity>
    );

    // Category item
    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedCategories.includes(item.id) ? COLORS.primary : "transparent",
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
            }}
            onPress={() => toggleCategory(item.id)}>

            <Text style={{
                color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary
            }}>{item.name}</Text>
        </TouchableOpacity>
    );


    const renderRatingItem = ({ item }: { item: Rating }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedRating.includes(item.id) ? COLORS.primary : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 6,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
                flexDirection: "row",
                alignItems: "center",
            }}
            onPress={() => toggleRating(item.id)}>
            <View style={{ marginRight: 6 }}>
                <FontAwesome name="star" size={14} color={selectedRating.includes(item.id) ? COLORS.white : COLORS.primary} />
            </View>
            <Text style={{
                color: selectedRating.includes(item.id) ? COLORS.white : COLORS.primary
            }}>{item.title}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <View>
                    {renderContent()}
                </View>
                <RBSheet
                    ref={refRBSheet}
                    closeOnPressMask={true}
                    height={580}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.dark3 : "#000",
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 580,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: "center",
                        }
                    }}
                >
                    <Text style={[styles.bottomTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Filter</Text>
                    <View style={styles.separateLine} />
                    <View style={{ width: SIZES.width - 32 }}>
                        <Text style={[styles.sheetTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Category</Text>
                        <FlatList
                            data={category}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderCategoryItem}
                        />
                        <Text style={[styles.sheetTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Filter</Text>
                        <MultiSlider
                            values={priceRange}
                            sliderLength={SIZES.width - 32}
                            onValuesChange={handleSliderChange}
                            min={0}
                            max={100}
                            step={1}
                            allowOverlap={false}
                            snapped
                            minMarkerOverlapDistance={40}
                            customMarker={CustomSliderHandle}
                            selectedStyle={{ backgroundColor: COLORS.primary }}
                            unselectedStyle={{ backgroundColor: 'lightgray' }}
                            containerStyle={{ height: 40 }}
                            trackStyle={{ height: 3 }}
                        />

                        <Text style={[styles.sheetTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Facilities</Text>

                        <FlatList
                            data={facilities}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderFacilitiesItem}
                        />

                        <Text style={[styles.sheetTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Rating</Text>
                        <FlatList
                            data={ratings}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderRatingItem}
                        />
                    </View>

                    <View style={styles.separateLine} />

                    <View style={styles.bottomContainer}>
                        <Button
                            title="Reset"
                            style={{
                                width: (SIZES.width - 32) / 2 - 8,
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => refRBSheet.current.close()}
                        />
                        <Button
                            title="Filter"
                            filled
                            style={styles.logoutButton}
                            onPress={() => refRBSheet.current.close()}
                        />
                    </View>
                </RBSheet>
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
        marginBottom: 16
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
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "regular",
        marginHorizontal: 8
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    tabContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        justifyContent: "space-between"
    },
    tabBtn: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLORS.primary
    },
    selectedTab: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLORS.primary
    },
    tabBtnText: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.primary,
        textAlign: "center"
    },
    selectedTabText: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.white,
        textAlign: "center"
    },
    resultContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
    },
    subResult: {
        fontSize: 14,
        fontFamily: "semiBold",
        color: COLORS.primary
    },
    resultLeftView: {
        flexDirection: "row"
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        paddingHorizontal: 16,
        width: SIZES.width
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "semiBold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    separateLine: {
        height: .4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.black,
        marginVertical: 12
    },
    reusltTabContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        justifyContent: "space-between"
    },
    viewDashboard: {
        flexDirection: "row",
        alignItems: "center",
        width: 36,
        justifyContent: "space-between"
    },
    dashboardIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary
    },
    tabText: {
        fontSize: 20,
        fontFamily: "semiBold",
        color: COLORS.black
    }
})

export default FeaturedEstates