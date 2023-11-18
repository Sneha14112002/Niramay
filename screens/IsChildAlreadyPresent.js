import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground,ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';

const IsChildAlreadyPresent = () => {
  const navigation = useNavigation();
  const [isChildPresent, setIsChildPresent] = useState(false); 
  const [anganwadiNo, setAnganwadiNo] = useState('');
  const [childsName, setChildsName] = useState('');
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const handleFormSubmit = async () => {
    try {
      // Prepare the data to send to the server
      const requestData = {
        anganwadiNo,
        childsName,
      };
      
      const response = await fetch('http://192.168.1.16:3000/checkData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        setIsChildPresent(true);
        setIsUpdateVisible(true);
        // Data exists in the database, you can navigate to the next screen or perform other actions
        console.log('Data exists in the database');
        ToastAndroid.showWithGravityAndOffset(
          'Data already exists in database. Click on View Form or Update.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          50,
          180
        );
      } else {
        // Data does not exist in the database
        navigation.navigate('CustomerForm');
        console.log("Data doesn't exist in the database");
        console.log("88888888888");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleViewForm = () => {
    navigation.navigate('ViewForm', { anganwadiNo, childsName });
  };
  const handleUpdate = () => {
    // Perform the update action here or navigate to the update screen
    // You can customize this based on your requirements
  };
  return (
    <ImageBackground
      source={require('../assets/bg21.jpg')} // Replace with the path to your image asset
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>Anganwadi No.</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Anganwadi No."
              placeholderTextColor={COLORS.black}
              value={anganwadiNo}
              onChangeText={(text) => setAnganwadiNo(text)}
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

          {isChildPresent && (
            <View>
              <TouchableOpacity style={styles.viewFormButton} onPress={handleViewForm}>
                <Text style={styles.buttonText}>View Form</Text>
              </TouchableOpacity>

              {isUpdateVisible && (
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  updateButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default IsChildAlreadyPresent;