import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface AutoSliderProps {
  images: { uri: string }[]; // Update the type of image object according to your image source type if necessary
}

const AutoSlider: React.FC<AutoSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);

      scrollViewRef.current?.scrollTo({
        animated: true,
        x: Dimensions.get('window').width * nextIndex,
        y: 0,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / Dimensions.get('window').width);
    setCurrentIndex(newIndex);
  };

  const handlePaginationPress = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      animated: true,
      x: Dimensions.get('window').width * index,
      y: 0,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            style={styles.image}
            source={image} // Assuming images are passed as { uri: string }
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === currentIndex ? COLORS.primary : '#C4C4C4' },
            ]}
            onStartShouldSetResponder={() => true} // For clickable dots
            onResponderRelease={() => handlePaginationPress(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: SIZES.width,
    height: SIZES.height * 0.3,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default AutoSlider;
