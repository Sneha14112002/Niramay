import React, { useState, useEffect } from 'react';
import { View, Text,TextInput, ActivityIndicator, StyleSheet, ScrollView,TouchableOpacity,Switch} from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
import { API_URL } from './config.js';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors.js';
import { color } from 'react-native-elements/dist/helpers/index.js';
import COLORS from '../constants/colors.js';
const ViewForm = ({ route }) => {
  const { anganwadiNo, childsName } = route.params;
  const [formData, setFormData] = useState(null);
  const [siblingsData, setSiblingsData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [siblings, setSiblings] = useState([]);
  const [updatedSiblings, setUpdatedSiblings] = useState([]);
  const [newTotalSiblings, setNewTotalSiblings] = useState(0); // Initialize with initial value
const [newTotalFamilyMembers, setNewTotalFamilyMembers] = useState(0); // Initialize with initial value


  const handleAddSibling = () => {
    setSiblings([...siblings, { name: '', age: '', malnourished: false }]);
    const newSibling = { name: '', age: '', malnourished: false };
      setUpdatedSiblings([...updatedSiblings, newSibling]);
      setNewTotalSiblings(formData.TotalSiblings + 1);
     setNewTotalFamilyMembers(formData.total_family_members + 1);
      setFormData({ ...formData, TotalSiblings: newTotalSiblings+1,total_family_members: newTotalFamilyMembers+1 });
  

  };

  const handleRemoveSibling = (index) => {
    const updatedSiblings = [...siblings];
    updatedSiblings.splice(index, 1);
    setSiblings(updatedSiblings);
    setNewTotalSiblings(formData.TotalSiblings - 1);
     setNewTotalFamilyMembers(formData.total_family_members - 1);
      setFormData({ ...formData, TotalSiblings: newTotalSiblings-1,total_family_members: newTotalFamilyMembers-1 });
  };

  const handleSiblingFieldChange = (index, field, value) => {
    const updatedSiblings = [...siblings];
    updatedSiblings[index][field] = value;
    setSiblings(updatedSiblings);
  };
  
  const handleSaveChanges = async () => {
    try {
      // Prepare the data to be sent to the server
      const requestData = {
        anganwadiNo,
        childsName,
        siblings: siblings, // Updated siblings data
      };
     
      
      console.log("hello");
    console.log(requestData);
      // Send a POST request to save the siblings data
       
      const response = await fetch(`${API_URL}/submit-sibling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.status === 200) {
        // Data saved successfully, you can perform any additional actions here
        console.log('Siblings data saved successfully');
      } else {
        console.log('Failed to save siblings data');
      }
    } catch (error) {
      console.error('Error saving siblings data:', error);
    }
    const updateSIbling={
      anganwadiNo,
        childsName,
      newTotalFamilyMembers,
      newTotalSiblings
    };
    const response = await fetch(`${API_URL}/updateSibling`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateSIbling),
    });

    if (response.status === 200) {
      // Data saved successfully, you can perform any additional actions here
      console.log('Siblings data saved successfully');
    } else {
      console.log('Failed to save siblings data');
    }
  
  };
  
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anganwadiNo, childsName]);
  useEffect(() => {
    // Fetch sibling data here
    const fetchSiblingData = async () => {
      try {
        const requestData = {
            anganwadiNo,
            childsName,
          };
        const siblingResponse = await fetch(`${API_URL}/getSiblingData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (siblingResponse.status === 200) {
          const siblingData = await siblingResponse.json();
          console.log(siblingData);
          setSiblingsData(siblingData);
        } else {
          console.log('Sibling data not found in the database');
        }
      } catch (error) {
        console.error('Error fetching sibling data:', error);
      }
    };

    fetchSiblingData();
  }, [anganwadiNo, childsName]);

  const [editedPhoneNumber, setEditedPhoneNumber] = useState(""); // Initialize with the existing phone number
  // Add a state variable to track whether the phone number is in editing mode
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [newAssitantPhNo,setnewAssistantPhNo]=useState("");
  const [isEditingAssistantPhNo, setIsEditingAssistantPhNo] = useState(false);
  // Function to handle the update button press and enable editing mode for the phone number
  const handleUpdatePhoneNumber = () => {
    setIsEditingPhoneNumber(true);
  };
  const handleUpdateAssistantPhNo = () => {
    setIsEditingAssistantPhNo(true);
  };
  const handleSaveAssistantPhNo = async() => {
    try{
      setFormData({ ...formData, assistant_phone: newAssitantPhNo});
      const requestData = {
        anganwadiNo, // Assuming these variables are available in scope
        childsName,
        updatedPhoneNumber: newAssitantPhNo, // Pass the updated phone number to the backend
      };

      const response = await fetch(`${API_URL}/updateAssistantNumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        // Phone number updated successfully in the backend
        console.log('Phone number updated successfully');
      } else {
        console.log('Failed to update phone number');
      }
    }catch (error) {
      console.error('Error updating phone number:', error);
    }
    
    setIsEditingAssistantPhNo(false);
  };
  // Function to handle saving the changes made to the phone number
  const handleSavePhoneNumber = async () => {
    try {
      // Update the formData state with the edited phone number
      setFormData({ ...formData, child_phone: editedPhoneNumber });
      
      // Make an API call to update the phone number in the backend
      const requestData = {
        anganwadiNo, // Assuming these variables are available in scope
        childsName,
        updatedPhoneNumber: editedPhoneNumber, // Pass the updated phone number to the backend
      };

      const response = await fetch(`${API_URL}/updatePhoneNumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        // Phone number updated successfully in the backend
        console.log('Phone number updated successfully');
      } else {
        console.log('Failed to update phone number');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
    }

    setIsEditingPhoneNumber(false);
  };
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : formData ? (
        <View style={styles.formDataContainer}>
          <View style={styles.fieldContainer}>
          <Text style={styles.subSectionTitle}>Bit Information / बिट माहिती</Text>
            <Text style={styles.label}>Bit Name/ बिटचे नाव:</Text>
            <Text style={styles.text}>{formData.bit_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi No./ अंगणवाडी क्र.:</Text>
            <Text style={styles.text}>{formData.anganwadi_no}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Anganwadi Assistant Information/अंगणवाडी सहाय्यकांची माहिती </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name / नाव:</Text>
            <Text style={styles.text}>{formData.assistant_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number / फोन नंबर :</Text>
            {/* //<Text style={styles.text}>{formData.assistant_phone}</Text> */}
            {isEditingAssistantPhNo? (
          // If editing mode is enabled, display a TextInput to edit the phone number
          <TextInput
            style={[styles.input, { color: 'black' }]}
            value={newAssitantPhNo}
            onChangeText={(value) => setnewAssistantPhNo(value)}
            keyboardType="phone-pad"
          />
        ) : (
          // Display the current phone number as text
          <Text style={styles.text}>{formData.assistant_phone}</Text>
        )}
        {isEditingAssistantPhNo ? (
          // If editing mode is enabled, display a save button to save changes
          <TouchableOpacity style={styles.addButton} onPress={handleSaveAssistantPhNo}>
            <Text style={styles.saveChangesButtonText}>Save Phone Number</Text>
          </TouchableOpacity>
        ) : (
          // Display an update button to enable editing mode for the phone number
          <TouchableOpacity style={styles.addButton} onPress={handleUpdateAssistantPhNo}>
            <Text style={styles.addButtonLabel}>Update Phone Number</Text>
          </TouchableOpacity>
        )}
          </View>

          <Text style={styles.subSectionTitle}>Child Information / मुलांची माहिती</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Name/मुलाचे नाव:</Text>
            <Text style={styles.text}>{formData.child_name}</Text>
          </View>

          
          <View style={styles.fieldContainer}>
  <Text style={styles.label}>Child's DOB/मुलाची जन्म तारीख:</Text>
  <Text style={styles.text}>
  {formData.child_dob
      ? new Date(formData.child_dob).toLocaleDateString('en-US', {
          timeZone: 'Asia/Kolkata', // Set the timezone to India's timezone
        })
      : 'N/A'}
  </Text>
</View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's Gender/मुलाचा लिंग</Text>
            <Text style={styles.text}>{formData.child_gender}</Text>
          </View>

          <View style={styles.fieldContainer}>
        <Text style={styles.label}>Child's Phone Number/मुलाचा फोन नंबर:</Text>
        {isEditingPhoneNumber ? (
          // If editing mode is enabled, display a TextInput to edit the phone number
          <TextInput
            style={[styles.input, { color: 'black' }]}
            value={editedPhoneNumber}
            onChangeText={(value) => setEditedPhoneNumber(value)}
            keyboardType="phone-pad"
          />
        ) : (
          // Display the current phone number as text
          <Text style={styles.text}>{formData.child_phone}</Text>
        )}
        {isEditingPhoneNumber ? (
          // If editing mode is enabled, display a save button to save changes
          <TouchableOpacity style={styles.addButton} onPress={handleSavePhoneNumber}>
            <Text style={styles.saveChangesButtonText}>Save Phone Number</Text>
          </TouchableOpacity>
        ) : (
          // Display an update button to enable editing mode for the phone number
          <TouchableOpacity style={styles.addButton} onPress={handleUpdatePhoneNumber}>
            <Text style={styles.addButtonLabel}>Update Phone Number</Text>
          </TouchableOpacity>
        )}
      </View>

          <Text style={styles.subSectionTitle}>Parent Information / अभिभावकांची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Name/आईचे नाव: </Text>
            <Text style={styles.text}>{formData.mother_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Education/आईचे शिक्षण:</Text>
            <Text style={styles.text}>{formData.mother_education}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers's Occupation/आईचे व्यवसाय:</Text>
            <Text style={styles.text}>{formData.mother_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age at Marriage/विवाहाची वय:</Text>
            <Text style={styles.text}>{formData.mother_age_at_marriage}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age during First Pregnancy/प्रथम गर्भधारणाची वय:</Text>
            <Text style={styles.text}>{formData.mother_age_at_first_pregnancy}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's weight after Birth/जन्मानंतर मुलाची वजन:</Text>
            <Text style={styles.text}>{formData.child_weight_after_birth}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name/वडिलांचे नाव: </Text>
            <Text style={styles.text}>{formData.father_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fathers's Occupation/वडिलांचे व्यवसाय:</Text>
            <Text style={styles.text}>{formData.father_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Education/वडिलांचे शिक्षण :</Text>
            <Text style={styles.text}>{formData.father_education}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Information of Family / कुटुंबाची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>No. of Total Family Members/संपूर्ण कुटुंबाचे सदस्य:</Text>
            <Text style={styles.text}>{formData.total_family_members}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Number of Siblings/सर्व सहोदर/सहोदरी:</Text>
            <Text style={styles.text}>{formData.TotalSiblings}</Text>
        </View>
        {siblingsData.map((sibling, index) => (
  <View key={index} style={styles.siblingContainer}>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Sibling Name:</Text>
      <Text style={styles.siblingValue}>{sibling.name}</Text>
    </View>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Sibling Age:</Text>
      <Text style={styles.siblingValue}>{sibling.age}</Text>
    </View>
    <View style={styles.siblingRow}>
      <Text style={styles.siblingLabel}>Malnourished:</Text>
      <Text style={styles.siblingValue}>
        {sibling.malnourished === 0 ? 'No' : 'Yes'}
      </Text>
    </View>
  </View>
))}
<Text style={[styles.errorText,{fontSize:14}]}>*Slide right if child is Malnourished</Text>
{siblings.map((sibling, index) => (
  
  <View key={index} style={styles.siblingTableRow}>
    {/* Sibling Name */}
    <TextInput
      style={[styles.siblingTableCell, { flex: 2,color:'black' },]}
      value={sibling.name}
      onChangeText={(value) => handleSiblingFieldChange(index, 'name', value)}
      placeholder={`name`}
      placeholderTextColor="grey"
    />
    {/* Sibling Age */}
    <TextInput
      style={[styles.siblingTableCell, { flex: 1 }]}
      value={sibling.age}
      onChangeText={(value) => handleSiblingFieldChange(index, 'age', value)}
      placeholder={`Age`}
      placeholderTextColor="grey"
      keyboardType="numeric"
    />
    {/* Malnourished */}
    <View style={[styles.siblingTableCell, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Switch
        value={sibling.malnourished}
        onValueChange={(value) => handleSiblingFieldChange(index, 'malnourished', value)}
      />
    </View>
    
    {/* Remove Sibling Button */}
    <TouchableOpacity onPress={() => handleRemoveSibling(index)} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
))}
<TouchableOpacity style={styles.addButton} onPress={handleAddSibling}>
        <Text style={styles.addButtonLabel}>Add</Text>
      </TouchableOpacity>
   {/* Save Changes Button */}
   <TouchableOpacity style={styles.addButton} onPress={handleSaveChanges}>
            <Text style={styles.saveChangesButtonText}>Save Changes</Text>
          </TouchableOpacity>

         
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>Disease History/रोग इतिहास :</Text>
            <Text style={styles.text}>{formData.prevHistory}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Addictions/व्यसने:</Text>
            <Text style={styles.text}>{formData.addictions}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Source of Drinking Water/प्या पाण्याची स्त्रोत:</Text>
            <Text style={styles.text}>{formData.source_of_drinking_water}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Other/इतर:</Text>
            <Text style={styles.text}>{formData.other}</Text>
          </View>
          {/* Add more data fields here with labels and text */}
        </View>
      ) : (
        <Text style={styles.errorText}>Data not found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 10,
  },
  formDataContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input:{
    color:'black'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  subSectionTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    color: '#3f3f3f', // Change the color to make it stand out
    backgroundColor: '#cdf0ff', // Add a background color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  siblingContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  siblingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  siblingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  
  },
  siblingValue: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray', // Choose a color for the separator line
    marginVertical: 5,
    marginBottom: 20,
  },
  siblingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color:'black'
  },
  addButton: {
    backgroundColor: 'teal',
    paddingVertical: 8,
    paddingHorizontal: 12,
 
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  siblingTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 85,
    borderBottomWidth: 1,
    paddingBottom: 8,
    color:'black'
  },
  siblingTableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 8,
    color:'black'
  },
  siblingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color:'black'
  },
  siblingTableCell: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color:COLORS.black
    // flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 12,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop:8
  },
  checkboxChecked: {
    backgroundColor: 'teal',
    borderColor: 'teal',
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop:8
  },
 
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 45, // Adjust the height as needed
    textAlignVertical: 'center', // Start typing from the top
  },
  
  
});

export default ViewForm;