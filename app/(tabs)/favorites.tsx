import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ImageSourcePropType } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import RBSheet from "react-native-raw-bottom-sheet";
import { NavigationProp } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS, icons, images, SIZES } from '@/constants';
import { category as categoryData, myFavouriteEstates } from '@/data'; // Import Estate type if defined
import NotFoundCard from '@/components/NotFoundCard';
import Button from '@/components/Button';
import VerticalEstateCardFavorite from '@/components/VerticalEstateCardFavorite';
import HorizontalEstateCardFavorite from '@/components/HorizontalEstateCardFavorite';
import { useNavigation } from 'expo-router';

// Define types
type BookmarkEstate = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  rating: number;
  price: number;
  location: string;
  categoryId: string;
};

const Favourite = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const refRBSheet = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const [selectedBookmarkItem, setSelectedBookmarkItem] = useState<BookmarkEstate | null>(null);
  const [myBookmarkEstates, setMyBookmarkEstates] = useState<BookmarkEstate[]>(myFavouriteEstates);
  const [resultsCount, setResultsCount] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<'row' | 'column'>('row');

  const handleRemoveBookmark = () => {
    if (selectedBookmarkItem) {
      const updatedBookmarkEstates = myBookmarkEstates.filter(
        (estate) => estate.id !== selectedBookmarkItem.id
      );
      setMyBookmarkEstates(updatedBookmarkEstates);
      refRBSheet.current?.close();
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={[styles.backIcon, { tintColor: COLORS.primary }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Favourite
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMyBookmarkEstates = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["1"]);

    const filteredEstates = myBookmarkEstates.filter(estate =>
      selectedCategories.includes("1") || selectedCategories.includes(estate.categoryId)
    );

    useEffect(() => {
      setResultsCount(filteredEstates.length);
    }, [myBookmarkEstates, selectedCategories]);

    const renderCategoryItem = ({ item }: { item: { id: string; name: string } }) => (
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

    return (
      <View>
        <View style={styles.categoryContainer}>
          <FlatList
            data={categoryData}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={renderCategoryItem}
          />
        </View>

        <View style={styles.reusltTabContainer}>
          <Text style={[styles.tabText, { color: dark ? COLORS.secondaryWhite : COLORS.black }]}>
            {resultsCount} founds
          </Text>
          <View style={styles.viewDashboard}>
            <TouchableOpacity onPress={() => setSelectedTab('column')}>
              <Image
                source={selectedTab === 'column' ? icons.document2 : icons.document2Outline}
                resizeMode='contain'
                style={styles.dashboardIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('row')}>
              <Image
                source={selectedTab === 'row' ? icons.dashboard : icons.dashboardOutline}
                resizeMode='contain'
                style={styles.dashboardIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite, marginVertical: 16 }}>
            {resultsCount && resultsCount > 0 ? (
              <>
                {selectedTab === 'row' ? (
                  <FlatList
                    data={filteredEstates}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 16 }}
                    renderItem={({ item }: { item: BookmarkEstate }) => (
                      <VerticalEstateCardFavorite
                        name={item.name}
                        image={item.image}
                        rating={item.rating}
                        price={item.price}
                        location={item.location}
                        onPress={() => {
                          setSelectedBookmarkItem(item);
                          refRBSheet.current?.open();
                        }}
                      />
                    )}
                  />
                ) : (
                  <FlatList
                    data={filteredEstates}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }: { item: BookmarkEstate }) => (
                      <HorizontalEstateCardFavorite
                        name={item.name}
                        image={item.image}
                        rating={item.rating}
                        price={item.price}
                        location={item.location}
                        onPress={() => {
                          setSelectedBookmarkItem(item);
                          refRBSheet.current?.open();
                        }}
                      />
                    )}
                  />
                )}
              </>
            ) : (
              <NotFoundCard />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderMyBookmarkEstates()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={320}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale300 : COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 320,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            alignItems: "center",
            width: "100%"
          }
        }}>
        <Text style={[styles.bottomSubtitle, { color: dark ? COLORS.white : COLORS.black }]}>
          Remove from Bookmark?
        </Text>
        <View style={styles.separateLine} />

        <View style={[styles.selectedBookmarkContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
          <HorizontalEstateCardFavorite
            name={selectedBookmarkItem?.name || ""}
            image={selectedBookmarkItem?.image || icons.heart}
            rating={selectedBookmarkItem?.rating || 0}
            price={selectedBookmarkItem?.price || 0}
            location={selectedBookmarkItem?.location || ""}
            onPress={() => navigation.navigate("estatedetails")}
          />
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
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
            title="Yes, Remove"
            filled
            style={styles.removeButton}
            onPress={handleRemoveBookmark}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
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
  categoryContainer: {
    marginTop: 0
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%"
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  selectedBookmarkContainer: {
    marginVertical: 16,
    backgroundColor: COLORS.tertiaryWhite
  },
  separateLine: {
    width: "100%",
    height: .2,
    backgroundColor: COLORS.greyscale300,
    marginHorizontal: 16
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
    borderColor: COLORS.primary,
  },
  selectedTab: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
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
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
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
    justifyContent: "space-between",
    marginTop: 12
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

export default Favourite