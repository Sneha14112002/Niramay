import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {role,name} from "./HomePage";
const Menu = ({toggleMenu }) => {
  const navigation = useNavigation();
  console.log(role, name,"####");
  // const roleIcons = {
  //   Doctor: require('../assets/doctor.png'),
  //   Supervisor: require('../assets/supervisor.png'),
  //   Assistant: require('../assets/assistant.png'),
  // };

  //const selectedIcon = roleIcons[role];
  const handleMenuItemClick = (menuItem) => {
    switch (menuItem) {
      case 'Child Personal Information':
        navigation.navigate('IsChildAlreadyPresent');
        break;
      case 'Physical Check Up Information':
        navigation.navigate('ChildPresent', { navigationSource: 'PhysicalCheckupInformation' });
        break;
      case 'Individual Report':
        navigation.navigate('IsChild');
        break;
      case 'Consolidated Report':
        navigation.navigate('ConsolidatedReports');
        break;
      default:
        break;
    }
    toggleMenu();
  };

  const menuItems = [
    { label: 'Child Personal Information', icon: require('../assets/user.png') },
    { label: 'Physical Check Up Information', icon: require('../assets/heartbeat.png') },
    { label: 'Individual Report', icon: require('../assets/file.png') },
    { label: 'Consolidated Report', icon: require('../assets/grade.png') },
  ];

  return (
    <ImageBackground
      source={require('../assets/bg9.jpg')} // Replace with your image path
      style={styles.backgroundImage}
    >

      <View style={styles.container}>
        <View style={styles.menuItemsContainer}>
          {menuItems.map((menuItem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemClick(menuItem.label)}
            >
              <Image source={menuItem.icon} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>{menuItem.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Text style={styles.closeButtonText}>Close Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => {
             toggleMenu(); // Close the menu
            navigation.navigate('Welcome'); // Navigate to the Welcome page
          }}>
            <Text style={styles.closeButtonText}>Sign Out</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity using rgba for better visibility
  },
  closeButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  menuItemsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  menuItem: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    width: 222,
  },
  menuItemIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Menu;
