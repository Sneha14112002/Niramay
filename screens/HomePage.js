import React from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import IsChildAlreadyPresent from './IsChildAlreadyPresent';
import { useNavigation } from '@react-navigation/native';
import user from '../assets/user.png';
import heartbeat from '../assets/heartbeat.png';
import file from '../assets/file.png';
import clipboard from '../assets/clipboard.png';

const HomePage = ({ route }) => {
  const { role, name } = route.params;
  const navigation = useNavigation();

  const goToConsolidatedReports = () => {
    navigation.navigate('ConsolidatedReports');
  };

  const roleIcons = {
    Doctor: require('../assets/doctor.png'),
    Supervisor: require('../assets/supervisor.png'),
    Assistant: require('../assets/assistant.png'),
  };

  const selectedIcon = roleIcons[role];

  const goToPersonalInformation = () => {
    navigation.navigate('IsChildAlreadyPresent');
  };

  const goToPhysicalCheckupInformation = () => {
    navigation.navigate('ChildPresent', {
      navigationSource: 'PhysicalCheckupInformation',
    });
  };

  const goToReports = () => {
    navigation.navigate('IsChild');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/bg11.jpg')}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Image source={selectedIcon} style={styles.userIcon} />
        <Text style={styles.userName}>Hello, {name}</Text>
      </View>
      <Text style={styles.menuHeading}>Menu</Text>
      <View style={styles.menuContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem1} onPress={goToPersonalInformation}>
          <Image source={user} style={{ width: 50, height: 50 }} />
            <Text style={styles.menuItemText}>Child Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem2} onPress={goToPhysicalCheckupInformation}>
          <Image source={heartbeat} style={{ width: 50, height: 50 }} />
            <Text style={styles.menuItemText}>Physical Checkup Information</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.menuItem3} onPress={goToReports}>
          <Image source={file} style={{ width: 50, height: 50 }} />
            <Text style={styles.menuItemText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem4} onPress={goToConsolidatedReports}>
          <Image source={clipboard} style={{ width: 50, height: 50 }} />
            <Text style={styles.menuItemText}>Consolidated Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 200,
    left: 0,
    width: '100%',
    height: 280,
    flexDirection: 'row',
    alignItems: 'flex-start', // Updated
    justifyContent: 'left',
    marginLeft: 10, // Added margin
  },
  menuHeading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 10,
    marginLeft: 20,
    padding: 15,
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 20,
  },
  menuItem1: {
    backgroundColor: '#c9f6ff',
    width: '40%',
    aspectRatio: 1,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuItem2: {
    backgroundColor: '#f5e4e4',
    width: '40%',
    aspectRatio: 1,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuItem3: {
    backgroundColor: '#eee1ff',
    width: '40%',
    aspectRatio: 1,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuItem4: {
    backgroundColor: '#d7f5d3',
    width: '40%',
    aspectRatio: 1,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuItemText: {
    color: 'black',
    fontSize: 15,
    marginTop: 15,
    textAlign: 'center',
  },
  userIcon: {
    width: 50, // Increase the width
    height: 50, 
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop:25,
  },
});

export default HomePage;