import React, { useState,useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, Pressable ,Alert} from 'react-native';

import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '@react-native-community/checkbox';
import Button from '../components/Button';
import { API_URL } from './config.js';

// Import your custom images
import eyeImage from '../assets/view.png';
import eyeOffImage from '../assets/hide.png';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isEmailEntered, setIsEmailEntered] = useState(false); // Track if email is entered
    useEffect(() => {
        setIsEmailEntered(!!email); // Update isEmailEntered based on whether email is present or not
    }, [email]);
    const handleForgotPassword = () => {
        // Navigate to the Forgot Password screen or show a modal
        navigation.navigate('PhoneCheck'); // Replace 'ForgotPassword' with the actual screen name
    };
    const handleLogin = () => {
        // Prepare login data from form inputs
        const loginData = {
            email: email,
            password: password,
        };
        console.log(email, password);
        // Make a POST request to the server to validate login
        fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok 123');
                }
                return response.json();
            })
            .then((data) => {
                const { role, name } = data.user;
                navigation.navigate('HomePage', { role, name });
            })
              .catch((error) => {
                // console.error('Error logging in: ', error);
                // Show error alert with custom style
                Alert.alert(
                  'Error',
                  'Incorrect username or password',
                  [{ text: 'OK', style: 'default', onPress: () => console.log('OK Pressed') }],
                  { cancelable: false, style: 'error' } // Add a custom style property
                );
              });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 5 }}>


                </View>


                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
                        fontSize: 17,
                        fontWeight: 400,
                        marginVertical: 15, 

                    }}>Email address / ईमेल</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your email address'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%",
                                color: COLORS.black
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        color: COLORS.black,
                        fontSize: 17,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password / पासवर्ड</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Enter your password'
                            value={password}
                            onChangeText={(text) => setPassword(text)} // Update the 'password' state
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                color: COLORS.black,
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                color: COLORS.black,
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
                </View>
                {isEmailEntered && (
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={{ fontSize: 14, color: COLORS.theme, textAlign: 'left', marginTop: 5, marginBottom: 10 }}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}
                

                    
              

                <Button
                    title="Login"
                    filled
                    style={{
                        backgroundColor: COLORS.theme,
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={handleLogin}
                />

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.theme,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Register</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login