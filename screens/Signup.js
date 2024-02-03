import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import Checkbox from '@react-native-community/checkbox';
import Button from '../components/Button';
import { API_URL } from './config.js';
import eyeImage from '../assets/view.png';
import eyeOffImage from '../assets/hide.png';
import ModalDropdown from 'react-native-modal-dropdown';
import ModalSelector from 'react-native-modal-selector';
import ModalDropdown from 'react-native-modal-dropdown';
import ModalSelector from 'react-native-modal-selector';

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [SelectedRole, setSelectedRole] = useState('Select Role');
  const options = ['Assistant', 'Doctor', 'Supervisor'];
  const DROPDOWN_BACKGROUND_COLOR = COLORS.white; // Customize the background color
  const DROPDOWN_TEXT_COLOR = COLORS.black; // Customize the text color
  const DROPDOWN_BORDER_COLOR = COLORS.black;

  const [selectedOptionAssistant, setSelectedOptionAssistant] = useState('Assistant');
  const [selectedOptionDoctor, setSelectedOptionDoctor] = useState('Doctor');
  const [selectedOptionSupervisor, setSelectedOptionSupervisor] = useState('Supervisor');

  const validateEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(email)) {
      setEmailValidationMessage('Please enter a valid email address');
    } else {
      setEmailValidationMessage('');
    }
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*[_/\\]).{8,}$/;

    return passwordPattern.test(password);
  };

  const handlePhoneNumberChange = (text) => {
    // Remove non-digit characters from the input
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Limit the input to 10 digits
    const truncatedText = cleanedText.slice(0, 10);

    setPhoneNumber(truncatedText);
  };
  const handleSignUp = () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert('Warning', 'Name, email, and phone number are required');
      return;
    }
    const userData = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      post: SelectedRole,
    };

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // Reset password match error
    setPasswordMatchError('');

    if (!emailValidationMessage) {
      if (!validatePassword(password)) {
        setPasswordValidationMessage('Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and a minimum length of 8 characters.');
        return;
      }

      setPasswordValidationMessage('');

      fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.error('Error signing up: ', error);
        });
    }
  };
      fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.error('Error signing up: ', error);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 22 }}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: 400,
                marginVertical: 8,
                color: 'black'
              }}>Name / नाव</Text>
              <View style={{
                width: "100%",
                height: 45,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22
              }}>
                <TextInput
                  placeholder='Enter your full name'
                  placeholderTextColor={COLORS.black}
                  style={{
                    width: "100%",
                    color: 'black'
                  }}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: 400,
                marginVertical: 5,
                color: 'black'
              }}>Email address / ईमेल</Text>
              <View style={{
                width: "100%",
                height: 45,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22
              }}>
                <TextInput
                  placeholder='Enter your email address'
                  placeholderTextColor={COLORS.black}
                  keyboardType='email-address'
                  style={{
                    width: "100%",
                    color: 'black'
                  }}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    validateEmail(text);
                  }}
                />
              </View>
              {emailValidationMessage ? (
                <Text style={{ color: 'red' }}>{emailValidationMessage}</Text>
              ) : null}
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: 400,
                marginVertical: 5,
                color: 'black'
              }}>Password / पासवर्ड</Text>
              <View style={{
                width: "100%",
                height: 45,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
                color: 'black'
              }}>
                <TextInput
                  placeholder='Enter your password'
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  style={{
                    width: "100%",
                    color: 'black'
                  }}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    const isValid = validatePassword(text);
                    if (!isValid) {
                      setPasswordValidationMessage('Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and a minimum length of 8 characters.');
                    } else {
                      setPasswordValidationMessage('');
                    }
                  }}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: "absolute",
                    right: 12
                  }}
                >
                  {
                    isPasswordShown ? (
                      <Image source={eyeImage} style={{ width: 24, height: 24 }} />
                    ) : (
                      <Image source={eyeOffImage} style={{ width: 24, height: 24 }} />
                    )
                  }
                </TouchableOpacity>
              </View>
              {passwordValidationMessage ? (
                <Text style={{ color: 'red' }}>{passwordValidationMessage}</Text>
              ) : null}
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: 400,
                marginVertical: 5,
                color: 'black'
              }}>Confirm Password / पासवर्ड पुनरावृत्ति</Text>
              <View style={{
                width: "100%",
                height: 45,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
                color: 'black'
              }}>
                <TextInput
                  placeholder='Re-enter your password'
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={isPasswordShown}
                  style={{
                    width: "100%",
                    color: 'black'
                  }}
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{
                    position: "absolute",
                    right: 12
                  }}
                >
                  {
                    isPasswordShown ? (
                      <Image source={eyeImage} style={{ width: 24, height: 24 }} />
                    ) : (
                      <Image source={eyeOffImage} style={{ width: 24, height: 24 }} />
                    )
                  }
                </TouchableOpacity>
              </View>
              {passwordMatchError ? (
                <Text style={{ color: 'red' }}>{passwordMatchError}</Text>
              ) : null}
            </View>

            <View style={{ marginBottom: 12 }}>
      <Text style={{
        color: 'black',
        fontSize: 17,
        fontWeight: '400',
        marginVertical: 5,
        color: 'black'
      }}>Mobile Number / फोन नंबर</Text>
      <View style={{
        width: '100%',
        height: 45,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 22
      }}>
        <TextInput
          placeholder='+91'
          placeholderTextColor='black'
          keyboardType='numeric'
          style={{
            color: 'black',
            width: '12%',
            borderRightWidth: 1,
            borderLeftColor: 'grey',
            height: '100%'
          }}
        />
        <TextInput
          placeholder='Enter your phone number'
          placeholderTextColor='black'
          keyboardType='numeric'
          style={{
            color: 'black',
            width: '80%'
          }}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
        />
      </View>
      {phoneNumber.length !== 10 && phoneNumber.length > 0 ? (
        <Text style={{ color: 'red' }}>Phone number must be 10 digits</Text>
      ) : null}
    </View>


            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: 400, marginVertical: 5, color: 'black' }}>
                Role / भूमिका
              </Text>
              <ModalSelector
                data={[
                  { key: 0, label: 'Select Role', value: 'Select Role' },
                  { key: 1, label: 'Assistant', value: 'Assistant' },
                  { key: 2, label: 'Doctor', value: 'Doctor' },
                  { key: 3, label: 'Supervisor', value: 'Supervisor' },
                ]}
                initValue={SelectedRole}
                onChange={(option) => {
                  console.log('Selected Role:', option.value);
                  setSelectedRole(option.value);
                }}
                style={{
                  height: 45,
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                }}
                selectStyle={{
                  borderColor: COLORS.theme,
                  backgroundColor: `${COLORS.white}80`, // Adjust opacity here (e.g., 80%)
                  borderWidth: 0,
                  borderRadius: 8,
                }}
                selectTextStyle={{
                  color: 'black', // Set the selected text color to full black
                  fontSize: 16,
                }}
                optionStyle={{
                  backgroundColor: COLORS.white,
                  borderBottomColor: COLORS.white,
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                }}
                optionTextStyle={{
                  color: COLORS.black,
                  fontSize: 16,
                }}
                sectionStyle={{ borderColor: 'transparent' }}
              />
            </View>



            <View style={{
              flexDirection: 'row',
              marginVertical: 3
            }}>
              <Checkbox
                style={{ marginRight: 8 }}
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? COLORS.theme : undefined}
              />
              <Text>I agree to the terms and conditions</Text>
            </View>

            <Button
              title="Sign Up"
              style={{
                marginTop: -20,
                marginBottom: 4,
                backgroundColor: COLORS.theme,
                borderColor: COLORS.theme,
                borderWidth: 1,
                borderRadius: 8
              }}
              titleStyle={{
                color: 'white'
              }}
              onPress={handleSignUp}
            />

            <View style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 15
            }}>
              <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account?</Text>
              <Pressable
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{
                  fontSize: 16,
                  color: COLORS.theme,
                  fontWeight: "bold",
                  marginLeft: 6
                }}>Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signup;