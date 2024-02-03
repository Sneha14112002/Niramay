import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ToastAndroid,
  Alert,
  Image
} from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ToastAndroid,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';
import { API_URL } from './config';
import { API_URL } from './config';


const ChildPresent = ({toggleMenu}) => {
const ChildPresent = ({toggleMenu}) => {
  const navigation = useNavigation();
  const [isChildPresent, setIsChildPresent] = useState(false);
  const [isChildPresent, setIsChildPresent] = useState(false);
  const [anganwadiNo, setAnganwadiNo] = useState('');
  const [childsName, setChildsName] = useState('');

  const handleViewForm = () => {
    navigation.navigate('GeneralHistoryDisplay', { anganwadiNo, childsName });
  };

  const handleFormSubmit = async () => {
    try {
      if (!anganwadiNo || !childsName) {
        Alert.alert('Missing Details', 'Please enter Anganwadi No. and Child\'s Name.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }

      if (!anganwadiNo || !childsName) {
        Alert.alert('Missing Details', 'Please enter Anganwadi No. and Child\'s Name.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }

      const requestData = {
        anganwadiNo,
        childsName,
      };

      const response = await fetch(`${API_URL}/checkData2`, {

      const response = await fetch(`${API_URL}/checkData2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        const data = await response.json();
        const data = await response.json();
        setIsChildPresent(true);
        console.log(data);
        if (data.customerDataPresent && data.generalHistoryDataPresent) {
          console.log('dadad');
          Alert.alert(
            'Data Present',
            'Data is present in both tables. Do you want to view the form?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'View Form',
                onPress: () =>
                  navigation.navigate('GeneralHistoryDisplay', {
                    anganwadiNo: anganwadiNo,
                    childsName: childsName,
                  }),
              },
            ]
          );
        } else if (data.customerDataPresent && !data.generalHistoryDataPresent) {
          console.log('sdad');
          navigation.navigate('GeneralHistoryForm', {
            anganwadiNo: anganwadiNo,
            childsName: childsName,
          });
        } else {
          // No data in the customer table
          Alert.alert(
            'Missing Customer Data',
            'Please fill in the Personal Information form first.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
          );
        }
          });
        } else {
          // No data in the customer table
          Alert.alert(
            'Missing Customer Data',
            'Please fill in the Personal Information form first.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
          );
        }
      } else {
        setIsChildPresent(false);
        console.log('adad');
        ToastAndroid.showWithGravityAndOffset(
          'Data not present in the database. Add personal information of the child first.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          50,
          180
        );
          'Data not present in the database. Add personal information of the child first.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          50,
          180
        );
        console.log("Data doesn't exist in the database");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  
  return (
    <ImageBackground
      source={require('../assets/bg21.jpg')}
      source={require('../assets/bg21.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>Anganwadi No or Name</Text>
            <Text style={styles.label}>Anganwadi No or Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Anganwadi No/Name"
              placeholder="Enter Anganwadi No/Name"
              placeholderTextColor={COLORS.black}
              value={anganwadiNo}
              onChangeText={(text) => setAnganwadiNo(text)}
              //keyboardType="numeric" // This line ensures the numeric keyboard
              //keyboardType="numeric" // This line ensures the numeric keyboard
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Child's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Child's Name"
              placeholderTextColor={COLORS.black}
              value={childsName}
              onChangeText={(text) => setChildsName(text)}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

        
        
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginTop: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
    borderRadius: 0.1,
    padding: 16,
    elevation: 3, // Add elevation for a subtle shadow on Android
    minHeight: 300, // Increase the minimum height of the form container
    
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color:COLORS.black,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color:COLORS.black,
  },
  submitButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20, // Increased margin-top
    shadowColor: 'black', // Shadow color
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 3, // Elevation for Android
  },
  viewFormButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: 'black', // Shadow color
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 3, // Elevation for Android
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  menuButton: {
    position: 'absolute',
    bottom: -20,
    right: 1,
    zIndex: 1,

    // Add any additional styles you need for positioning and appearance
  },
  menuIcon: {
    width: 28,
    height: 30,
    // Add styles for your icon if needed
  },
  menuButton: {
    position: 'absolute',
    bottom: -20,
    right: 1,
    zIndex: 1,

    // Add any additional styles you need for positioning and appearance
  },
  menuIcon: {
    width: 28,
    height: 30,
    // Add styles for your icon if needed
  },
});

export default ChildPresent;