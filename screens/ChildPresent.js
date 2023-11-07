import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground,ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/colors';



const ChildPresent = () => {
  const navigation = useNavigation();
  const [isChildPresent, setIsChildPresent] = useState(false); 
  const [anganwadiNo, setAnganwadiNo] = useState('');
  const [childsName, setChildsName] = useState('');

  const handleViewForm = () => {
    navigation.navigate('GeneralHistoryDisplay', { anganwadiNo, childsName });
  };

  const handleFormSubmit = async () => {
    try {
      // Prepare the data to send to the server
      const requestData = {
        anganwadiNo,
        childsName,
      };
      
      const response = await fetch('http://192.168.1.34:3000/checkData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        setIsChildPresent(true);
        // Data exists in the database, you can navigate to the next screen or perform other actions
        console.log('Data exists in the database');
        console.log('Anganwadi Number: ', anganwadiNo);
        console.log('Child Name: ', childsName);
        navigation.navigate('GeneralHistoryForm', {
            anganwadiNo: anganwadiNo,
            childsName: childsName,
          });          
        
      } else {
        // Data does not exist in the database
        ToastAndroid.showWithGravityAndOffset(
            'Data not present in database. Add personal infroamtion of the child first.',
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleViewForm}
          >
  <Text style={styles.buttonText}>View</Text>
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
});

export default ChildPresent;