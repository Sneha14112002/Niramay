// PhoneCheckScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView // Import ScrollView component
} from 'react-native';
import { API_URL } from './config'; // Assuming you have API_URL defined
import COLORS from '../constants/colors';

const PhoneCheck = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCheckPhoneNumber = () => {
    // Send a POST request to the backend to check if the phone number exists
    fetch(`${API_URL}/checkPhoneNumber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Phone number not registered');
        }
      })
      .then(data => {
        // Phone number exists, navigate to OTP verification screen
        navigation.navigate('ChangePassword', { phoneNumber });
        console.log('phone number exists');
      })
      .catch(error => {
        // Phone number not registered, show alert
        Alert.alert('Error', 'Phone number not registered');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Forgot Your Password?</Text>
        <Image source={require('../assets/forgotpass.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Enter your phone number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor={'grey'}
          value={phoneNumber}
          onChangeText={text => {
            const formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            setPhoneNumber(formattedText.slice(0, 10)); // Limit to 10 digits
          }}
          keyboardType="phone-pad"
          maxLength={10} // Set maximum length
        />
        <TouchableOpacity onPress={handleCheckPhoneNumber} style={styles.button}>
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    height:600,
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 150,
    paddingBottom: 50,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: -100,
    paddingBottom: 50,
  },
  title: {
    paddingTop: 40,
    fontSize: 18,
    marginBottom: 20,
    color: '#333333',
    paddingRight: 45,
  },
  input: {
    width: '80%',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    color: '#333333',
    fontSize: 16,
  },
  button: {
    width: '80%',
    backgroundColor: COLORS.theme,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneCheck;
