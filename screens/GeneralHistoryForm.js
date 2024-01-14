import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Button, windowWidth,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import COLORS from '../constants/colors';
import { API_URL } from './config';
const checkmarkImage = require('../assets/check-mark.png');
import CheckBox from 'react-native-check-box';
import { useEffect } from 'react';
import { RadioButton} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';



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

const SupplementCounter = ({ value, onIncrement, onDecrement }) => {
  return (
    <View style={styles.supplementCounter}>
      <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const VisitRow = ({ visit, index, handleVisitFieldChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(visit.date);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    handleVisitFieldChange(index, 'date', date); // Update the date in the visits array
  };

  return (
    <View>
    <Text style={styles.label}>Visit Date:</Text>
    <View style={styles.dateContainer}>
  <TouchableOpacity onPress={() => setShowCalendar(true)}>
    <Text >Select Visit Date:</Text>
    <Text style={{ color: '#000', marginLeft: 10 ,marginBottom:10}}>{selectedDate}</Text>
  </TouchableOpacity>
</View>

      
      {showCalendar && (
        <View>
          <Calendar
            onDayPress={(day) => handleDateSelect(day.dateString)}
            current={selectedDate}
            hideExtraDays
            markedDates={{
              [selectedDate]: { selected: true },
            }}
          />
          <TouchableOpacity onPress={() => setShowCalendar(false)}>
            <Text>Close Calendar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>Haemoglobin:</Text>
      <TextInput
        value={visit.haemoglobin}
        onChangeText={(text) => handleVisitFieldChange(index, 'haemoglobin', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.label}>Iron:</Text>
      <SupplementCounter
        value={visit.iron}
        onIncrement={() => handleVisitFieldChange(index, 'iron', visit.iron + 1)}
        onDecrement={() => handleVisitFieldChange(index, 'iron', Math.max(0, visit.iron - 1))}
      />

      <Text style={styles.label}>Calcium:</Text>
      <SupplementCounter
        value={visit.calcium}
        onIncrement={() => handleVisitFieldChange(index, 'calcium', visit.calcium + 1)}
        onDecrement={() => handleVisitFieldChange(index, 'calcium', Math.max(0, visit.calcium - 1))}
      />

      <Text style={styles.label}>Protein:</Text>
      <SupplementCounter
        value={visit.protein}
        onIncrement={() => handleVisitFieldChange(index, 'protein', visit.protein + 1)}
        onDecrement={() => handleVisitFieldChange(index, 'protein', Math.max(0, visit.protein - 1))}
      />

      <Text style={styles.label}>Multivitamin:</Text>
      <SupplementCounter
        value={visit.multivitamin}
        onIncrement={() => handleVisitFieldChange(index, 'multivitamin', visit.multivitamin + 1)}
        onDecrement={() => handleVisitFieldChange(index, 'multivitamin', Math.max(0, visit.multivitamin - 1))}
      />

      <Text style={styles.label}>Total No. of Supplements:</Text>
      <TextInput
        value={visit.totalNoOfJars}
        onChangeText={(text) => handleVisitFieldChange(index, 'totalNoOfJars', text)}
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

      {/* <Text style={styles.label}>Weight (Kg):</Text>
      <TextInput
        value={visit.weight}
        onChangeText={(text) => handleVisitFieldChange(index, 'weight', text)}
        keyboardType="phone-pad"
        style={styles.textInput}
      /> */}

      <Text style={styles.label}>Weight:</Text>
      <View style={styles.supplementContainer}>
        <TextInput
          value={visit.tempWeightKg}
          onChangeText={(text) => {
            console.log('Text input for kg changed:', text);
            handleVisitFieldChange(index, 'tempWeightKg', text);
          }}
          keyboardType="phone-pad"
          style={styles.textInput}
        />
        <Text style={{ marginHorizontal: 10, fontSize: 16, color: 'black' }}>kg</Text>
        <TextInput
          value={visit.tempWeightGrams}
          onChangeText={(text) => {
            console.log('Text input for grams changed:', text);
            handleVisitFieldChange(index, 'tempWeightGrams', text);
          }}
          keyboardType="phone-pad"
          style={[styles.textInput, { marginLeft: 15 }]}
        />
        <Text style={{ marginHorizontal: 10, fontSize: 16, color: 'black' }}>grams</Text>
      </View>

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
          handleVisitFieldChange(index, 'observations', text)
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
  const [appetiteValue, setAppetiteValue] = React.useState('yes'); // State to store the selected value
  const navigation = useNavigation();
  const handleRadioButtonChange = (value) => {
    setAppetiteValue(value);
    handleTextInputChange('appetiteTest', value); // Assuming handleTextInputChange is a function to handle state changes
  };

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
    totalWeight: '',
    vaccination: {
      BCG: false,
      POLIO: false,
      IPV: false,
      PCV: false,
      PENTAVALENT: false,
      ROTAVIRUS: false,
      MR: false,
      VITAMIN_A: false,
      DPT: false,
      TD: false,
    },
  });

  const handleAddVisit = () => {
    const newVisit = {
      date: '',
      totalNoOfJars: '0',
      haemoglobin: '0',
      muac: '0',
      weight: '0',
      height: '0',
      difference: '',
      grade: '0',
      observations: '',
      iron: 0,
      multivitamin: 0,
      calcium: 0,
      protein: 0,
      tempWeightKg: 0,
      tempWeightGrams: 0,
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
        appetiteTest: appetiteValue,
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
        bcg: generalHistory.vaccination.BCG,
        polio: generalHistory.vaccination.POLIO,
        ipv: generalHistory.vaccination.IPV,
        pcv: generalHistory.vaccination.PCV,
        pentavalent: generalHistory.vaccination.PENTAVALENT,
        rotavirus: generalHistory.vaccination.ROTAVIRUS,
        mr: generalHistory.vaccination.MR,
        vitamin_a: generalHistory.vaccination.VITAMIN_A,
        dpt: generalHistory.vaccination.DPT,
        td: generalHistory.vaccination.TD,
      };
      //console.log(generalHistoryData);
      //console.log('API URL', API_URL);
      const response = await fetch(`${API_URL}/generalHistory`, {
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
        //console.log(response);
        console.error('Error submitting form - response error');
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
        console.log("VISITTTTT: ",visit);
       
        const visitData = {
          anganwadiNo: anganwadiNo,
          childName: childsName,
          visitDate: visit.date,
          haemoglobin: visit.haemoglobin,
          totalNoOfJars: visit.totalNoOfJars,
          muac: visit.muac,
          weight: visit.weight,
          height: visit.height,
          difference: visit.difference,
          grade: visit.grade,
          observations: visit.observations,
          iron: visit.iron,
          multivitamin: visit.multivitamin,
          calcium: visit.calcium,
          protein: visit.protein,
        };
        //console.log(visitData);
        const response = await fetch(`${API_URL}/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        if (response.status === 200) {
          console.log('Visit data submitted successfully');
          Alert.alert('Success', 'Visit data submitted successfully', [
            {
              text: 'Okay',
              onPress: () => {
                navigation.navigate('ChildPresent'); // Replace 'HomePage' with your actual home screen name
              },
            },
          ]);
          
          // Add any additional logic or navigation here after each successful submission
        } else {
          console.error('Error submitting visit data - response error');
        }
      }
    } catch (error) {
      console.error('Error submitting visit data:', error);
    }
  };

  const handleToggle = (field) => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      [field]: !prevHistory[field],
    }));
  };


  const handleRemoveVisit = () => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      visits: prevHistory.visits.slice(0, -1),
    }));
  };

  // const handleVisitFieldChange = (index, field, value) => {
  //   // Assuming the date field is 'visit.date'
  //   const newVisits = [...generalHistory.visits];
  //   newVisits[index][field] = value;
  //   setGeneralHistory((prevHistory) => ({
  //     ...prevHistory,
  //     visits: newVisits,
  //   }));
  // };

  const handleVisitFieldChange = (index, field, value) => {
    setGeneralHistory((prevHistory) => {
      const newVisits = [...prevHistory.visits];
      newVisits[index] = {
        ...newVisits[index],
        [field]: value,
      };
 
      return {
        ...prevHistory,
        visits: newVisits,
      };
    });
  };
 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setGeneralHistory((prevHistory) => {
        const newVisits = [...prevHistory.visits];
        newVisits.forEach((visit, index) => {
          let weightKg = parseFloat(visit.tempWeightKg) || 0;
          let weightGrams = parseFloat(visit.tempWeightGrams) || 0;
          let totalWeight = weightKg + weightGrams / 1000;
          newVisits[index] = {
            ...visit,
            weight: totalWeight.toFixed(3),
          };
        });
 
        return {
          ...prevHistory,
          visits: newVisits,
        };
      });
    }, 300);
 
    return () => clearTimeout(timeoutId);
  }, [generalHistory.visits]);
 

  const handleTextInputChange = (field, value) => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      [field]: value,
    }));
  };

  const handleToggleVaccination = (vaccine) => {
    setGeneralHistory((prevHistory) => ({
      ...prevHistory,
      vaccination: {
        ...prevHistory.vaccination,
        [vaccine]: !prevHistory.vaccination[vaccine],
      },
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CollapsibleSectionWithIcon title={<Text style={styles.sectionTitle}>Test / चाचणी</Text>}>


          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Vomiting</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('vomiting')}
              isChecked={generalHistory.vomiting}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 155 }} // Add marginRight to create space
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Fever</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('fever')}
              isChecked={generalHistory.fever}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 180 }} // Add marginRight to create space
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Common Cold</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('commonCold')}
              isChecked={generalHistory.commonCold}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 115 }}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Cough</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('cough')}
              isChecked={generalHistory.cough}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 170 }}
            />

          </View>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Oedema</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('oedema')}
              isChecked={generalHistory.oedema}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 155 }}
            />

          </View>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Vaccination</Text>
            <CheckBox
              checkBoxColor="teal"
              onClick={() => handleToggle('vaccinationDone')}
              isChecked={generalHistory.vaccinationDone}
              textStyle={{ fontSize: 16, color: 'black' }}
              style={{ marginLeft: 130 }}
            />
          </View>

          <Text style={styles.label}>Appetite Test:</Text>
      <RadioButton.Group onValueChange={handleRadioButtonChange} value={appetiteValue}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="yes" />
          <Text style={{ color: '#000', marginLeft: 10 }} >Yes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton value="loss Of Appetite" />
          <Text style={{ color: '#000', marginLeft: 10 }}>Loss of Appetite</Text>
        </View>
      </RadioButton.Group>


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

        <CollapsibleSectionWithIcon title={<Text style={styles.sectionTitle}>Vaccination / टीकाकरण</Text>}>
          {Object.keys(generalHistory.vaccination).map((vaccine, index) => (
            <View key={index} style={[styles.checkboxContainer, { justifyContent: 'space-between' }]}>
              <Text style={styles.checkboxLabel}>{vaccine}</Text>
              <CheckBox
                checkBoxColor="teal"
                onClick={() => handleToggleVaccination(vaccine)}
                isChecked={generalHistory.vaccination[vaccine]}
                textStyle={{ fontSize: 16, color: 'black' }}
                style={{ marginLeft: 10, }} // Adjust margin as needed
              />
            </View>
          ))}
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
    color: COLORS.black,
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
    color: COLORS.black,
  },
  subSectionTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    color: COLORS.black,
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
    color: COLORS.black,
    marginTop: 10,
    marginBottom: 10
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {

    fontSize: 16,
    color: 'black', // Adjust the color to make text visible
  },
  checkboxLabel: {
    marginLeft: 10, // Add margin to separate checkbox from label
    fontSize: 16,
    color: COLORS.black,
  },
  supplementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplementCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  counterButton: {
    backgroundColor: 'teal',  // Set the background color to teal
    borderRadius: 8,
    //padding: 5,
    marginRight: 5, // Add some margin between the buttons
    height: 30, // Set a fixed height
    width: 40,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  buttonText: {
    fontSize: 22,
    color: 'white', // Set the text color to white
    // textAlign: 'center',
    // textAlignVertical: 'center',

  },
  counterValue: {
    fontSize: 18,
    paddingHorizontal: 15,
    color: COLORS.black,
    //lineHeight: 30,
  },
  dateContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgrey',
    padding: 5,
  },
 
});

export default GeneralHistoryForm;