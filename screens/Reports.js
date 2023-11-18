import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity , Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import an icon library of your choice

const options = [
  { key: 'option1', label: 'Height Per Visit', image: require('../assets/height.png') },
  { key: 'option2', label: 'Weight Per Visit', image: require('../assets/weight.png') },
  { key: 'option3', label: 'Haemoglobin Per Visit', image: require('../assets/drop.png') },
  { key: 'option4', label: 'Grade Per Visit', image: require('../assets/grade.png') },
  { key: 'option5', label: 'Overall Growth Per Visit', image: require('../assets/grade.png') },

];
const Reports = ({ navigation, route }) => {
  const { anganwadiNo, childsName } = route.params;
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
                navigation.navigate('HeightPerChild', { anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }
              // You can add similar logic for other options if needed
              if (item.key === 'option2') {
                navigation.navigate('WeightPerChild', { anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option3') {
                navigation.navigate('HaemoglobinPerChild', { anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option4') {
                navigation.navigate('GradePerChild', { anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
              }

              if (item.key === 'option5') {
                navigation.navigate('GrowthChartPerChild',{ anganwadiNo, childsName }); // Navigate to BitNamevsGender screen
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
});

export default Reports;
