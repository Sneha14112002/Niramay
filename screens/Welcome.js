import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <ImageBackground
        source={require('../assets/bg27.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <Image source={require('../assets/logo2.jpg')} style={styles.logo} />
          <Text style={styles.title}>Niramay Bharat</Text>
          <Text style={styles.tagline}>सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)', // Adjust the last value for opacity
  },
  logo: {
    // marginTop: -10,
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 320,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 25, // Adjust this value for curved edges
    width: 250,
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2, // Border width
    borderColor: '#fff',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Welcome;