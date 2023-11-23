import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, StatusBar, ImageBackground, Switch, Image, Alert } from 'react-native';
//import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import { API_URL } from './config.js';
//import checkmarkImage from '../assets/check-mark.png';
const CustomerForm = () => {
  const [bitName, setBitName] = useState('');
  const [anganwadiNo, setAnganwadiNo] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [assistantPhone, setAssistantPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');
  const [childGender, setChildGender] = useState('');
  const [childHb, setChildHb] = useState('');
  const [childPhone, setChildPhone] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherEducation, setMotherEducation] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [motherAgeAtMarriage, setMotherAgeAtMarriage] = useState();
  const [motherAgeAtFirstPregnancy, setMotherAgeAtFirstPregnancy] = useState('');
  const [childWeightAfterBirth, setChildWeightAfterBirth] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherEducation, setFatherEducation] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [showParentSection, setShowParentSection] = useState(false);
  const [showMotherSection, setShowMotherSection] = useState(false);
  const [showFatherSection, setShowFatherSection] = useState(false);
  const [showBitSection, setShowBitSection] = useState(false);
  const [showAssistantSection, setShowAssistantSection] = useState(false);
  const [showChildSection, setShowChildSection] = useState(false);
  const [total_siblings, setTotalSiblings] = useState(0);


  const [showFamilySection, setShowFamilySection] = useState(false);
  const [totalFamilyMembers, setTotalFamilyMembers] = useState('');
  const [siblings, setSiblings] = useState([]);


  const [addictions, setAddictions] = useState('');
  const [sourceOfDrinkingWater, setSourceOfDrinkingWater] = useState('');
  const [other, setOther] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const checkmarkImage = require('../assets/check-mark.png');

  const handleAddSibling = () => {

    if (siblings.length >= total_siblings) {
      // Display an error message when the limit is reached
      alert('Siblings limit reached');
    } else {
      setSiblings([...siblings, { name: '', age: '', malnourished: false }]);
    }
  };

  const handleRemoveSibling = (index) => {
    const updatedSiblings = [...siblings];
    updatedSiblings.splice(index, 1);
    setSiblings(updatedSiblings);
  };

  const handleSiblingFieldChange = (index, field, value) => {
    const updatedSiblings = [...siblings];
    updatedSiblings[index][field] = value;
    setSiblings(updatedSiblings);
  };
  const [diseaseHistory, setDiseaseHistory] = useState({
    diabetes: false,
    tuberculosis: false,
    anaemia: false,
  });

  const handleDiseaseCheckboxChange = (disease) => {
    setDiseaseHistory((prev_history) => ({
      ...prev_history,
      [disease]: !prev_history[disease],
    }));
  };

  const Checkbox = ({ label, checked, onChange }) => (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity onPress={onChange}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Image source={checkmarkImage} style={styles.checkicon} />}
        </View>
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  const parseDateToServerFormat = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const [errors, setErrors] = useState({
    bitName: '',
    anganwadiNo: '',
    assistantName: '',
    assistantPhone: '',
    childName: '',
    childDob: '',
    childGender: '',
    childHb: '',
    childPhone: '',
  });
  const handleForSubmit = async () => {

    setShowSuccessMessage(true);

    // Reset the success message after a few seconds (optional)
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Adjust the duration as needed
    const selectedDiseases = Object.keys(diseaseHistory).filter(
      (key) => diseaseHistory[key] === true
    );
    const formattedChildDob = parseDateToServerFormat(childDob);
    try {
      console.log(
        selectedDiseases);
      const formData = {
        bit_name: bitName,
        anganwadi_no: anganwadiNo,
        assistant_name: assistantName,
        assistant_phone: assistantPhone,
        child_name: childName,
        child_dob: formattedChildDob,
        child_gender: childGender,
        child_phone: childPhone,
        mother_name: motherName,
        mother_education: motherEducation,
        mother_occupation: motherOccupation,
        mother_age_at_first_pregnancy: motherAgeAtFirstPregnancy,
        mother_age_at_marriage: motherAgeAtMarriage,
        child_weight_after_birth: childWeightAfterBirth,
        father_name: fatherName,
        father_occupation: fatherOccupation,
        father_education: fatherEducation,
        total_family_members: totalFamilyMembers,
        prev_history: selectedDiseases,
        addictions,
        source_of_drinking_water: sourceOfDrinkingWater,
        other,
        total_siblings: total_siblings
      };

      const response = await fetch(`${API_URL}/submitForm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        console.log('Form submitted successfully');
        submitSiblingData();
        // Add any additional logic or navigation here after successful submission
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const submitSiblingData = () => {
    const requestBody = JSON.stringify({
      anganwadi_no: anganwadiNo,
      child_name: childName,
      siblings: siblings,
    });
    console.log(siblings);
    // Set up the fetch options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    };

    // Send the sibling data to the server using fetch
    fetch(`${API_URL}/submit-sibling-data`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Sibling data submitted successfully:', data);
        // You can add further actions here, such as navigation or displaying a success message.
      })
      .catch((error) => {
        console.error('Error submitting sibling data:', error);
        // Handle error, e.g., display an error message to the user.
      });
  };



  const handleSubmit = async () => {
    handleForSubmit();
    // Validate fields before submission
    const newErrors = {};
    let hasErrors = false;

    if (bitName === '') {
      newErrors.bitName = 'Please enter Bit Name';
      hasErrors = true;
    }

    if (anganwadiNo === '') {
      newErrors.anganwadiNo = 'Please enter Anganwadi No.';
      hasErrors = true;
    }

    if (assistantName === '') {
      newErrors.assistantName = 'Please enter Name';
      hasErrors = true;
    }

    if (assistantPhone === '') {
      newErrors.assistantPhone = 'Please enter Phone Number';
      hasErrors = true;
    }

    if (childName === '') {
      newErrors.childName = 'Please enter Name';
      hasErrors = true;
    }

    if (childDob === '') {
      newErrors.childDob = 'Please select Date of Birth';
      hasErrors = true;
    }

    if (childGender === '') {
      newErrors.childGender = 'Please enter Gender';
      hasErrors = true;
    }


    if (childPhone === '') {
      newErrors.childPhone = 'Please enter Phone Number';
      hasErrors = true;
    }
    // Inside the handleSubmit function, add validation for new fields
    if (motherName === '') {
      newErrors.motherName = "Please enter Mother's Name";
      hasErrors = true;
    }



    if (motherAgeAtFirstPregnancy === '') {
      newErrors.motherAgeAtFirstPregnancy = "Please enter Mother's Age at First Pregnancy";
      hasErrors = true;

    }

    if (childWeightAfterBirth === '') {
      newErrors.childWeightAfterBirth = "Please enter Child's Weight After Birth";
      hasErrors = true;
    }

    if (fatherName === '') {
      newErrors.fatherName = "Please enter Father's Name";
      hasErrors = true;
    }


    if (childWeightAfterBirth === '') {
      newErrors.childWeightAfterBirth = "Please enter Child's Weight After Birth";
      hasErrors = true;
    } else if (!/^\d+(\.\d+)?$/.test(childWeightAfterBirth)) {
      newErrors.childWeightAfterBirth = "Please enter a valid numeric weight";
      hasErrors = true;
    }


    setErrors(newErrors);

    // if (!hasErrors) {
    //   // Proceed with form submission
    //   console.log('Form submitted successfully');
    //   // ... (rest of the submission logic)
    // }

    if (!hasErrors) {
      // Check if anganwadi_no and child_name already exist
      const response = await checkDuplicateEntries(anganwadiNo, childName);

      if (response.error) {
        // Display error message for duplicate entries
        setErrors({
          ...newErrors,
          anganwadiNo: 'Anganwadi No. and Child Name combination already exists',
          childName: 'Anganwadi No. and Child Name combination already exists',
        });
        // Show popup
        Alert.alert('Error', 'Child already exists. Check anganwadi number or child name and try again.');
      } else {
        // Proceed with form submission
        console.log('Form submitted successfully');
        // ... (rest of the submission logic)
      }
    }
  };
  // Function to check duplicate entries on the server
  const checkDuplicateEntries = async (anganwadiNo, childName) => {
    try {
      const response = await fetch('http://192.168.1.16:3000/check-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anganwadiNo, childName }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return { error: true };
    }
  };
  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="teal" />

      <View style={styles.formContainer}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Personal Information</Text>
          </View> */}
          <View style={styles.dropdownContainer}>
            <View style={styles.formContainer}>
              {/* Bit Information Section */}
              <TouchableOpacity
                // style={styles.sectionHeader}
                style={[styles.sectionHeader, { height: 85 }, styles.shadow]}
                onPress={() => setShowBitSection(!showBitSection)}
              >
                <View style={[styles.sectionHeaderBar, { height: 85 }, styles.border]}>
                  <Text style={styles.sectionTitle}>Bit Information / बिट माहिती </Text>

                  {showBitSection ? (
                    <Image source={require('../assets/up.png')} style={styles.icon} />
                  ) : (
                    <Image source={require('../assets/down.png')} style={styles.icon} />
                  )}

                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!showBitSection}>
                <View style={styles.collapsibleContent}>
                  <Text> </Text>
                  <Text style={styles.label}>Bit Name / बिटचे नाव : <Text style={{ color: 'red', fontSize: 16 }}>*</Text> </Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={bitName}
                    onChangeText={setBitName}
                    placeholder="Enter the bit name"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.bitName}</Text>

                  <Text style={styles.label}>
                    Anganwadi No. / अंगणवाडी क्र. : <Text style={{ color: 'red', fontSize: 16 }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={anganwadiNo}
                    onChangeText={setAnganwadiNo}
                    placeholder="Enter Anganwadi No."
                    placeholderTextColor="grey"
                    keyboardType="phone-pad"
                  />
                  <Text style={styles.errorText}>{errors.anganwadiNo}</Text>

                </View>
              </Collapsible>

              {/* Anganwadi Assistant Information Section */}
              <TouchableOpacity
                style={[styles.sectionHeader, { height: 85 }, styles.shadow]}
                onPress={() => setShowAssistantSection(!showAssistantSection)}
              >
                <View style={[styles.sectionHeaderBar, { height: 85 }, styles.border]}>

                  <Text style={styles.sectionTitle}>Anganwadi Assistant Information/अंगणवाडी सहाय्यकांची माहिती </Text>
                  {showAssistantSection ? (
                    <Image source={require('../assets/up.png')} style={styles.icon} />
                  ) : (
                    <Image source={require('../assets/down.png')} style={styles.icon} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!showAssistantSection}>
                <View >
                  <View style={styles.collapsibleContent}>
                    <Text> </Text>
                    <Text style={styles.label}>Name / नाव :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                    <TextInput
                      style={[styles.input, { height: 45, color: 'black' }]}
                      value={assistantName}
                      onChangeText={setAssistantName}
                      placeholder="Enter assistant's name"
                      placeholderTextColor="grey"
                    />
                    <Text style={styles.errorText}>{errors.assistantName}</Text>

                    <Text style={styles.label}>Phone Number / फोन नंबर :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                    <TextInput
                      style={[styles.input, { height: 45, color: 'black' }]}
                      value={assistantPhone}
                      onChangeText={setAssistantPhone}
                      placeholder="Enter assistant's phone number"
                      placeholderTextColor="grey"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    <Text style={styles.errorText}>{errors.assistantPhone}</Text>
                  </View>
                </View>
              </Collapsible>

              {/* Child Information Section */}
              <TouchableOpacity
                style={[styles.sectionHeader, { height: 85 }, styles.shadow]}
                onPress={() => setShowChildSection(!showChildSection)}
              >
                <View style={[styles.sectionHeaderBar, { height: 85 }, styles.border]}>
                  <Text style={styles.sectionTitle}>Child Information / मुलांची माहिती </Text>
                  {showChildSection ? (
                    <Image source={require('../assets/up.png')} style={styles.icon} />
                  ) : (
                    <Image source={require('../assets/down.png')} style={styles.icon} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!showChildSection}>

                <View style={styles.collapsibleContent}>
                  <Text> </Text>
                  <Text style={styles.label}>Name / नाव :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={childName}
                    onChangeText={setChildName}
                    placeholder="Enter child's name"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.childName}</Text>
                  <Text style={styles.label}>Date of Birth / जन्मतारीख :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={childDob}
                    placeholderTextColor="grey"
                    placeholder="DD-MM-YYYY"
                    onChangeText={setChildDob}
                    keyboardType="numeric"
                    maxLength={10} // Restrict input length to match the expected format
                  />
                  <Text style={styles.errorText}>{errors.childDob}</Text>
                  <Text style={styles.label}>Gender / लिंग :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <View style={styles.radioContainer}>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setChildGender('male')}
                    >
                      <View style={[styles.radioButtonIcon, { backgroundColor: childGender === 'male' ? 'teal' : 'transparent' }]} />
                      <Text style={styles.radioButtonLabel}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setChildGender('female')}
                    >
                      <View style={[styles.radioButtonIcon, { backgroundColor: childGender === 'female' ? 'teal' : 'transparent' }]} />
                      <Text style={styles.radioButtonLabel}>Female</Text>
                    </TouchableOpacity>
                   
                  </View>


                  <Text style={styles.errorText}>{errors.childHb}</Text>
                  <Text style={styles.label}>Phone Number / फोन नंबर :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={childPhone}
                    onChangeText={setChildPhone}
                    placeholder="Enter phone number (parent's)"
                    placeholderTextColor="grey"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  <Text style={styles.errorText}>{errors.childPhone}</Text>
                </View>
              </Collapsible>

              {/* Parents Information Section */}
              <TouchableOpacity
                style={[styles.sectionHeader, { height: 85 }, styles.shadow]}
                onPress={() => setShowParentSection(!showParentSection)}
              >
                <View style={[styles.sectionHeaderBar, { height: 85 }, styles.border]}>
                  <Text style={styles.sectionTitle}>Parent Information / अभिभावकांची माहिती</Text>
                  {showParentSection ? (
                    <Image source={require('../assets/up.png')} style={styles.icon} />
                  ) : (
                    <Image source={require('../assets/down.png')} style={styles.icon} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!showParentSection}>
                <View style={styles.collapsibleContent}>
                  <Text> </Text>
                  {/* Mother's Information */}
                  <Text style={styles.subSectionTitle}>Mother's Information / आईची माहिती</Text>
                  <Text style={styles.label}>Mother's Name / आईचे नाव :  <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={motherName}
                    onChangeText={setMotherName}
                    placeholder="Enter mother's name"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.motherName}</Text>

                  <Text style={styles.label}>Mother's Education / आईचे शिक्षण :</Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={motherEducation}
                    onChangeText={setMotherEducation}
                    placeholder="Enter mother's education"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.motherEducation}</Text>

                  <Text style={styles.label}>Mother's Occupation / आईचे व्यवसाय :</Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={motherOccupation}
                    onChangeText={setMotherOccupation}
                    placeholderTextColor="grey"
                    placeholder="Enter mother's occupation"
                  />
                  <Text style={styles.errorText}>{errors.motherOccupation}</Text>

                  <Text style={styles.label}>Mother's Age at Marriage / लग्नाच्या वेळी आईचे वय : </Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={motherAgeAtMarriage}
                    onChangeText={setMotherAgeAtMarriage}
                    placeholder="Enter mother's age at marriage"
                    placeholderTextColor="grey"
                    keyboardType="numeric" // Set keyboardType to 'numeric'
                  />
                  <Text style={styles.errorText}>{errors.motherAgeAtMarriage}</Text>

                  <Text style={styles.label}>Mother's Age at First Pregnancy / आईची पहिल्या गर्भाच्या वेळीची वय : <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={motherAgeAtFirstPregnancy}
                    onChangeText={setMotherAgeAtFirstPregnancy}
                    placeholder="Enter mother's age at first pregnancy"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />
                  <Text style={styles.errorText}>{errors.motherAgeAtFirstPregnancy}</Text>

                  <Text style={styles.label}>Child's Weight After Birth / बाळाची जन्मानंतरची वजन: <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={childWeightAfterBirth}
                    onChangeText={setChildWeightAfterBirth}
                    placeholder="Enter child's weight after birth"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />
                  <Text style={styles.errorText}>{errors.childWeightAfterBirth}</Text>

                  <View style={[styles.separator]} />
                  {/* Father's Information */}
                  <Text style={styles.subSectionTitle}>Father's Information / वडिलांची माहिती</Text>

                  <Text style={styles.label}>Father's Name / वडिलांचे नाव: <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={fatherName}
                    onChangeText={setFatherName}
                    placeholder="Enter father's name"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.fatherName}</Text>

                  <Text style={styles.label}>Father's Education / वडिलांचे शिक्षण:</Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={fatherEducation}
                    onChangeText={setFatherEducation}
                    placeholder="Enter father's education"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.fatherEducation}</Text>

                  <Text style={styles.label}>Father's Occupation / वडिलांचे व्यवसाय:</Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={fatherOccupation}
                    onChangeText={setFatherOccupation}
                    placeholder="Enter father's occupation"
                    placeholderTextColor="grey"
                  />
                  <Text style={styles.errorText}>{errors.fatherOccupation}</Text>
                </View>
              </Collapsible>
              {/* Information of Family Section */}
              <TouchableOpacity
                style={[styles.sectionHeader, { height: 85 }, styles.shadow]}
                onPress={() => setShowFamilySection(!showFamilySection)}
              >
                <View style={[styles.sectionHeaderBar, { height: 85 }, styles.border]}>
                  <Text style={styles.sectionTitle}>Information of Family / कुटुंबाची माहिती</Text>
                  {showFamilySection ? (
                    <Image source={require('../assets/up.png')} style={styles.icon} />
                  ) : (
                    <Image source={require('../assets/down.png')} style={styles.icon} />
                  )}
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!showFamilySection}>
                <View style={styles.collapsibleContent}>
                  <Text></Text>
                  <Text style={styles.label}>Total Family Members / एकूण कुटुंब  सदस्य : <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={totalFamilyMembers}
                    onChangeText={setTotalFamilyMembers}
                    placeholder="Enter total family members"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />


                  <Text></Text>
                  <Text style={styles.label}>Total Number of Siblings / भावंडांची एकूण संख्या : <Text style={{ color: 'red', fontSize: 16 }}>*</Text></Text>
                  <TextInput
                    style={[styles.input, { height: 45, color: 'black' }]}
                    value={total_siblings.toString()} // Ensure it's a string
                    onChangeText={(value) => setTotalSiblings(parseInt(value) || 0)} // Parse as an integer
                    placeholder="Enter total number of Siblings "
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />


                  {/* Sibling Information Table */}
                  <Text style={styles.subSectionTitle}>Sibling Information / भावंडांची माहिती</Text>
                  <Text style={styles.errorText}>(Slide right if child is Malnourished)</Text>
                  <View style={styles.siblingTableHeader}>
                    <Text style={[styles.siblingTableHeaderCell, { flex: 2, color: 'grey' }]}>Name</Text>
                    <Text style={[styles.siblingTableHeaderCell, { flex: 1, color: 'grey' }]}>Age</Text>
                    <View style={styles.malnourishedHeaderCell}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'grey' }}>Malnourished</Text>
                    </View>
                    {/* <Text style={[styles.siblingTableHeaderCell, { flex: 3 }]}>Other</Text> */}
                  </View>
                  {siblings.map((sibling, index) => (
                    <View key={index} style={styles.siblingTableRow}>
                      {/* Sibling Name */}
                      <TextInput
                        style={[styles.siblingTableCell, { flex: 2, color: 'black' },]}
                        value={sibling.name}
                        onChangeText={(value) => handleSiblingFieldChange(index, 'name', value)}
                        placeholder={`Enter name`}
                        placeholderTextColor="grey"
                      />
                      {/* Sibling Age */}
                      <TextInput
                        style={[styles.siblingTableCell, { flex: 1, color: 'black' }]}
                        value={sibling.age}
                        onChangeText={(value) => handleSiblingFieldChange(index, 'age', value)}
                        placeholder={`Age`}
                        keyboardType="numeric"
                        placeholderTextColor="grey"
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

                  {/* Disease History Section */}
                  <Text style={styles.subSectionTitle}>Disease History of Family Members / कुटुंबातील सदस्यांचा आरोग्य इतिहास</Text>
                  <Checkbox
                    label="Diabetes / मधुमेह"
                    checked={diseaseHistory.diabetes}
                    onChange={() => handleDiseaseCheckboxChange('diabetes')}
                  />
                  <Checkbox
                    label="Tuberculosis / क्षयरोग"
                    checked={diseaseHistory.tuberculosis}
                    onChange={() => handleDiseaseCheckboxChange('tuberculosis')}
                  />
                  <Checkbox
                    label="Anemia / पांडुरोग"
                    checked={diseaseHistory.anemia}
                    onChange={() => handleDiseaseCheckboxChange('anemia')}
                  />

                  {/* Addictions */}
                  <Text style={styles.label}>Addictions / व्यसने</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { color: 'black' }]}
                    value={addictions}
                    onChangeText={setAddictions}
                    placeholder="Enter addictions"
                    placeholderTextColor="grey"
                    multiline={true}
                  />

                  {/* Source of Drinking Water */}
                  <Text style={styles.label}>Source of Drinking Water / पिण्याच्या पाण्याचा स्त्रोत</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { color: 'black' }]}
                    value={sourceOfDrinkingWater}
                    onChangeText={setSourceOfDrinkingWater}
                    placeholder="Enter source of drinking water"
                    placeholderTextColor="grey"
                    multiline={true}
                  />

                  {/* Other */}
                  <Text style={styles.label}>Other / इतर</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { color: 'black' }]}
                    value={other}
                    onChangeText={setOther}
                    placeholder="Enter other information"
                    placeholderTextColor="grey"
                    multiline={true}
                  />


                </View>
              </Collapsible>



            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {showSuccessMessage && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>Form submitted successfully!</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center', // Center content vertically
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white', // White background for the form
    borderRadius: 20, // Curved border radius
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  formContainer: {
    flexGrow: 1,
    width: windowWidth * 0.95, // Adjust this value to make the form wider
    alignSelf: 'center',
    marginTop: -1,
    overflowY: 'auto', // Enable vertical scrolling if content overflows
    maxHeight: '80vh',
  },
  formContent: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    marginBottom: 60,
  },

  toolbarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginBottom: 16,

  },
  icon: {
    width: 26, // Adjust as needed
    height: 30, // Adjust as needed
  },
  checkicon: {
    width: 20, // Adjust as needed
    height: 20, // Adjust as needed
  },
  sectionHeaderBar: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
  },
  collapsibleContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#7f8c8d',
  },
  input: {
    color: 'black',
    width: '100%',
    // height: ,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 15,
    width: windowWidth * 0.7,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#d3d3d3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 10,
  },
  border: {
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  radioContainer: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButtonIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'teal',
    marginRight: 10,
  },
  radioButtonLabel: {
    color: 'grey',
    fontSize: 18,
  },
  subSectionTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    color: '#3f3f3f', // Change the color to make it stand out
    backgroundColor: '#e5e5e5', // Add a background color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
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
  },
  siblingTableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 8,

  },
  siblingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  siblingTableCell: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    marginTop: 8
  },
  checkboxChecked: {
    backgroundColor: 'teal',
    borderColor: 'teal',
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop: 8
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#7f8c8d',
    padding: 5,
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
  successMessageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background color
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',

  },
  successMessageText: {
    color: 'white', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default CustomerForm;