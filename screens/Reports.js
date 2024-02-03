import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity , Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import an icon library of your choice
import { API_URL } from './config';
const options = [
  { key: 'option1', label: 'Height Per Visit', image: require('../assets/height.png') },
  { key: 'option2', label: 'Weight Per Visit', image: require('../assets/weight.png') },
  { key: 'option3', label: 'Haemoglobin Per Visit', image: require('../assets/drop.png') },
  { key: 'option4', label: 'Grade Per Visit', image: require('../assets/grade.png') },
  { key: 'option5', label: 'BMI Per Visit', image: require('../assets/bmi.png') },
  { key: 'option6', label: 'Overall Growth Per Visit', image: require('../assets/Overall.png') },


];
const CustomMenuButton = ({toggleMenu}) => {
  const handleMenuToggle = () => {
    toggleMenu(); // Call the toggleMenu function received as a prop
  };

  return (
    <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
      <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
    </TouchableOpacity>
    
  );
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const Reports = ({ navigation, route,toggleMenu}) => {
  const { anganwadiNo, childsName } = route.params;
  const [formData, setFormData] = useState(null);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenuButton toggleMenu={toggleMenu} />, // Place the menu button in the header
      // You can add other header configurations here as needed
    });
  }, [navigation]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          anganwadiNo,
          childsName,
        };
        // fetchDeviceIpAddress();
        const response = await fetch(`${API_URL}/getFormData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 200) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.log('Data not found in the database');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    fetchData();
  }, [anganwadiNo, childsName]);
  console.log(formData);
  const formattedDOB = formData?.child_dob ? formatDate(formData.child_dob) : '';
  console.log(formattedDOB);
  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // Check if "Option 1" is selected
              if (item.key === 'option1') {
                navigation.navigate('HeightPerChild', {gender:formData.child_gender,dob:formattedDOB,anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }
              // You can add similar logic for other options if needed
              if (item.key === 'option2') {
                navigation.navigate('WeightPerChild', { gender:formData.child_gender,dob:formattedDOB,anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option3') {
                navigation.navigate('HaemoglobinPerChild', { gender:formData.child_gender,dob:formattedDOB,anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option4') {
                navigation.navigate('GradePerChild', {gender:formData.child_gender,dob:formattedDOB, anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }
              if (item.key === 'option5') {
                navigation.navigate('BMIChartvsPerVisit',{gender:formData.child_gender,dob:formattedDOB, anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option6') {
                navigation.navigate('GrowthChartPerChild',{gender:formData.child_gender,dob:formattedDOB, anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }
            }}
          >
            <View style={styles.optionRow}>
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.optionLabel}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 20,
    padding: 50, // Increased padding between rows
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    height: 100,
    borderRadius: 10,
    marginBottom: 10, // Increased margin to create more spacing between rows
    backgroundColor: '#FFF', // Background color
    shadowColor: '#888', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    elevation: 5, // Android shadow elevation
  },
  icon: {
    marginRight: 10,
    height:30,
    width:30,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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

export default Reports;