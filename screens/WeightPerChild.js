import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {VictoryChart, VictoryBar, VictoryAxis} from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import {API_URL} from './config.js';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const WeightPerChild = ({route, toggleMenu}) => {
  const {anganwadiNo, childsName, gender, dob} = route.params;
  const navigation = useNavigation();

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {VictoryChart, VictoryBar, VictoryAxis} from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import {API_URL} from './config.js';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const WeightPerChild = ({route, toggleMenu}) => {
  const {anganwadiNo, childsName, gender, dob} = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [pdfCounter, setPdfCounter] = useState(1);
  const formatDate = utcDate => {
    const options = {
      timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return new Date(utcDate).toLocaleDateString('en-IN', options);
  };

  const onDayPress = day => {
    // Callback function when a day is pressed on the calendar
    if (!selectedFromDate) {
      // If "from" date is not selected, set it
      setSelectedFromDate(day.dateString);
    } else if (!selectedToDate) {
      // If "from" date is selected but "to" date is not, set "to" date
      setSelectedToDate(day.dateString);
    } else {
      // If both "from" and "to" dates are selected, reset selection
      setSelectedFromDate(day.dateString);
      setSelectedToDate(null);
    }
  };

  useEffect(() => {
    // Fetch data based on selected date range
    fetchData(selectedFromDate, selectedToDate);
  }, [selectedFromDate, selectedToDate]);

  const fetchData = async (fromDate, toDate) => {
    try {
      const requestData = {
        anganwadiNo,
        childsName,
        fromDate,
        toDate,
      };
    // Fetch data based on selected date range
    fetchData(selectedFromDate, selectedToDate);
  }, [selectedFromDate, selectedToDate]);

  const fetchData = async (fromDate, toDate) => {
    try {
      const requestData = {
        anganwadiNo,
        childsName,
        fromDate,
        toDate,
      };

      const response = await fetch(`${API_URL}/getVisitsData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const response = await fetch(`${API_URL}/getVisitsData`, {
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
        showFlashMessage('No data found between the selected date range.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showFlashMessage('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
      if (response.status === 200) {
        const data = await response.json();
        setFormData(data);
      } else {
        console.log('Data not found in the database');
        showFlashMessage('No data found between the selected date range.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showFlashMessage('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showFlashMessage = message => {
    Alert.alert('Flash Message', message);
  };

  const {data} = formData || {};
  const weights = data ? data.map(entry => parseFloat(entry.weight)) : [];
  const visitDates = data ? data.map(entry => formatDate(entry.visitDate)) : [];
  const showFlashMessage = message => {
    Alert.alert('Flash Message', message);
  };

  const {data} = formData || {};
  const weights = data ? data.map(entry => parseFloat(entry.weight)) : [];
  const visitDates = data ? data.map(entry => formatDate(entry.visitDate)) : [];
  const customLabels = weights.map((_, index) => `visit${index + 1}`);
  const tableData = visitDates.map((visitDate, index) => ({
    visit: visitDate,
    weight: `${parseFloat(weights[index]).toFixed(2)} kg`,
  }));

  const generateHTML = chartImageUri => {
    const selectedDatesHtml = selectedFromDate && selectedToDate ? `
    <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
      <div style="font-size: 16px; color: #333; text-align: center;">Selected Dates: ${formatDate(selectedFromDate)} - ${formatDate(selectedToDate)}</div>
    </div>
  ` : '';
  

    const chartHtml = `
      <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
      </div>
    `;

    const tableHtml = `
      <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
        <Text style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Weight Chart Per Child</Text>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Visit Date</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Weight</th>
          </tr>
          ${tableData
            .map(
              item => `
            <tr>
              <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.visit}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.weight}</td>
            </tr>
          `,
            )
            .join('')}
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
        .container {
          margin: 16px;
        }
        .profile {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 16px;
          padding: 16px;
        }
        .profile-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #555;
        }
        .info-text {
          font-size: 16px;
          margin-bottom: 8px;
          color: black;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }
        img {
          width: 100px;
          height: 100px;
        }
        .headingLine {
          font-size: 30;
          color: orange;
          margin-left: 20px;
          margin-top: 20px;
          padding-bottom: 3px;
        }
        .subheading {
          font-size: 18px;
          color: orange;
          margin-left: 20px;
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
          <div class="headingLine">Niramay Bharat</div>
          <div class="subheading">सर्वे पि सुखिनः सन्तु | सर्वे सन्तु निरामय: ||</div>
        </div>
      </div>
      <div class="container">
        <div class="profile">
          <div class="profile-title">Profile</div>
          <div class="info-text">Name: ${childsName}</div>
          <div class="info-text">Gender: ${gender}</div>
          <div class="info-text">Date of Birth: ${dob}</div>
        </div>
        ${selectedDatesHtml}
        ${chartHtml}
        ${tableHtml}
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};



  const captureChart = async () => {
    try {
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };
  const generatePDF = async () => {
    try {
      const chartImageUri = await captureChart();
  
      if (chartImageUri) {
        // Option 1: Use a function to generate a unique filename based on the current date and time
        const generateUniqueFilename = () => {
          const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
          return `${childsName}_WeightChart_${timestamp}.pdf`;
        };
  
        // Option 2: Increment the counter correctly using the setPdfCounter callback
        setPdfCounter((prevCounter) => prevCounter + 1);
        const options = {
          html: generateHTML(chartImageUri, selectedFromDate, selectedToDate),
          // Use either the function or counter approach for the filename
          // fileName: generateUniqueFilename(),
          fileName: `WeightChartPerChildReport_${pdfCounter}.pdf`,
          directory: `Documents/${childsName}`,
        };
  
        const pdf = await RNHTMLtoPDF.convert(options);
        const pdfPath = pdf.filePath;
  
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/${childsName}_WeightChart_${pdfCounter}.pdf`;
  
        const fileExists = await RNFS.exists(newPdfPath);
  
        if (fileExists) {
          setPdfCounter((prevCounter) => prevCounter + 1);
          const newPdfPathWithCounter = `${downloadsPath}/${childsName}_WeightChart_${pdfCounter}.pdf`;
          await RNFS.moveFile(pdfPath, newPdfPathWithCounter);
  
          Alert.alert(
            'PDF Downloaded',
            `The PDF has been downloaded with a new filename:${childsName}_WeightChart_${pdfCounter}.pdf`,
          );
        } else {
          await RNFS.moveFile(pdfPath, newPdfPath);
  
          Alert.alert(
            'PDF Downloaded',
            `The PDF has been downloaded in your downloads folder with filename:${childsName}_WeightChart_${pdfCounter}.pdf .`,
          );
        }
      } else {
        console.error('Chart capture failed.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const resetDateSelection = () => {
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setShowCalendar(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View>
            <View style={styles.childInfo}>
              <Text style={styles.chartTitle}>Profile</Text>
              <Text style={styles.infoText}>Name: {childsName}</Text>
              <Text style={styles.infoText}>Gender: {gender}</Text>
              <Text style={styles.infoText}>Date of Birth: {dob}</Text>
            </View>

            <Text style={{...styles.infoText, marginLeft: 15}}>
              Select Date Range (From-To)
            </Text>
            {showCalendar ? (
              <View style={styles.calendarContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.calendarScrollView}>
              <Calendar
                onDayPress={day => {
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
                  [selectedFromDate]: {
                    selected: true,
                    marked: true,
                    selectedColor: 'blue',
                  },
                  [selectedToDate]: {
                    selected: true,
                    marked: true,
                    selectedColor: 'blue',
                  },
                }}
                style={{
                  borderRadius: 50,
                  width: 350,
                  marginLeft: 5,
                  marginTop: 20,
                }}
              />
              </ScrollView>
              </View>
            ) : (
              <View style={styles.dateSelectionContainer}>
                <Text style={styles.dateSelectionText}>
                  {`Selected Dates: ${formatDate(selectedFromDate,
                  )} - ${formatDate(selectedToDate)}`}
                </Text>
                <TouchableOpacity onPress={resetDateSelection}>
                  <Text style={styles.resetDateSelectionText}>
                    Change Dates
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.chart}>
              <Text style={styles.chartTitle}>Weight Chart</Text>
              <ScrollView horizontal={true}>
                <ViewShot
                  ref={chartRef}
                  options={{format: 'png', quality: 0.8}}>
                  <VictoryChart
                    padding={{top: 20, bottom: 50, left: 70, right: 40}}
                    domainPadding={{x: 20}}
                    width={Math.max(weights.length * 80, 300)} // Minimum width for the chart
                    domain={{x: [0, weights.length + 1]}} // Add 1 for padding
                    scale={{x: 'band'}} // Use scaleBand for x-axis
                  >
                    <VictoryBar
                      data={weights.map((value, index) => ({
                        x: index + 1,
                        y: value,
                      }))}
                      style={{
                        data: {fill: '#3eb489'},
                        labels: {fontSize: 10}, // Set the desired font size for labels
                      }}
                      labels={({datum}) => `${datum.y} kg`}
                      barWidth={20}
                    />
                    <VictoryAxis
                      label="Visits"
                      style={{
                        axisLabel: {padding: 30},
                      }}
                      tickValues={Array.from(new Set(visitDates)).map(
                        date => visitDates.indexOf(date) + 1,
                      )}
                      tickFormat={value => `Visit${Math.floor(value)}`} // Use Math.floor to ensure whole numbers
                    />
                    <VictoryAxis
                      label="Weight (in kg)"
                      style={{
                        axisLabel: {padding: 40, y: -20},
                      }}
                      dependentAxis
                      domain={{
                        y: [Math.min(...weights) - 5, Math.max(...weights) + 5],
                      }}
                    />
                  </VictoryChart>
                </ViewShot>
              </ScrollView>
            </View>

            <View style={styles.table}>
              <Text style={styles.tableTitle}>Summary Table</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Visit Date</Text>
                  <Text style={styles.tableHeaderText}>Weight</Text>
                </View>
                {tableData.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{item.visit}</Text>
                    <Text style={styles.tableCell}>{item.weight}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={{
                ...styles.printButton,
                position: 'absolute',
                top: -10,
                right: -20,
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 90,
              }}
              onPress={generatePDF}>
              <Image
                source={require('../assets/printer1.png')}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 10,
                  backgroundColor: '#f4f4f4',
                  marginEnd: 40,
                  marginBottom: 40,
                }}
              />
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginTop: -40,
                  marginEnd: 45,
                }}>
                {' '}
                PDF
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
            <View style={styles.table}>
              <Text style={styles.tableTitle}>Summary Table</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Visit Date</Text>
                  <Text style={styles.tableHeaderText}>Weight</Text>
                </View>
                {tableData.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{item.visit}</Text>
                    <Text style={styles.tableCell}>{item.weight}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={{
                ...styles.printButton,
                position: 'absolute',
                top: -10,
                right: -20,
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 90,
              }}
              onPress={generatePDF}>
              <Image
                source={require('../assets/printer1.png')}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 10,
                  backgroundColor: '#f4f4f4',
                  marginEnd: 40,
                  marginBottom: 40,
                }}
              />
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginTop: -40,
                  marginEnd: 45,
                }}>
                {' '}
                PDF
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingVertical: 20,
  },
  chart: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  chartStyle: {
    marginVertical: 8,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    margin: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    color: '#555',
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  tableHeader: {
    backgroundColor: 'teal',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
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
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  childInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    margin: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  scrollView: {
    flex: 1,
    width: '100%',
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

export default WeightPerChild;