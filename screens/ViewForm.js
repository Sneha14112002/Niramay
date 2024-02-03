import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';
import { API_URL } from './config.js';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors.js';
import { color } from 'react-native-elements/dist/helpers/index.js';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import COLORS from '../constants/colors.js';
import RNPrint from 'react-native-print';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from react-native-paper
import CheckBox from 'react-native-check-box';
import moment from 'moment-timezone';

import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors.js';
import { color } from 'react-native-elements/dist/helpers/index.js';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import COLORS from '../constants/colors.js';
import RNPrint from 'react-native-print';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from react-native-paper
import CheckBox from 'react-native-check-box';
import moment from 'moment-timezone';

const ViewForm = ({ route }) => {
  const { anganwadiNo, childsName } = route.params;
  const [selectedSource, setSelectedSource] = useState(''); // State to track selected source
  const [otherSourceValue, setOtherSourceValue] = useState('');
  const [selectedSource, setSelectedSource] = useState(''); // State to track selected source
  const [otherSourceValue, setOtherSourceValue] = useState('');
  const [formData, setFormData] = useState(null);
  const [siblingsData, setSiblingsData] = useState([]);
  const [siblingsData, setSiblingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siblings, setSiblings] = useState([]);
  const [updatedSiblings, setUpdatedSiblings] = useState([]);
  const [newTotalSiblings, setNewTotalSiblings] = useState(0); // Initialize with initial value
  const [newTotalFamilyMembers, setNewTotalFamilyMembers] = useState(0); // Initialize with initial value
  const [editMode, setEditMode] = useState(false);
  const [editedAddictions, setEditedAddictions] = useState('');
  const [editedDrinkingWaterSource, setEditedDrinkingWaterSource] = useState('');
  const [editedOther, setEditedOther] = useState('');
  const [editDiseaseMode, setEditDiseaseMode] = useState(false);
  const [checkedDiabetes, setCheckedDiabetes] = useState([]);
  const [checkedAnaemia, setCheckedAnaemia] = useState([]);
  const [checkedTuberculosis, setCheckedTuberculosis] = useState([]);

  const updatedDiabetes = checkedDiabetes.join(', ');
  const updatedAnaemia = checkedAnaemia.join(', ');
  const updatedTuberculosis = checkedTuberculosis.join(', ');

  function toggleCheckbox(value, section) {
    switch (section) {
      //case for diabetes
      case 'Diabetes':
        setCheckedDiabetes((prevChecked) =>
          prevChecked.includes(value)
            ? prevChecked.filter((item) => item !== value)
            : [...prevChecked, value]
        );
        break;
      // case for Anaemia
      case 'Anaemia':
        setCheckedAnaemia((prevChecked) =>
          prevChecked.includes(value)
            ? prevChecked.filter((item) => item !== value)
            : [...prevChecked, value]
        );
        break;
      //case for tuberculosis
      case 'Tuberculosis':
        setCheckedTuberculosis((prevChecked) =>
          prevChecked.includes(value)
            ? prevChecked.filter((item) => item !== value)
            : [...prevChecked, value]
        );
        break;
      //default
      default:
        break;
    }
  }

  function formatCheckboxValues(values) {
    if (Array.isArray(values)) {
      return values.join('\n');
    } else if (typeof values === 'string') {
      return values;
    } else {
      return 'N/A';
    }
  }


  useEffect(() => {
    if (formData) {
      setEditedAddictions(formData.addictions || ''); // Use empty string as fallback if addictions value is null
      setEditedDrinkingWaterSource(formData.source_of_drinking_water || '');
      setEditedOther(formData.other || '');
      setCheckedDiabetes((formData.diabetes || '').split(', ').filter(Boolean));
      setCheckedAnaemia((formData.anaemia || '').split(', ').filter(Boolean));
      setCheckedTuberculosis((formData.tuberculosis || '').split(', ').filter(Boolean));
      setSelectedSource(formData.source_of_drinking_water || '');
      setOtherSourceValue(formData.otherSourceValue || '');
    }
  }, [formData]);

  const handleSaveChangesfield = () => {
    setEditMode(false); // Set edit mode to false after saving changes
    let updatedSourceOfDrinkingWater = selectedSource;
    if (selectedSource === 'other') {
      updatedSourceOfDrinkingWater = otherSourceValue;
    }
    // Update formData with edited values

    try {
      setFormData({
        ...formData,
        addictions: editedAddictions,
        source_of_drinking_water: updatedSourceOfDrinkingWater,
        other: editedOther,
        diabetes: updatedDiabetes,
        anaemia: updatedAnaemia,
        tuberculosis: updatedTuberculosis,
        // Update other form fields accordingly
      });
      const requestData = {
        anganwadiNo, // Assuming these variables are available in scope
        childsName,
        addictions: editedAddictions,
        source_of_drinking_water: updatedSourceOfDrinkingWater,
        diabetes: updatedDiabetes,
        anaemia: updatedAnaemia,
        tuberculosis: updatedTuberculosis,
        other: editedOther, // Pass the updated phone number to the backend
      };

      const response = fetch(`${API_URL}/updateFields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 200) {
        // Phone number updated successfully in the backend
        console.log(' updated successfully');
      } else {
        console.log('Failed to update Fields');
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };
  const handleEditAddictionsClick = () => {
    setEditMode(!editMode);
  };

  const handleEditDrinkingWaterClick = () => {
    setEditMode(!editMode);
  };

  const handleEditOtherClick = () => {
    setEditMode(!editMode);
  };

  const handleAddictionsChange = (text) => {
    setEditedAddictions(text);
  };

  const handleDrinkingWaterChange = (text) => {
    setEditedDrinkingWaterSource(text);
  };

  const handleOtherChange = (text) => {
    setEditedOther(text);
  };

  const handleAddSibling = () => {
    setSiblings([...siblings, { name: '', age: '', malnourished: false }]);
    const newSibling = { name: '', age: '', malnourished: false };
    setUpdatedSiblings([...updatedSiblings, newSibling]);
    setNewTotalSiblings(formData.TotalSiblings + 1);
    setNewTotalFamilyMembers(formData.total_family_members + 1);
    setFormData({ ...formData, TotalSiblings: newTotalSiblings + 1, total_family_members: newTotalFamilyMembers + 1 });

    setUpdatedSiblings([...updatedSiblings, newSibling]);
    setNewTotalSiblings(formData.TotalSiblings + 1);
    setNewTotalFamilyMembers(formData.total_family_members + 1);
    setFormData({ ...formData, TotalSiblings: newTotalSiblings + 1, total_family_members: newTotalFamilyMembers + 1 });


  };

  const handleRemoveSibling = (index) => {
    const updatedSiblings = [...siblings];
    updatedSiblings.splice(index, 1);
    setSiblings(updatedSiblings);
    setNewTotalSiblings(formData.TotalSiblings - 1);
    setNewTotalFamilyMembers(formData.total_family_members - 1);
    setFormData({ ...formData, TotalSiblings: newTotalSiblings - 1, total_family_members: newTotalFamilyMembers - 1 });
    setNewTotalSiblings(formData.TotalSiblings - 1);
    setNewTotalFamilyMembers(formData.total_family_members - 1);
    setFormData({ ...formData, TotalSiblings: newTotalSiblings - 1, total_family_members: newTotalFamilyMembers - 1 });
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
    const updateSIbling = {
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

    const updateSIbling = {
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
  console.log("Form Data: ", formData);
  console.log("Form Data: ", formData);
  useEffect(() => {
    // Fetch sibling data here
    const fetchSiblingData = async () => {
      try {
        const requestData = {
          anganwadiNo,
          childsName,
        };
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
  const [newAssitantPhNo, setnewAssistantPhNo] = useState("");
  const [isEditingAssistantPhNo, setIsEditingAssistantPhNo] = useState(false);
  // Function to handle the update button press and enable editing mode for the phone number
  const handleUpdatePhoneNumber = () => {
    setIsEditingPhoneNumber(true);
  };
  const handleUpdateAssistantPhNo = () => {
    setIsEditingAssistantPhNo(true);
  };
  const handleSaveAssistantPhNo = async () => {
    try {
      setFormData({ ...formData, assistant_phone: newAssitantPhNo });
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
    } catch (error) {
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




  const generatePDFContent = () => {
    let htmlContent = `
      <html>

      <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: ${styles.container.backgroundColor};
          color: ${styles.text.color};
          padding: ${styles.container.padding}px;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }
        h1 {
          font-size: ${styles.subSectionTitle.fontSize + 5}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          color: ${styles.subSectionTitle.color};
          margin-top: 15px;
          text-align: center; /* Add this line to center the heading */
        }
        h2 {
          font-size: ${styles.subSectionTitle.fontSize}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          color: ${styles.subSectionTitle.color};
          background-color: ${styles.subSectionTitle.backgroundColor};
          border-radius: ${styles.subSectionTitle.borderRadius}px;
          margin-bottom: ${styles.subSectionTitle.marginBottom}px;
        }
        p, label {
          font-size: ${styles.text.fontSize}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          margin-bottom: ${styles.text.marginBottom}px;
          color: ${styles.text.color};
        }
        .container {
          background-color: ${styles.formDataContainer.backgroundColor};
          padding: ${styles.formDataContainer.padding}px;
          border-radius: ${styles.formDataContainer.borderRadius}px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-bottom: ${styles.formDataContainer.marginBottom}px;
        }
        .fieldContainer {
          margin-bottom: ${styles.fieldContainer.marginBottom}px;
        }
        img {
         width:100px; 
         height:100px;
         
         }
         .headingLine {
          font-size:30;
          color:orange;
          margin-left:20px;
         margin-top:20px;
         padding-bottom:3px;
       
        }
        .subheading {
          font-size: 18px;
          color: orange;
       
          margin-left:20px;
        }
        .textContainer {
          margin-left: 10px;
        }
        /* Add more styles as needed */
      </style>
    </head>
      </head>
        <body>
        <div class="headerContainer">
       
        <img src="file:///android_asset/images/logo2.jpg" />
<div class="textContainer">
<div class="headingLine">Niramay Bharat</div>
<div class="subheading">सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</div>
</div>
</div>

          <h1>Anganwadi Form Data</h1>
          
          <h2>Bit Information</h2>
          <p>Bit Name: ${formData.bit_name}</p>
          <p>Anganwadi No: ${formData.anganwadi_no}</p>
  
          <h2>Anganwadi Assistant Information</h2>
          <p>Assistant Name: ${formData.assistant_name}</p>
          <p>Assistant Phone Number: ${formData.assistant_phone}</p>
  
          <h2>Child Information</h2>
          <p>Child's Name: ${formData.child_name}</p>
          <p>Child's Date of Birth: ${formData.date ? new Date(formData.date).toLocaleDateString('en-US') : 'N/A'}</p>
          <p>Child's Date of Birth: ${formData.child_dob ? new Date(formData.child_dob).toLocaleDateString('en-US') : 'N/A'}</p>
          <p>Child's Gender: ${formData.child_gender}</p>
          <p>Child's Phone Number: ${formData.child_phone}</p>
  
          <h2>Parent Information</h2>
          <p>Mother's Name: ${formData.mother_name}</p>
          <p>Mother's Education: ${formData.mother_education}</p>
          <p>Mother's Occupation: ${formData.mother_occupation}</p>
          <p>Mother's Age at Marriage: ${formData.mother_age_at_marriage}</p>
          <p>Mother's Age during First Pregnancy: ${formData.mother_age_at_first_pregnancy}</p>
          <p>Child's Weight after Birth: ${formData.child_weight_after_birth}</p>
          <p>Father's Name: ${formData.father_name}</p>
          <p>Father's Occupation: ${formData.father_occupation}</p>
          <p>Father's Education: ${formData.father_education}</p>
  
          <h2>Sibling Information</h2>
          <div style="margin-bottom: 10px;">
      `;

    for (const sibling of siblings) {
      htmlContent += `
          <div style="margin-bottom: 10px;">
            <p>Sibling Name: ${sibling.name}</p>
            <p>Sibling Age: ${sibling.age}</p>
            <p>Malnourished: ${sibling.malnourished ? 'Yes' : 'No'}</p>
          </div>
        `;
    }

    htmlContent += `
    <!-- Add Information of Family -->
    <h2>Information of Family</h2>
    <p>No. of Total Family Members: ${formData.total_family_members}</p>
    <p>Total Number of Siblings: ${formData.TotalSiblings}</p>

    <!-- Additional Fields -->
    <h2>Additional Information</h2>
    <p>Disease History: ${formData.disease_history || 'N/A'}</p>
    <p>Addiction: ${formData.addiction || 'N/A'}</p>
    <p>Source of Drinking Water: ${formData.source_of_drinking_water || 'N/A'}</p>

    <!-- Add more data fields here -->
`;


    return htmlContent;
  };



  const generatePDF = async () => {
    try {
      console.log('Generating PDF...');
      const options = {
        html: generatePDFContent(),
        fileName: 'FormDataPDF',
        directory: 'Documents',
      };
      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', pdf.filePath);

      // Print the PDF
      await RNPrint.print({
        filePath: pdf.filePath,
      });
    } catch (error) {
      console.error('Error generating or printing PDF:', error);
    }
  };


  const diseaseMapping = {
    'Mother': 'आई',
    'Father': 'वडिल',
    'Maternal Grandmother': 'आजी',
    'Maternal Grandfather': 'आजोबा',
    'Paternal Grandmother': 'पाटी',
    'Paternal Grandfather': 'पाट्या',
  };

  const [editedPhoneNumber, setEditedPhoneNumber] = useState(""); // Initialize with the existing phone number
  // Add a state variable to track whether the phone number is in editing mode
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [newAssitantPhNo, setnewAssistantPhNo] = useState("");
  const [isEditingAssistantPhNo, setIsEditingAssistantPhNo] = useState(false);
  // Function to handle the update button press and enable editing mode for the phone number
  const handleUpdatePhoneNumber = () => {
    setIsEditingPhoneNumber(true);
  };
  const handleUpdateAssistantPhNo = () => {
    setIsEditingAssistantPhNo(true);
  };
  const handleSaveAssistantPhNo = async () => {
    try {
      setFormData({ ...formData, assistant_phone: newAssitantPhNo });
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
    } catch (error) {
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




  const generatePDFContent = () => {
    let htmlContent = `
      <html>

      <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: ${styles.container.backgroundColor};
          color: ${styles.text.color};
          padding: ${styles.container.padding}px;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }
        h1 {
          font-size: ${styles.subSectionTitle.fontSize + 5}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          color: ${styles.subSectionTitle.color};
          margin-top: 15px;
          text-align: center; /* Add this line to center the heading */
        }
        h2 {
          font-size: ${styles.subSectionTitle.fontSize}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          color: ${styles.subSectionTitle.color};
          background-color: ${styles.subSectionTitle.backgroundColor};
          border-radius: ${styles.subSectionTitle.borderRadius}px;
          margin-bottom: ${styles.subSectionTitle.marginBottom}px;
        }
        p, label {
          font-size: ${styles.text.fontSize}px;
          font-weight: ${styles.subSectionTitle.fontWeight};
          margin-bottom: ${styles.text.marginBottom}px;
          color: ${styles.text.color};
        }
        .container {
          background-color: ${styles.formDataContainer.backgroundColor};
          padding: ${styles.formDataContainer.padding}px;
          border-radius: ${styles.formDataContainer.borderRadius}px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-bottom: ${styles.formDataContainer.marginBottom}px;
        }
        .fieldContainer {
          margin-bottom: ${styles.fieldContainer.marginBottom}px;
        }
        img {
         width:100px; 
         height:100px;
         
         }
         .headingLine {
          font-size:30;
          color:orange;
          margin-left:20px;
         margin-top:20px;
         padding-bottom:3px;
       
        }
        .subheading {
          font-size: 18px;
          color: orange;
       
          margin-left:20px;
        }
        .textContainer {
          margin-left: 10px;
        }
        /* Add more styles as needed */
      </style>
    </head>
      </head>
        <body>
        <div class="headerContainer">
       
        <img src="file:///android_asset/images/logo2.jpg" />
<div class="textContainer">
<div class="headingLine">Niramay Bharat</div>
<div class="subheading">सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</div>
</div>
</div>

          <h1>Anganwadi Form Data</h1>
          
          <h2>Bit Information</h2>
          <p>Bit Name: ${formData.bit_name}</p>
          <p>Anganwadi No: ${formData.anganwadi_no}</p>
  
          <h2>Anganwadi Assistant Information</h2>
          <p>Assistant Name: ${formData.assistant_name}</p>
          <p>Assistant Phone Number: ${formData.assistant_phone}</p>
  
          <h2>Child Information</h2>
          <p>Child's Name: ${formData.child_name}</p>
          <p>Child's Date of Birth: ${formData.date ? new Date(formData.date).toLocaleDateString('en-US') : 'N/A'}</p>
          <p>Child's Date of Birth: ${formData.child_dob ? new Date(formData.child_dob).toLocaleDateString('en-US') : 'N/A'}</p>
          <p>Child's Gender: ${formData.child_gender}</p>
          <p>Child's Phone Number: ${formData.child_phone}</p>
  
          <h2>Parent Information</h2>
          <p>Mother's Name: ${formData.mother_name}</p>
          <p>Mother's Education: ${formData.mother_education}</p>
          <p>Mother's Occupation: ${formData.mother_occupation}</p>
          <p>Mother's Age at Marriage: ${formData.mother_age_at_marriage}</p>
          <p>Mother's Age during First Pregnancy: ${formData.mother_age_at_first_pregnancy}</p>
          <p>Child's Weight after Birth: ${formData.child_weight_after_birth}</p>
          <p>Father's Name: ${formData.father_name}</p>
          <p>Father's Occupation: ${formData.father_occupation}</p>
          <p>Father's Education: ${formData.father_education}</p>
  
          <h2>Sibling Information</h2>
          <div style="margin-bottom: 10px;">
      `;

    for (const sibling of siblings) {
      htmlContent += `
          <div style="margin-bottom: 10px;">
            <p>Sibling Name: ${sibling.name}</p>
            <p>Sibling Age: ${sibling.age}</p>
            <p>Malnourished: ${sibling.malnourished ? 'Yes' : 'No'}</p>
          </div>
        `;
    }

    htmlContent += `
    <!-- Add Information of Family -->
    <h2>Information of Family</h2>
    <p>No. of Total Family Members: ${formData.total_family_members}</p>
    <p>Total Number of Siblings: ${formData.TotalSiblings}</p>

    <!-- Additional Fields -->
    <h2>Additional Information</h2>
    <p>Disease History: ${formData.disease_history || 'N/A'}</p>
    <p>Addiction: ${formData.addiction || 'N/A'}</p>
    <p>Source of Drinking Water: ${formData.source_of_drinking_water || 'N/A'}</p>

    <!-- Add more data fields here -->
`;


    return htmlContent;
  };



  const generatePDF = async () => {
    try {
      console.log('Generating PDF...');
      const options = {
        html: generatePDFContent(),
        fileName: 'FormDataPDF',
        directory: 'Documents',
      };
      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', pdf.filePath);

      // Print the PDF
      await RNPrint.print({
        filePath: pdf.filePath,
      });
    } catch (error) {
      console.error('Error generating or printing PDF:', error);
    }
  };


  const diseaseMapping = {
    'Mother': 'आई',
    'Father': 'वडिल',
    'Maternal Grandmother': 'आजी',
    'Maternal Grandfather': 'आजोबा',
    'Paternal Grandmother': 'पाटी',
    'Paternal Grandfather': 'पाट्या',
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
            <Text style={styles.subSectionTitle}>Bit Information / बिट माहिती</Text>
            <Text style={styles.label}>Bit Name/ बिटचे नाव:</Text>
            <Text style={styles.text}>{formData.bit_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Anganwadi No./ अंगणवाडी क्र.:</Text>
            <Text style={styles.label}>Anganwadi No./ अंगणवाडी क्र.:</Text>
            <Text style={styles.text}>{formData.anganwadi_no}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Anganwadi Assistant Information/अंगणवाडी सहाय्यकांची माहिती </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name / नाव:</Text>
            <Text style={styles.label}>Name / नाव:</Text>
            <Text style={styles.text}>{formData.assistant_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number / फोन नंबर :</Text>
            {/* //<Text style={styles.text}>{formData.assistant_phone}</Text> */}
            {isEditingAssistantPhNo ? (
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
            <Text style={styles.label}>Phone Number / फोन नंबर :</Text>
            {/* //<Text style={styles.text}>{formData.assistant_phone}</Text> */}
            {isEditingAssistantPhNo ? (
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
            <Text style={styles.label}>Child's Name/मुलाचे नाव:</Text>
            <Text style={styles.text}>{formData.child_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Registration / नोंदणीची तारीख :</Text>
            <Text style={styles.text}>
              {formData.date ? new Date(formData.date).toLocaleDateString('en-IN') : 'N/A'}
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's DOB/मुलाची जन्म तारीख:</Text>
            <Text style={styles.text}>
              {formData.child_dob ? new Date(formData.child_dob).toLocaleDateString('en-IN') : 'N/A'}
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
            <Text style={styles.label}>Mother's Name/आईचे नाव: </Text>
            <Text style={styles.text}>{formData.mother_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Education/आईचे शिक्षण:</Text>
            <Text style={styles.label}>Mother's Education/आईचे शिक्षण:</Text>
            <Text style={styles.text}>{formData.mother_education}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers's Occupation/आईचे व्यवसाय:</Text>
            <Text style={styles.label}>Mothers's Occupation/आईचे व्यवसाय:</Text>
            <Text style={styles.text}>{formData.mother_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age at Marriage/विवाहाची वय:</Text>
            <Text style={styles.label}>Mothers age at Marriage/विवाहाची वय:</Text>
            <Text style={styles.text}>{formData.mother_age_at_marriage}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mothers age during First Pregnancy/प्रथम गर्भधारणाची वय:</Text>
            <Text style={styles.label}>Mothers age during First Pregnancy/प्रथम गर्भधारणाची वय:</Text>
            <Text style={styles.text}>{formData.mother_age_at_first_pregnancy}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Child's weight after Birth/जन्मानंतर मुलाची वजन:</Text>
            <Text style={styles.label}>Child's weight after Birth/जन्मानंतर मुलाची वजन:</Text>
            <Text style={styles.text}>{formData.child_weight_after_birth}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name/वडिलांचे नाव: </Text>
            <Text style={styles.label}>Father's Name/वडिलांचे नाव: </Text>
            <Text style={styles.text}>{formData.father_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fathers's Occupation/वडिलांचे व्यवसाय:</Text>
            <Text style={styles.label}>Fathers's Occupation/वडिलांचे व्यवसाय:</Text>
            <Text style={styles.text}>{formData.father_occupation}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Education/वडिलांचे शिक्षण :</Text>
            <Text style={styles.label}>Father's Education/वडिलांचे शिक्षण :</Text>
            <Text style={styles.text}>{formData.father_education}</Text>
          </View>

          <Text style={styles.subSectionTitle}>Information of Family / कुटुंबाची माहिती</Text>


          <View style={styles.fieldContainer}>
            <Text style={styles.label}>No. of Total Family Members/संपूर्ण कुटुंबाचे सदस्य:</Text>
            <Text style={styles.label}>No. of Total Family Members/संपूर्ण कुटुंबाचे सदस्य:</Text>
            <Text style={styles.text}>{formData.total_family_members}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Total Number of Siblings/सर्व सहोदर/सहोदरी:</Text>
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
          <Text style={[styles.errorText, { fontSize: 14 }]}>*Slide right if child is Malnourished</Text>
          {siblings.map((sibling, index) => (

            <View key={index} style={styles.siblingTableRow}>
              {/* Sibling Name */}
              <TextInput
                style={[styles.siblingTableCell, { flex: 2, color: 'black' },]}
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
            <Text style={[styles.saveChangesButtonText, { color: 'white' }]}>Save Changes</Text>
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
          <Text style={[styles.errorText, { fontSize: 14 }]}>*Slide right if child is Malnourished</Text>
          {siblings.map((sibling, index) => (

            <View key={index} style={styles.siblingTableRow}>
              {/* Sibling Name */}
              <TextInput
                style={[styles.siblingTableCell, { flex: 2, color: 'black' },]}
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
            <Text style={[styles.saveChangesButtonText, { color: 'white' }]}>Save Changes</Text>
          </TouchableOpacity>

          <View style={styles.fieldContainer}>

            <View style={{ flexDirection: 'column' }}>
              {/* English label and edit icon */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.label}>Disease History/</Text>
                {/* Edit icon for Disease History */}
                <TouchableOpacity onPress={() => setEditDiseaseMode(!editDiseaseMode)}>
                  <Image source={require('../assets/edit.png')} style={styles.editIcon} />
                </TouchableOpacity>
              </View>

              {/* Marathi label */}
              <Text style={styles.label}>रोग इतिहास :</Text>
              <Text style={styles.label}> </Text>
            </View>

            {/* Disease History Text Inputs */}
            {editDiseaseMode ? (
              <>
                <Text style={styles.label}>Diabetes / मधुमेह :</Text>
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Mother', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Mother')}
                  leftText={'Mother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Father', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Father')}
                  leftText={'Father'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandmother', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Maternal Grandmother')}
                  leftText={'Maternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandfather', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Maternal Grandfather')}
                  leftText={'Maternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandmother', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Paternal Grandmother')}
                  leftText={'Paternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandfather', 'Diabetes')}
                  isChecked={checkedDiabetes.includes('Paternal Grandfather')}
                  leftText={'Paternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />

                <Text style={styles.label}>Anaemia / पांडुरोग :</Text>
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Mother', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Mother')}
                  leftText={'Mother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Father', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Father')}
                  leftText={'Father'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandmother', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Maternal Grandmother')}
                  leftText={'Maternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandfather', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Maternal Grandfather')}
                  leftText={'Maternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandmother', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Paternal Grandmother')}
                  leftText={'Paternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandfather', 'Anaemia')}
                  isChecked={checkedAnaemia.includes('Paternal Grandfather')}
                  leftText={'Paternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />

                <Text style={styles.label}>Tuberculosis / क्षयरोग :</Text>
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Mother', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Mother')}
                  leftText={'Mother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Father', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Father')}
                  leftText={'Father'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandmother', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Maternal Grandmother')}
                  leftText={'Maternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Maternal Grandfather', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Maternal Grandfather')}
                  leftText={'Maternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandmother', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Paternal Grandmother')}
                  leftText={'Paternal Grandmother'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() => toggleCheckbox('Paternal Grandfather', 'Tuberculosis')}
                  isChecked={checkedTuberculosis.includes('Paternal Grandfather')}
                  leftText={'Paternal Grandfather'}
                  leftTextStyle={{ color: 'black' }}
                  checkBoxColor={'teal'}
                />

              </>
            ) : (
              <>
                <Text style={styles.label}>Diabetes / मधुमेह :</Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  {formatCheckboxValues(formData.diabetes)}
                </Text>

                <Text style={styles.label}>Anaemia / पांडुरोग :</Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  {formatCheckboxValues(formData.anaemia)}
                </Text>

                <Text style={styles.label}>Tuberculosis / क्षयरोग :</Text>
                <Text style={[styles.text, { fontSize: 14 }]}>
                  {formatCheckboxValues(formData.tuberculosis)}
                </Text>
              </>
            )}
          </View>


          {/* Addictions */}
          <View style={styles.fldContainer}>
            <Text style={styles.label}>Addictions/व्यसने:</Text>
            <TouchableOpacity onPress={handleEditAddictionsClick}>
              <Image source={require('../assets/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            {editMode ? (
              <TextInput
                style={[styles.input, { color: 'black' }]}
                value={editedAddictions}
                onChangeText={handleAddictionsChange}
              />
            ) : (
              <Text style={styles.text}>{formData.addictions}</Text>
            )}
            {editMode ? (
              <TextInput
                style={[styles.input, { color: 'black' }]}
                value={editedAddictions}
                onChangeText={handleAddictionsChange}
              />
            ) : (
              <Text style={styles.text}>{formData.addictions}</Text>
            )}
          </View>

          {/* Source of Drinking Water */}
          {/* Source of Drinking Water */}
          <View style={styles.fieldContainer}>

            <Text style={styles.label}>Source of Drinking Water/प्या पाण्याची स्त्रोत:</Text>
            {editMode ? (
              <View>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="tap"
                      status={selectedSource === 'tap' ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedSource('tap')}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Tap</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="tanker"
                      status={selectedSource === 'tanker' ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedSource('tanker')}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Tanker</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="other"
                      status={selectedSource === 'other' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedSource('other');
                        setOtherSourceValue('');
                      }}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Other</Text>
                  </View>

                  {selectedSource === 'other' && (
                    <TextInput
                      style={[styles.input, { color: 'black', marginBottom: 10 }]}
                      value={otherSourceValue}
                      onChangeText={(text) => setOtherSourceValue(text)}
                      placeholder="Enter Other Source"
                    />
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.text}>{formData.source_of_drinking_water}</Text>
            )}

            <Text style={styles.label}>Source of Drinking Water/प्या पाण्याची स्त्रोत:</Text>
            {editMode ? (
              <View>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="tap"
                      status={selectedSource === 'tap' ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedSource('tap')}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Tap</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="tanker"
                      status={selectedSource === 'tanker' ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedSource('tanker')}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Tanker</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <RadioButton
                      value="other"
                      status={selectedSource === 'other' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedSource('other');
                        setOtherSourceValue('');
                      }}
                    />
                    <Text style={{ color: '#000', marginLeft: 10 }}>Other</Text>
                  </View>

                  {selectedSource === 'other' && (
                    <TextInput
                      style={[styles.input, { color: 'black', marginBottom: 10 }]}
                      value={otherSourceValue}
                      onChangeText={(text) => setOtherSourceValue(text)}
                      placeholder="Enter Other Source"
                    />
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.text}>{formData.source_of_drinking_water}</Text>
            )}
          </View>

          {/* Other */}
          {/* Other */}
          <View style={styles.fieldContainer}>

            <Text style={styles.label}>Other/इतर:</Text>
            {editMode ? (
              <TextInput
                style={[styles.input, { color: 'black' }]}
                value={editedOther}
                onChangeText={handleOtherChange}
              />
            ) : (
              <Text style={styles.text}>{formData.other}</Text>
            )}

            <Text style={styles.label}>Other/इतर:</Text>
            {editMode ? (
              <TextInput
                style={[styles.input, { color: 'black' }]}
                value={editedOther}
                onChangeText={handleOtherChange}
              />
            ) : (
              <Text style={styles.text}>{formData.other}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleSaveChangesfield} >
            <Text style={[styles.saveChangesButtonText, { color: 'white' }]}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleSaveChangesfield} >
            <Text style={[styles.saveChangesButtonText, { color: 'white' }]}>Save Changes</Text>
          </TouchableOpacity>
          {/* Add more data fields here with labels and text */}
        </View>
      ) : (
        <Text style={styles.errorText}>Data not found</Text>
      )}


      {/* <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: 20,
          right: -30,
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 90,
        }}
        onPress={generatePDF}
      >
        <Image
          source={require('../assets/printer1.png')}
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            backgroundColor: '#f4f4f4',
            marginEnd: 30,
            marginBottom: 40
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: -40, marginEnd: 35 }}> PDF</Text>
      </TouchableOpacity> */}



      {/* <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: 20,
          right: -30,
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 90,
        }}
        onPress={generatePDF}
      >
        <Image
          source={require('../assets/printer1.png')}
          style={{
            width: 35,
            height: 35,
            borderRadius: 10,
            backgroundColor: '#f4f4f4',
            marginEnd: 30,
            marginBottom: 40
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: -40, marginEnd: 35 }}> PDF</Text>
      </TouchableOpacity> */}

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
  fldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // other styles
  },
  input: {
    color: 'black'
  },
  fldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // other styles
  },
  input: {
    color: 'black'
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
    color: 'black'
    color: 'black'
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
    color: 'black'
    color: 'black'
  },
  siblingTableHeaderCell: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: 'black'
    color: 'black'
  },
  siblingTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: 'black'
    color: 'black'
  },
  siblingTableCell: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: COLORS.black
    color: COLORS.black
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
    marginTop: 8
  },
  checkboxChecked: {
    backgroundColor: 'teal',
    borderColor: 'teal',
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop: 8
    marginTop: 8
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
  editIcon:
  {
    height: 25,
    width: 25,
    marginStart: 100,
  }

  editIcon:
  {
    height: 25,
    width: 25,
    marginStart: 100,
  }

});

export default ViewForm;