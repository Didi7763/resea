import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS } from '../constants';

interface StarRating2Props {
  ratings: number;
  reviews: number;
}

const StarRating2: React.FC<StarRating2Props> = (props) => {
  const { dark } = useTheme();

  // This array will contain our star tags. We will include this
  // array between the view tag.
  const stars = [];
  // Loop 5 times
  for (let i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name: 'star' = 'star';
    // If ratings is lower, set the path to unfilled stars
    if (i > props.ratings) {
      name = 'star';
    }
    stars.push(<Ionicons name={name} size={15} key={i} color="orange" />);
  }

  return (
    <View style={styles.container}>
      {stars}
      <Text
        style={[
          styles.text,
          {
            color: dark ? COLORS.grayscale200 : '#444',
          },
        ]}
      >
        ({props.reviews})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FF8C00',
  },
  text: {
    fontSize: 12,
    marginLeft: 5,
    color: '#444',
  },
});

export default StarRating2;
