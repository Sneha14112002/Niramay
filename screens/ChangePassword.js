import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet , Image , ScrollView } from 'react-native';
import { API_URL } from './config';
import axios from 'axios';
import COLORS from '../constants/colors';

const ChangePassword = ({ navigation, route }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const phoneNumber = route.params.phoneNumber;

    const handleSavePassword = async () => {
        // Password validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*[_/\\]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Alert.alert(
                'Invalid Password',
                'Password must contain at least 8 characters, one number, one special character, and no _ or /'
            );
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            Alert.alert('Passwords Not Matched', 'Please re-enter the same password for confirmation');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/updatePassword`, {
                phoneNo: phoneNumber,
                newPassword: newPassword,
            });

            // Handle response
            if (response.status === 200) {
                // Password updated successfully, navigate back to login or other screen
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', 'Failed to update password. Please try again.');
        }

        // Password meets criteria, update password logic goes here (API call or database update)

        // After successful password update, navigate back to the login screen
        navigation.navigate('Login');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
            
            <Image source={require('../assets/reset-password.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter New Password:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor={COLORS.black}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={true}
                />
                <Text style={styles.label}>Confirm New Password:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor={COLORS.black}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                />
            </View>
            <TouchableOpacity onPress={handleSavePassword} style={styles.button}>
                <Text style={styles.buttonText}>Save Password</Text>
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
        backgroundColor: '#fff', // Background color
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
        marginTop:-200,
        paddingBottom:30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        marginBottom: 10,
        color: 'black',
        fontSize:16,

    },
    logo: {
        width: 200,
        height: 100,
        paddingBottom:50,
        marginBottom:30,
        marginTop:-130,
      },
    input: {
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: 'black',
    },
    button: {
        backgroundColor: COLORS.theme,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePassword;
