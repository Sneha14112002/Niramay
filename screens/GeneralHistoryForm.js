import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Button, windowWidth } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import COLORS from '../constants/colors';
import { API_URL } from './config';
const checkmarkImage = require('../assets/check-mark.png');
import CheckBox from 'react-native-check-box';

const CollapsibleSectionWithIcon = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.collapsibleSection}>
      <TouchableOpacity
        onPress={toggleCollapsed}
        style={[
          styles.sectionHeaderBar,
          {
            backgroundColor: collapsed ? 'lightblue' : 'lightblue',
            height: collapsed ? 80 : 80,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.0,
            shadowRadius: 0,
            elevation: 0,
          }
        ]}
      >
        <Text>{title}</Text>
        {collapsed ? (
        <Image source={require('../assets/up.png')} style={styles.icon} />
      ) : (
        <Image source={require('../assets/down.png')} style={styles.icon} />
      )}
      </TouchableOpacity>
      {collapsed && (
        <View style={[styles.sectionContent]}>
          {children}
        </View>
      )}
    </View>
  );
};


const VisitRow = ({ visit, index, handleVisitFieldChange }) => {
  return (
    <View>
      <Text style={styles.label}>Date:</Text>
      <TextInput
        value={visit.date}
        onChangeText={(text) => handleVisitFieldChange(index, 'date', text)}
        placeholder="DD-MM-YYYY"
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.textInput}
      />

      <Text style={styles.label}>Haemoglobin:</Text>
      <TextInput
        value={visit.haemoglobin}
        onChangeText={(text) => handleVisitFieldChange(index, 'haemoglobin', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>No. of Supplements:</Text>
      <TextInput
        value={visit.noOfSupplements}
        onChangeText={(text) => handleVisitFieldChange(index, 'noOfSupplements', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>MUAC:</Text>
      <TextInput
        value={visit.muac}
        onChangeText={(text) => handleVisitFieldChange(index, 'muac', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>Weight (Kg):</Text>
      <TextInput
        value={visit.weight}
        onChangeText={(text) => handleVisitFieldChange(index, 'weight', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        value={visit.height}
        onChangeText={(text) => handleVisitFieldChange(index, 'height', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>Grade:</Text>
      <TextInput
        value={visit.grade}
        onChangeText={(text) => handleVisitFieldChange(index, 'grade', text)}
        style={styles.textInput}
      />


      <Text style={styles.label}>Difference:</Text>
      <TextInput
        value={visit.difference}
        onChangeText={(text) => handleVisitFieldChange(index, 'difference', text)}
        style={styles.textInput}
      />
<Text style={styles.label}>Observations And Suggestions :</Text>
          <TextInput
            label="Observations and Suggestions"
            multiline
            value={visit.observations}
            onChangeText={(text) =>
              handleTextInputChange('observations', text)
            }
            style={styles.multilineTextInput}
          />
      
    </View>
  );
};

const VisitsTable = ({ visits, handleAddVisit, handleRemoveVisit, handleVisitFieldChange }) => {
  return (
    <View>
      <Text style={styles.subSectionTitle}>Visits</Text>
      {visits.map((visit, index) => (
        <View key={index}>
          <View style={styles.visitSeparator} />
          <View style={styles.visitRow}>
            <VisitRow visit={visit} index={index} handleVisitFieldChange={handleVisitFieldChange} />
          </View>
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="    Add    " onPress={handleAddVisit} color="#009688" style={{ borderRadius: 8 }} />
        <Button title="Remove" onPress={handleRemoveVisit} color="red" style={{ borderRadius: 8 }} />
      </View>
    </View>
  );
};

const GeneralHistoryForm = () => {
  const [generalHistory, setGeneralHistory] = useState({
    vomiting: false,
    fever: false,
    commonCold: false,
    cough: false,
    oedema: false,
    vaccinationDone: false,
    appetiteTest: '',
    thirst: '',
    //haemoglobin: ' ',
    anyOther: '',
    face: '',
    hair: '',
    eye: '',
    ear: '',
    abdomen: '',
    motion: '',
    otherSigns: '',
    visits: [],
  });

  const handleAddVisit = () => {
    const newVisit = {
      date: '',
      noOfSupplements: '',
      haemoglobin: '',
      muac: '',
      weight: '',
      height: '',
      difference: '',
      grade: '',
      observations: '',
      
    };
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      visits: [...prevHistory.visits, newVisit],
    }));
  };

  const route = useRoute();
  const { anganwadiNo, childsName } = route.params;
  console.log(anganwadiNo);
  console.log(childsName);
  const handleGeneralHistory = async () => {

    try {
      const generalHistoryData = {
        anganwadiNo: anganwadiNo,
        childName: childsName,
        vomiting: generalHistory.vomiting, // Accessing values from generalHistory state
        fever: generalHistory.fever,
        commonCold: generalHistory.commonCold,
        cough: generalHistory.cough,
        oedema: generalHistory.oedema,
        vaccinationDone: generalHistory.vaccinationDone,
        appetiteTest: generalHistory.appetiteTest,
        thirst: generalHistory.thirst,
        //haemoglobin: generalHistory.haemoglobin,
        anyOther: generalHistory.anyOther,
        face: generalHistory.face,
        hair: generalHistory.hair,
        eye: generalHistory.eye,
        ear: generalHistory.ear,
        abdomen: generalHistory.abdomen,
        motion: generalHistory.motion,
        otherSigns: generalHistory.otherSigns,
        observationsAndSuggestions: generalHistory.observationsAndSuggestions,
      };
      console.log(generalHistoryData);
      const response = await fetch(`${ API_URL }/generalHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalHistoryData),
      });

      if (response.status === 200) {
        //console.log(response.body);
        console.log('Form submitted successfully');
        // Add any additional logic or navigation here after successful submission
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };




  const handleGeneralHistoryVisits = async () => {
    console.log('Anganwadi No: ', anganwadiNo);
    console.log('Child name: ', childsName);
    try {
      for (const visit of generalHistory.visits) {

        const visitData = {
          anganwadiNo: anganwadiNo,
          childName: childsName,
          visitDate: visit.date,
          haemoglobin: visit.haemoglobin,
          noOfSupplements: visit.noOfSupplements,
          muac: visit.muac,
          weight: visit.weight,
          height: visit.height,
          difference: visit.difference,
          grade: visit.grade,
        };
        console.log(visitData);
        const response = await fetch(`${ API_URL }/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        if (response.status === 200) {
          console.log('Visit data submitted successfully');
          // Add any additional logic or navigation here after each successful submission
        } else {
          console.error('Error submitting visit data');
        }
      }
    } catch (error) {
      console.error('Error submitting visit data:', error);
    }
  };



  const handleRemoveVisit = () => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      visits: prevHistory.visits.slice(0, -1),
    }));
  };

  const handleVisitFieldChange = (index, field, value) => {
    const newVisits = [...generalHistory.visits];
    newVisits[index][field] = value;
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      visits: newVisits,
    }));
  };

  const handleToggle = (field) => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      [field]: !prevHistory[field],
    }));
  };

  const handleTextInputChange = (field, value) => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CollapsibleSectionWithIcon title={<Text style={styles.sectionTitle}>Test / चाचणी</Text>}>


        <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('vomiting')}
            isChecked={generalHistory.vomiting}
            leftText="Vomiting"
          />
          <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('fever')}
            isChecked={generalHistory.fever}
            leftText="Fever"
          />
          <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('commonCold')}
            isChecked={generalHistory.commonCold}
            leftText="Common Cold"
          />
          <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('cough')}
            isChecked={generalHistory.cough}
            leftText="Cough"
          />
          <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('oedema')}
            isChecked={generalHistory.oedema}
            leftText="Oedema"
          />
          <CheckBox
            checkBoxColor="teal"
            onClick={() => handleToggle('vaccinationDone')}
            isChecked={generalHistory.vaccinationDone}
            leftText="Vaccination Done"
          />

          <Text style={styles.label}>Appetite Test:</Text>
          <TextInput
            label="Appetite Test"
            multiline={true}
            value={generalHistory.appetiteTest}
            onChangeText={(text) => handleTextInputChange('appetiteTest', text)}
            style={styles.multilineTextInput}
          />


          <Text style={styles.label}>Thirst :</Text>
          <TextInput
            label="Thirst"
            multiline={true}
            value={generalHistory.thirst}
            onChangeText={(text) => handleTextInputChange('thirst', text)}
            style={styles.multilineTextInput}
          />

         

          <Text style={styles.label}>Any Other :</Text>
          <TextInput
            label="Any Other"
            multiline={true}
            value={generalHistory.anyOther}
            onChangeText={(text) => handleTextInputChange('anyOther', text)}
            style={styles.multilineTextInput}
          />
        </CollapsibleSectionWithIcon>

        <CollapsibleSectionWithIcon title={<Text style={styles.sectionTitle}>Symptoms Observed / लक्षणे</Text>}>
          <Text style={styles.label}>Face:</Text>
          <TextInput
            label="Face"
            multiline={true}
            value={generalHistory.face}
            onChangeText={(text) => handleTextInputChange('face', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Hair :</Text>
          <TextInput
            label="Hair"
            multiline={true}
            value={generalHistory.hair}
            onChangeText={(text) => handleTextInputChange('hair', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Eye :</Text>
          <TextInput
            label="Eye"
            multiline={true}
            value={generalHistory.eye}
            onChangeText={(text) => handleTextInputChange('eye', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Ear :</Text>
          <TextInput
            label="Ear"
            multiline={true}
            value={generalHistory.ear}
            onChangeText={(text) => handleTextInputChange('ear', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Abdomen :</Text>
          <TextInput
            label="Abdomen"
            multiline={true}
            value={generalHistory.abdomen}
            onChangeText={(text) => handleTextInputChange('abdomen', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Motion :</Text>
          <TextInput
            label="Motion"
            multiline={true}
            value={generalHistory.motion}
            onChangeText={(text) => handleTextInputChange('motion', text)}
            style={styles.multilineTextInput}
          />

          <Text style={styles.label}>Other :</Text>
          <TextInput
            label="Other"
            multiline={true}
            value={generalHistory.otherSigns}
            onChangeText={(text) => handleTextInputChange('otherSigns', text)}
            style={styles.multilineTextInput}
          />
        </CollapsibleSectionWithIcon>

        

        <CollapsibleSectionWithIcon title={<Text style={styles.sectionTitle}>Visits / भेटी</Text>}>
          <VisitsTable
            visits={generalHistory.visits}
            handleAddVisit={handleAddVisit}
            handleRemoveVisit={handleRemoveVisit}
            handleVisitFieldChange={handleVisitFieldChange}
          />
        </CollapsibleSectionWithIcon>

        <TouchableOpacity
          onPress={() => {
            // Add your submit logic here
            handleGeneralHistoryVisits();
            handleGeneralHistory();
          }}
          style={styles.submitbutton}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 20,
    padding: wp('10%'),
    paddingHorizontal: wp('1%'),
    paddingTop: wp('10%'),
  },
  icon: {
    width: 26, // Adjust as needed
    height: 30, // Adjust as needed
  },
  scrollContainer: {
    flexGrow: 10,
    padding: wp('5%'),
  },
  navBar: {
    backgroundColor: '#009688',
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  navText: {
    color: 'white',
    fontSize: wp('5%'),
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  collapsibleSection: {
    marginBottom: hp('2%'),
  },
  customButtonStyle: {
    height: 800
  },
  sectionContent: {
    backgroundColor: 'white',
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    marginTop: hp('1%'),
  },
  button: {
    marginTop: hp('3%'),
    backgroundColor: '#009688',
  },
  textInput: {
    backgroundColor: 'white',
    marginVertical: hp('1%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    color:COLORS.black,
  },
  multilineTextInput: {
    backgroundColor: 'white',
    marginVertical: hp('1%'),
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    height: hp('8%'),
    textAlignVertical: 'top',
    color:COLORS.black,
  },
  subSectionTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    color:COLORS.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
    marginBottom: hp('4%'),
    paddingHorizontal: hp('2%'),
    borderRadius: 8,
  },
  visitRow: {
    flexDirection: 'column',
  },
  submitbutton: {
    backgroundColor: 'teal',
    paddingVertical: 15,
    paddingHorizontal: 65,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 60,
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
  visitSeparator: {
    height: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color:COLORS.black,
    marginTop: 10, 
    marginBottom: 10 
},
});

export default GeneralHistoryForm;