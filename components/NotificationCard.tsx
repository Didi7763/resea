import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES, icons } from '@/constants';
import { getTimeAgo } from '@/utils/date';
import { useTheme } from '@/theme/ThemeProvider';

type NotificationCardProps = {
  title: string;
  description: string;
  date: string | Date;
  time: string;
  type: string;
  isNew: boolean;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  date,
  time,
  type,
  isNew
}) => {
  const { dark } = useTheme();
  const getIcon = (type: NotificationCardProps['type']) => {
    switch (type) {
      case 'Security':
        return icons.squareCheckbox2;
      case 'Card':
        return icons.ticket;
      case 'System':
        return icons.wallet2;
      case 'Property':
        return icons.infoSquare2;
      case 'Feature':
        return icons.profile2;
      default:
        return icons.squareCheckbox2;
    }
  };

  const getIconBackgroundColor = (type: NotificationCardProps['type']) => {
    switch (type) {
      case 'Security':
        return COLORS.transparentSecurity;
      case 'Price':
        return COLORS.transparentCard;
      case 'System':
        return COLORS.transparentPayment;
      case 'Property':
        return COLORS.transparentUpdate;
      case 'Feature':
        return COLORS.transparentAccount;
      default:
        return COLORS.transparentPrimary;
    }
  };

  const getIconColor = (type: NotificationCardProps['type']) => {
    switch (type) {
      case 'Security':
        return COLORS.security;
      case 'Price':
        return COLORS.card;
      case 'System':
        return COLORS.payment;
      case 'Property':
        return COLORS.update;
      case 'Feature':
        return COLORS.account;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftContainer}>
          <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor(type) }]}>
            <Image
              source={getIcon(type)}
              resizeMode='contain'
              style={[styles.icon, { tintColor: getIconColor(type) }]}
            />
          </View>
          <View>
            <Text style={[styles.title, {
              color: dark ? COLORS.white : COLORS.greyscale900,
            }]}>{title}</Text>
            <Text style={[styles.date, {
              color: dark ? COLORS.greyscale500 : COLORS.grayscale700
            }]}>{getTimeAgo(date)} | {time}</Text>
          </View>
        </View>
        {
          isNew && (
            <View style={styles.headerRightContainer}>
              <Text style={styles.headerText}>New</Text>
            </View>
          )
        }
      </View>
      <Text style={[styles.description, {
        color: dark ? COLORS.grayscale400 : COLORS.grayscale700
      }]}>{description}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    marginBottom: 12
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  headerRightContainer: {
    width: 41,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary
  },
  headerText: {
    fontSize: 10,
    fontFamily: "semiBold",
    color: COLORS.white
  },
  headerLeftContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconContainer: {
    height: 60,
    width: 60,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  icon: {
    height: 28,
    width: 28
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 6
  },
  date: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700
  },
  description: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700
  }
});

export default NotificationCard;