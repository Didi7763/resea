import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';
import React, { useRef, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, FONTS, SIZES, icons, images, socials } from '../constants';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-virtualized-view';
import { FontAwesome } from "@expo/vector-icons";
import { estateFacilties } from '../data';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Callout } from 'react-native-maps';
import { mapDarkStyle, mapStandardStyle } from '../data/mapData';
import Button from '../components/Button';
import RBSheet from "react-native-raw-bottom-sheet";
import Facility from '@/components/Facility';
import ReviewCard from '@/components/ReviewCard';
import AutoSlider from '@/components/AutoSlider';
import SocialIcon from '@/components/SocialIcon';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { formatCFA } from '@/utils/currency';

const EstateDetails = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { dark } = useTheme();
    const refRBSheet = useRef<any>(null);

    // Slider images
    const sliderImages = [
        images.estate1,
        images.estate2,
        images.estate3,
        images.estate4,
        images.estate5,
    ];

    // render header
    const renderHeader = () => {
        const [isFavorite, setIsFavorite] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}>
                        <Image
                            source={isFavorite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={styles.bookmarkIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sendIconContainer}
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.send2}
                            resizeMode='contain'
                            style={styles.sendIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
    * render content
    */
    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);

        const description = `Cozy one-bedroom apartment with lots of natural light. Open layout with a spacious living room perfect for relaxing or entertaining. Modern kitchen equipped with all essentials. Quiet neighborhood with nearby parks and cafes. Ideal for individuals or couples looking for comfort and convenience.`

        const toggleExpanded = () => {
            setExpanded(!expanded);
        };

        return (
            <View style={styles.contentContainer}>
                <Text style={[styles.estateName, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black,
                }]}>Modernica Apartment</Text>
                <View style={styles.ratingContainer}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryName}>Apartment</Text>
                    </View>
                    <View style={styles.numReviewContainer}>
                        <FontAwesome name="star" size={16} color="orange" />
                        <Text style={[styles.rating, {
                            color: dark ? COLORS.secondaryWhite : COLORS.black
                        }]}>{"  "}4.8 (1,275 reviews)</Text>
                    </View>
                </View>

                <View style={styles.viewContainer}>
                    <View style={styles.viewItemContainer}>
                        <View style={styles.viewItemIcon}>
                            <Image
                                source={icons.bed}
                                resizeMode="contain"
                                style={styles.viewIcon}
                            />
                        </View>
                        <Text style={[styles.viewTitle, {
                            color: dark ? COLORS.tertiaryWhite : COLORS.black
                        }]}>8 Beds</Text>
                    </View>
                    <View style={styles.viewItemContainer}>
                        <View style={styles.viewItemIcon}>
                            <Image
                                source={icons.bathtub}
                                resizeMode="contain"
                                style={styles.viewIcon}
                            />
                        </View>
                        <Text style={[styles.viewTitle, {
                            color: dark ? COLORS.tertiaryWhite : COLORS.black
                        }]}>3 Bath</Text>
                    </View>
                    <View style={styles.viewItemContainer}>
                        <View style={styles.viewItemIcon}>
                            <Image
                                source={icons.bathtub}
                                resizeMode="contain"
                                style={styles.viewIcon}
                            />
                        </View>
                        <Text style={[styles.viewTitle, {
                            color: dark ? COLORS.tertiaryWhite : COLORS.black
                        }]}>2000 sqft</Text>
                    </View>
                </View>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
                }]} />

                <View style={styles.userInfoContainer}>
                    <View style={styles.userInfoLeftContainer}>
                        <TouchableOpacity>
                            <Image
                                source={images.user3}
                                resizeMode="cover"
                                style={styles.userImage}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={[styles.userName, {
                                color: dark ? COLORS.secondaryWhite : COLORS.black
                            }]}>Natasya Wilodra</Text>
                            <Text style={[styles.userPosition, {
                                color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                            }]}>Owner</Text>
                        </View>
                    </View>
                    <View style={styles.userInfoRightContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("chat")}>
                            <Image
                                source={icons.chatBubble2Outline}
                                resizeMode="contain"
                                style={styles.chatIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("call")}
                            style={{ marginLeft: 12 }}>
                            <Image
                                source={icons.telephoneOutline}
                                resizeMode='contain'
                                style={styles.phoneIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.viewSubtitle, {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                }]}>Overview</Text>
                <Text style={[styles.description, {
                    color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                }]} numberOfLines={expanded ? undefined : 2}>{description}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>

                <Text style={[styles.viewSubtitle, {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                }]}>Facilities</Text>
                <FlatList
                    data={estateFacilties}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                    numColumns={4} // Render two items per row
                    renderItem={({ item, index }) => (
                        <Facility
                            name={item.name}
                            icon={item.icon}
                            iconColor={item.iconColor}
                            backgroundColor={item.backgroundColor}
                        />
                    )}
                />
                <View style={styles.subItemContainer}>
                    <Text style={[styles.viewSubtitle, {
                        color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                    }]}>Gallery</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("gallery")}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.coverImageContainer}>
                    <Image
                        source={images.estate1}
                        resizeMode='cover'
                        style={styles.coverImage}
                    />
                    <Image
                        source={images.estate2}
                        resizeMode='cover'
                        style={styles.coverImage}
                    />
                    <ImageBackground
                        imageStyle={{ borderRadius: 16 }}
                        style={styles.coverImage}
                        source={images.estate3}>
                        <LinearGradient
                            colors={['rgba(0,0,0,0.8)', 'transparent']}
                            style={styles.gradientImage}>
                            <Text style={styles.numImage}>20+</Text>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                <Text style={[styles.viewSubtitle, {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                }]}>Location</Text>

                <View style={styles.estateItemContainer}>
                    <Image
                        source={icons.pin}
                        resizeMode='contain'
                        style={styles.locationIcon}
                    />
                    <Text style={[styles.locationText, {
                        color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                    }]}>6993 Meadow Valley Terrace, New York</Text>
                </View>

                <View style={[styles.locationMapContainer, {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                }]}>
                    <MapView
                        style={styles.mapContainer}
                        customMapStyle={dark ? mapDarkStyle : mapStandardStyle}
                        userInterfaceStyle="dark"
                        initialRegion={{
                            latitude: 48.8566,
                            longitude: 2.3522,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        <Marker
                            coordinate={{
                                latitude: 48.8566,
                                longitude: 2.3522,
                            }}
                            image={icons.mapsLocation}
                            title="Move"
                            description="Address"
                            onPress={() => console.log("Move to another screen")}
                        >
                            <Callout tooltip>
                                <View>
                                    <View style={styles.bubble}>
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                fontWeight: 'bold',
                                                color: COLORS.black,
                                            }}
                                        >
                                            User Address
                                        </Text>
                                    </View>
                                    <View style={styles.arrowBorder} />
                                    <View style={styles.arrow} />
                                </View>
                            </Callout>
                        </Marker>
                    </MapView>
                </View>

                <View style={styles.reviewContainer}>
                    <View style={styles.reviewLeft}>
                        <Image
                            source={icons.star}
                            resizeMode='contain'
                            style={styles.starMiddleIcon}
                        />
                        <Text style={[styles.reviewTitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>4.8 (3.279 reviews)</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("estatereviews")}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ReviewCard
                    avatar={images.user1}
                    name="Maria Thompson"
                    description="The location of this apartment is exceptional! The neighborhood is very friendly and convenient. Highly recommended! 😍"
                    avgRating={5}
                    date="2024-01-23T04:52:06.501Z"
                    numLikes={948}
                />
            </View>
        )
    }

    return (
        <View style={[styles.area,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
            <StatusBar hidden />
            <AutoSlider images={sliderImages} />
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
            <View style={[styles.bookBottomContainer, {
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                borderTopColor: dark ? COLORS.dark1 : COLORS.white,
            }]}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.priceText, {
                        color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                    }]}>Price</Text>
                    <View style={styles.priceDurationContainer}>
                        <Text style={styles.price}>{formatCFA(29000)}{" "}</Text>
                        <Text style={[styles.priceDuration, {
                            color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                        }]}>/ night</Text>
                    </View>
                </View>
                <Button
                    title="Booking Now"
                    filled
                    style={styles.bookingBtn}
                    onPress={() => navigation.navigate("booking")}
                />
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnPressMask={true}
                height={360}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    draggableIcon: {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 360,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: "center",
                    }
                }}
            >
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Share</Text>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                    marginVertical: 12
                }]} />
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.whatsapp}
                        name="WhatsApp"
                        onPress={() => console.log("WhatsApp")}
                    />
                    <SocialIcon
                        icon={socials.twitter}
                        name="X"
                        onPress={() => console.log("Twitter")}
                    />
                    <SocialIcon
                        icon={socials.facebook}
                        name="Facebook"
                        onPress={() => console.log("Facebook")}
                    />
                    <SocialIcon
                        icon={socials.instagram}
                        name="Instagram"
                        onPress={() => console.log("Instagram")}
                    />
                </View>
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.yahoo}
                        name="Yahoo"
                        onPress={() => console.log("Yahoo")}
                    />
                    <SocialIcon
                        icon={socials.titktok}
                        name="Tiktok"
                        onPress={() => console.log("Tiktok")}
                    />
                    <SocialIcon
                        icon={socials.messenger}
                        name="Chat"
                        onPress={() => console.log("Chat")}
                    />
                    <SocialIcon
                        icon={socials.wechat}
                        name="Wechat"
                        onPress={() => console.log("Wechat")}
                    />
                </View>
            </RBSheet>
        </View>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    sendIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    sendIconContainer: {
        marginLeft: 8
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    contentContainer: {
        marginHorizontal: 16
    },
    estateName: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.black,
        marginVertical: 6
    },
    categoryContainer: {
        backgroundColor: COLORS.tansparentPrimary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        width: 80,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.primary
    },
    rating: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.black
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    numReviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 12
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12
    },
    viewItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12
    },
    viewItemIcon: {
        width: 44,
        height: 44,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999
    },
    viewIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary
    },
    viewTitle: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.black,
        marginLeft: 12
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale100
    },
    userInfoContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 6
    },
    userImage: {
        width: 52,
        height: 52,
        borderRadius: 999
    },
    userName: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.black
    },
    userPosition: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700,
        marginTop: 3
    },
    userInfoRightContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    userInfoLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    chatIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    phoneIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary
    },
    viewSubtitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 12
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "regular",
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: "semiBold",
    },
    subItemContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 14,
        fontFamily: "semiBold"
    },
    coverImageContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    coverImage: {
        width: (SIZES.width - 32) / 3 - 9,
        height: (SIZES.width - 32) / 3 - 9,
        borderRadius: 16,
        zIndex: 999
    },
    gradientImage: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: (SIZES.width - 32) / 3 - 9,
        height: (SIZES.width - 32) / 3 - 9,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    numImage: {
        fontSize: 22,
        color: COLORS.white,
        fontFamily: "bold",
    },
    estateItemContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
        marginRight: 8
    },
    locationText: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.grayscale700,
    },

    locationMapContainer: {
        height: 226,
        width: "100%",
        borderRadius: 12,
        marginVertical: 16
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        borderRadius: 12,
        backgroundColor: COLORS.dark2
    },
    viewMapContainer: {
        height: 50,
        backgroundColor: COLORS.gray,
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 'auto',
    },
    // Arrow below the bubble
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    reviewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: SIZES.width - 32,
        marginVertical: 16
    },
    reviewLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    starMiddleIcon: {
        height: 18,
        width: 18,
        tintColor: "orange",
        marginRight: 8
    },
    reviewTitle: {
        fontFamily: "bold",
        color: COLORS.black,
        fontSize: 18
    },
    bookBottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: SIZES.width,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 104,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
    },
    priceContainer: {
        flexDirection: "column",
    },
    priceText: {
        fontFamily: "regular",
        color: COLORS.grayscale700,
        fontSize: 14,
        marginBottom: 4
    },
    priceDurationContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        fontFamily: "bold",
        color: COLORS.primary,
        fontSize: 26
    },
    priceDuration: {
        fontFamily: "regular",
        color: COLORS.grayscale700,
        fontSize: 16
    },
    bookingBtn: {
        width: 212
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "semiBold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    socialContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        width: SIZES.width - 32
    }
})

export default EstateDetails