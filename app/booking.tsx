import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

interface BookingProps {
  navigation: any;
}

interface SelectedRange {
  startDate: string;
  endDate: string;
}

const Booking: React.FC<BookingProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [selectedRange, setSelectedRange] = useState<SelectedRange>({
    startDate: '',
    endDate: ''
  });

  const onDayPress = (day: DateData) => {
    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
      setSelectedRange({
        startDate: day.dateString,
        endDate: ''
      });
    } else {
      setSelectedRange((prevState) => ({
        ...prevState,
        endDate: day.dateString
      }));
    }
  };

  const renderSelectedDates = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      return (
        <Text style={styles.selectedDatesText}>
          Check-in: {selectedRange.startDate} - Check-out: {selectedRange.endDate}
        </Text>
      );
    } else if (selectedRange.startDate) {
      return (
        <Text style={styles.selectedDatesText}>
          Check-in: {selectedRange.startDate}
        </Text>
      );
    }
    return null;
  };

  const getMarkedDates = () => {
    const markedDates: { [key: string]: any } = {};

    if (selectedRange.startDate) {
      markedDates[selectedRange.startDate] = {
        startingDay: true,
        color: COLORS.white,
        textColor: COLORS.primary
      };
    }

    if (selectedRange.endDate) {
      markedDates[selectedRange.endDate] = {
        endingDay: true,
        color: COLORS.white,
        textColor: COLORS.primary
      };

      // Mark all dates between startDate and endDate
      let start = new Date(selectedRange.startDate);
      let end = new Date(selectedRange.endDate);
      let current = new Date(start);

      while (current < end) {
        current.setDate(current.getDate() + 1);
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr !== selectedRange.endDate) {
          markedDates[dateStr] = {
            color: COLORS.white,
            textColor: COLORS.primary
          };
        }
      }
    }

    return markedDates;
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Booking" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, {
            color: dark ? COLORS.secondaryWhite : COLORS.black
          }]}>Select Date</Text>
          <View>
            <Calendar
              onDayPress={onDayPress}
              markingType={'period'}
              markedDates={getMarkedDates()}
              style={{
                backgroundColor: COLORS.primary,
                marginVertical: 16,
                borderRadius: 12,
                height: 370
              }}
              theme={{
                backgroundColor: COLORS.primary,
                calendarBackground: COLORS.primary,
                textSectionTitleColor: COLORS.white,
                selectedDayBackgroundColor: COLORS.white,
                selectedDayTextColor: COLORS.primary,
                todayTextColor: COLORS.white,
                dayTextColor: COLORS.white,
                textDisabledColor: '#ffffff',
                monthTextColor: COLORS.white,
                indicatorColor: COLORS.white,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 12,
                arrowColor: "white"
              }}
            />
          </View>
          <View style={styles.selectedDateContainer}>
            <View style={styles.selectedDateLeftContainer}>
              <Text style={[styles.selectedDateTitle, {
                color: dark ? COLORS.secondaryWhite : COLORS.black
              }]}>Check In</Text>
              <View style={[styles.dateContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
              }]}>
                <Text style={styles.dateText}>{selectedRange.startDate}</Text>
                <Image
                  source={icons.calendar4}
                  resizeMode='contain'
                  style={styles.calendarIcon}
                />
              </View>
            </View>
            <View style={styles.selectedDateLeftContainer}>
              <Text style={[styles.selectedDateTitle, {
                color: dark ? COLORS.secondaryWhite : COLORS.black
              }]}>Check out</Text>
              <View style={[styles.dateContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
              }]}>
                <Text style={styles.dateText}>{selectedRange.endDate}</Text>
                <Image
                  source={icons.calendar4}
                  resizeMode='contain'
                  style={styles.calendarIcon}
                />
              </View>
            </View>
          </View>

          <Text style={[styles.title, {
            color: dark ? COLORS.secondaryWhite : COLORS.black
          }]}>Note to Owner (optional)</Text>
          <TextInput
            placeholder='Notes'
            placeholderTextColor={COLORS.grayscale700}
            style={[styles.noteInput, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
              color: dark ? COLORS.secondaryWhite : COLORS.black
            }]}
            multiline={true}
            autoCapitalize="none"
          />
        </ScrollView>
        <Button
          title="Continue"
          style={styles.button}
          filled
          onPress={() => { navigation.navigate("bookingdetails") }}
        />
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
    padding: 16,
    backgroundColor: COLORS.white
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 9
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  selectedDateLeftContainer: {
    width: (SIZES.width - 32) / 2 - 12,
    marginVertical: 12
  },
  selectedDateTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 12
  },
  dateContainer: {
    width: (SIZES.width - 32) / 2 - 12,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryWhite,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  dateText: {
    fontSize: 13,
    fontFamily: "regular",
    color: COLORS.grayscale700
  },
  calendarIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.black
  },
  noteInput: {
    width: SIZES.width - 32,
    height: 112,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryWhite,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.greyscale900,
    fontFamily: "regular"
  },
  button: {
    position: "absolute",
    bottom: 6,
    width: SIZES.width - 32,
    backgroundColor: COLORS.primary,
    right: 16,
    left: 16
  },
  selectedDatesText: {
    fontSize: 14
  }
});

export default Booking;
