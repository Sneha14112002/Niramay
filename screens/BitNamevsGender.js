import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal
} from 'react-native';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { FlatList } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // Import Calendar
import { API_URL } from './config';
import RNFS from 'react-native-fs';

const CustomMenuButton = ({ toggleMenu }) => {
  const handleMenuToggle = () => {
    toggleMenu();
  };

  return (
    <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
      <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
    </TouchableOpacity>
  );
};

const BitNamevsGender = ({ toggleMenu,route }) => {
  //const {role,name}=route.params;
  const [data, setData] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [childListModalVisible, setChildListModalVisible] = useState(false);
  const [childList, setChildList] = useState([]);
  const [selectedBitName, setSelectedBitName] = useState(null);
  const [pdfCounter, setPdfCounter] = useState(null);
  const navigation = useNavigation();
  const chartRef = useRef();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenuButton toggleMenu={toggleMenu} />,
    });
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, [selectedFromDate, selectedToDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/childData`, {
        params: { fromDate: selectedFromDate, toDate: selectedToDate },
      });

      if (response.data && response.data.length > 0) {
        // Aggregate data by bit name
        const aggregatedData = response.data.reduce((acc, curr) => {
          const { bit_name, total_children_count } = curr;
          if (!acc[bit_name]) {
            acc[bit_name] = parseInt(total_children_count);
          } else {
            acc[bit_name] += parseInt(total_children_count);
          }
          return acc;
        }, {});

        // Convert aggregated data into array format for rendering
        const aggregatedArray = Object.keys(aggregatedData).map((bit_name) => ({
          bit_name,
          total_children_count: aggregatedData[bit_name],
        }));

        setData(aggregatedArray);
      } else {
        setData([]);
        Alert.alert('No Data', 'No data available for the selected date range.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };



  const chartData = data.map((item) => ({
    bit_name: item.bit_name,
    total_children_count: parseInt(item.total_children_count),
  }));

  const xAxisTickValues = data.map((item, index) => ({
    x: index + 1,
    label: item.bit_name,
  }));

  const resetDateSelection = () => {
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setShowCalendar(true);
  };

  const formatDate = (dateString) => {
    // Add your date formatting logic here
    return dateString;
  };

  const generateHTML = (chartImageUri, allYearsChartData) => {
    // Format the selected dates
    const formattedFromDate = formatDate(selectedFromDate);
    const formattedToDate = formatDate(selectedToDate);
    const isDatesSelected = selectedFromDate && selectedToDate;

    // Include selected dates HTML only if both dates are selected
    const selectedDatesHtml = isDatesSelected ? `
      <div style="margin-top: 20px; text-align: center;">
        <p style="font-size: 16px; color: #333;">Selected Date Range: ${formatDate(selectedFromDate)} - ${formatDate(selectedToDate)}</p>
      </div>
    ` : '';

    const chartHtml = `
      <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
      </div>
    `;

    const tableHtml = `
      <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
        <Text style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Bit Name vs Count of Children</Text>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Bit Name</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Count</th>
          </tr>
          ${allYearsChartData.map(item => `
            <tr>
              <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.total_children_count}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;



    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
            }
            .headerContainer {
              display: flex;
              align-items: left;
              border-bottom: 1px solid orange;
              padding-bottom: 15px;
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
              padding-bottom:25px;
            }
            .subheading {
              font-size: 18px;
              color: orange;
              margin-left:20px;
            }
            .textContainer {
              margin-left: 10px;
            }
          </style>
        </head>
        <body>
          <div class="headerContainer">
            <img src="file:///android_asset/images/logo2.jpg" />
            <div class="textContainer">
              <div class="headingLine">Niramay</div>
              <div class="subheading">सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</div>
            </div>
          </div>
          ${selectedDatesHtml}
          <Text style="font-size: 20px; font-weight: bold; margin-bottom: 10px;margin-top:20px; color: #333; text-align: center;">Total Children by Bit Name</Text>
          ${chartHtml}
          <Text style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #333; text-align: center;">Summary Table</Text>
          ${tableHtml}

        </body>
      </html>
    `;

    return htmlContent;
  };


  const captureChart = async () => {
    try {
      // Capture the chart as an image
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };
  const generatePDF = async () => {
    try {
      // Capture the chart before generating the PDF
      const chartImageUri = await captureChart();

      if (chartImageUri) {
        const allYearsChartData = data.reduce((result, item) => {
          const existingItem = result.find((x) => x.bit_name === item.bit_name);
          if (existingItem) {
            existingItem.total_children_count += parseInt(item.total_children_count);
          } else {
            result.push({
              bit_name: item.bit_name,
              total_children_count: parseInt(item.total_children_count),
            });
          }
          return result;
        }, []);

        // Increment the PDF counter
        const newPdfCounter = pdfCounter + 1;
        setPdfCounter(newPdfCounter);

        const options = {
          html: generateHTML(chartImageUri, allYearsChartData),
          fileName: `TotalChildrenPerBit_${newPdfCounter}`, // Use the counter in the filename
          directory: 'Documents/ConsolidatedReports',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        const pdfPath = pdf.filePath;

        // Move the generated PDF to the Downloads directory
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/TotalChildrenPerBit_${newPdfCounter}.pdf`;

        await RNFS.moveFile(pdfPath, newPdfPath);

        // Display an alert dialog after the PDF is generated
        Alert.alert(
          'PDF Generated!',
          `PDF has been generated successfully in downloads folder with filename: TotalChildrenPerBit_${newPdfCounter}.pdf`,
          [
            {
              text: 'OK',
              onPress: () => { },
            },
          ]
        );
      } else {
        console.error('Chart capture failed.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const openChildListModal = async (bitName) => {
    try {
      setSelectedBitName(bitName);
      const response = await axios.get(`${API_URL}/childList`, {
        params: { bitName: bitName, fromDate: selectedFromDate, toDate: selectedToDate },
      });
      console.log('Child List:', response.data);
      setChildList(response.data);
      setChildListModalVisible(true);
    } catch (error) {
      console.error('Error fetching child list:', error);
    }
  };


  const renderChildList = () => {
    if (!childList.length) {
      return <Text style={styles.noChildListText}>No children in this Bit Name</Text>;
    }

    const resetDateSelection = () => {
      setSelectedFromDate(null);
      setSelectedToDate(null);
      // Show the calendar again after resetting the selection
      setShowCalendar(true);
    };


    return (
      <FlatList
        data={childList}
        keyExtractor={(item) => `${item.bit_name}_${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.modalItem}>
            <Text style={styles.modalItemText}>{item.child_name}</Text>
            <Text style={styles.modalItemText}>{item.anganwadi_no}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Total Children by Bit Name</Text>

      <Text style={styles.label}>Select Year:</Text>
      {showCalendar ? (
        <Calendar
          onDayPress={(day) => {
            if (!selectedFromDate) {
              setSelectedFromDate(day.dateString);
            } else if (!selectedToDate) {
              setSelectedToDate(day.dateString);
              setShowCalendar(false);
            } else {
              resetDateSelection();
            }
          }}
          markedDates={{
            [selectedFromDate]: { selected: true, marked: true, selectedColor: 'blue' },
            [selectedToDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
          style={{ borderRadius: 50, width: 350, marginLeft: 5, marginTop: 20 }}
        />
      ) : (
        <View style={styles.dateSelectionContainer}>
          <Text style={styles.dateSelectionText}>
            {`Selected Dates: ${formatDate(selectedFromDate)} - ${formatDate(selectedToDate)}`}
          </Text>
          <TouchableOpacity onPress={resetDateSelection}>
            <Text style={styles.resetDateSelectionText}>Change Dates</Text>
          </TouchableOpacity>
        </View>
      )}

      {data.length > 0 ? (
        <ScrollView horizontal={true}>
          <View style={styles.chartContainer} collapsable={false}>
            <ViewShot ref={chartRef} options={{ format: 'png', quality: 0.8 }}>
              <VictoryChart
                domainPadding={{ x: 5 }}
                padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
                height={450}
                width={data.length > 1 ? data.length * 100 : 300} // Adjust the width for single data entry
              >
                <VictoryAxis
                  label="Bit Name"
                  tickValues={xAxisTickValues.map((tick) => tick.x)}
                  tickLabelComponent={<VictoryLabel angle={0} />}
                  style={{
                    axisLabel: { padding: 30 },
                  }}
                  tickFormat={(tick, index) => xAxisTickValues[index]?.label || ''}
                />
                <VictoryAxis
                  dependentAxis
                  label="Count of Children"
                  style={{
                    axisLabel: { padding: 30 },
                  }}
                />
                <VictoryBar
                  data={chartData}
                  x="bit_name"
                  y="total_children_count"
                  style={{ data: { fill: 'rgba(180, 80, 130, 1)' } }}
                  barWidth={20}
                  alignment="start"
                  labels={({ datum }) => datum.total_children_count}
                  labelComponent={<VictoryLabel dx={10} dy={0} />}
                />
              </VictoryChart>
            </ViewShot>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chartContainer}>
          <Text>No data available</Text>
        </View>
      )}
      {console.log(data)}
      <Text style={styles.summaryTableTitle}>Summary Table</Text>

      {data.length > 0 ? (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Bit Name vs Count of Children</Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.bit_name}_${index}`} // Use index as a fallback key
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openChildListModal(item.bit_name)}>
                <View style={styles.tableRow}>
                  <Text style={styles.bitName}>{item.bit_name}</Text>
                  <Text style={styles.childCount}>{item.total_children_count}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <Text>No data available</Text>
        </View>
      )}



      {/* Child List Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={childListModalVisible}
        onRequestClose={() => setChildListModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedBitName} - Child List</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText}>Anganwadi No</Text>
            </View>
            {renderChildList()}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setChildListModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={{
          ...styles.printButton,
          position: 'absolute',
          top: -10,
          right: -20,
          flexDirection: 'column',
          alignItems: 'center',
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
            marginEnd: 40,
          }}
        />
        <Text style={{ color: 'black', fontSize: 14, marginTop: 3, marginEnd: 45 }}> PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  chartContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  summaryTableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    margin: 16,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bitName: {
    flex: 1,
    textAlign: 'left',
    color: '#333',
    fontSize: 16,
  },
  childCount: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
    fontSize: 16,
  },
  pdfButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    margin: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4,
    width: 250,
  },
  dropdown: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownMenu: {
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dropdownMenuItemText: {
    fontSize: 16,
    color: 'black',
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'black',
  },
  noChildListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 200,
    paddingBottom: 200,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    padding: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  closeModalButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 10,
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableHeaderText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  selectedDatesContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    margin: 16,
    padding: 16,
  },
  selectedDatesText: {
    fontSize: 16,
    color: 'black',
  },
  resetDateSelectionText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 8,
    textAlign: 'center',
  },
  dateSelectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    margin: 16,
    padding: 16,
  },
  dateSelectionText: {
    fontSize: 16,
    color: 'black',
  },
  calendarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  calendarScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  calendar: {
    borderRadius: 50,
    width: 350,
  },
});

export default BitNamevsGender;