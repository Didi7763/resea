import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FeaturedEstateCardProps {
  name: string;
  image: ImageSourcePropType;
  rating: number;
  price: number;
  location: string;
  onPress: () => void;
}

const FeaturedEstateCard: React.FC<FeaturedEstateCardProps> = ({
  name,
  image,
  rating,
  price,
  location,
  onPress,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        imageStyle={{ borderRadius: 32 }}
        style={styles.container}
        source={image}
      >
        <View style={styles.topHeaderContainer}>
          <View style={styles.reviewContainer}>
            <FontAwesome name="star" size={16} color="orange" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>

        <LinearGradient
          style={styles.bottomContainer}
          colors={['transparent', 'rgba(0,0,0,0.5)']}
        >
          <Text style={styles.name}>{name.substring(0, 16)}...</Text>
          <Text style={styles.location}>{location}</Text>
          <View style={styles.bottomPriceContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${price}</Text>
              <Text style={styles.durationText}> / night</Text>
            </View>
            <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
              <Image
                source={isFavourite ? icons.heart2 : icons.heart2Outline}
                resizeMode="contain"
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width * 0.68,
    height: 340,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewContainer: {
    width: 54,
    height: 24,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite,
    zIndex: 999,
    marginRight: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 124,
    zIndex: 999999,
    width: '100%',
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  location: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.white,
    marginVertical: 6,
  },
  bottomPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.white,
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    marginRight: 6,
  },
});

export default FeaturedEstateCard;
