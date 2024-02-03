import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryLegend,
  VictoryArea,
} from 'victory-native';
import {API_URL} from './config';
import {useNavigation} from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import RNFS from 'react-native-fs';
const GrowthChartPerChild = ({route, toggleMenu}) => {
  const {anganwadiNo, childsName, gender, dob} = route.params;
  const navigation = useNavigation();

  // State variables to store data
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [pdfCounter, setPdfCounter] = useState(1); 
  const chartRef = useRef();
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

  const showFlashMessage = message => {
    Alert.alert('Flash Message', message);
  };

  // Extract weight data and visit dates from formData
  const {data} = formData || {};
  const weights = data ? data.map(entry => parseFloat(entry.weight)) : [];
  const heights = data ? data.map(entry => parseFloat(entry.height)) : [];
  const haemoglobin = data
    ? data.map(entry => parseFloat(entry.haemoglobin))
    : [];
  const visitDates = data ? data.map(entry => formatDate(entry.visitDate)) : [];

  // Create an array of custom labels for the graph ("visit1," "visit2," etc.)
  const customLabels = heights.map((_, index) => `visit${index + 1}`);
  const filledHaemoglobin = haemoglobin.map((value, index) => {
    if (
      isNaN(value) ||
      value === null ||
      value === '' ||
      value === 0 ||
      value === '0.0'
    ) {
      // If the value is NaN or null or empty string or 0 or "0.0",
      // replace it with the first non-zero value in the data or previous numeric value
      let firstNonZeroValue = null;

      for (let i = index - 1; i >= 0; i--) {
        if (
          !isNaN(haemoglobin[i]) &&
          haemoglobin[i] !== null &&
          haemoglobin[i] !== '' &&
          haemoglobin[i] !== '0.0'
        ) {
          firstNonZeroValue = haemoglobin[i];
          break;
        }
      }

      return firstNonZeroValue || 0;
    }
    return value;
  });

  console.log(filledHaemoglobin);

  // Create table data with visit dates
  const tableData = visitDates.map((visitDate, index) => ({
    visit: visitDate,
    height: `${parseFloat(heights[index]).toFixed(2)} cm`,
    weight: `${parseFloat(weights[index]).toFixed(2)} kg`,
    haemoglobin: `${parseFloat(filledHaemoglobin[index]).toFixed(2)} g/dL`,
  }));

  // Normalize the height, weight, and haemoglobin data
  const normalize = data => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue;

    return data.map(value => (value - minValue) / range);
  };

  // Normalize the height, weight, and haemoglobin datasets
  const normalizedHeights = normalize(heights);
  const normalizedWeights = normalize(weights);
  const normalizedHaemoglobin = normalize(filledHaemoglobin);

  const captureChart = async () => {
    try {
      return await chartRef.current.capture();
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const generateHTML = chartImageUri => {
    const chartHtml = `
      <div class="chart">
        <div class="chart-title">Growth Chart</div>
        <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 300px; object-fit: contain;"/>
      </div>
    `;
    const childInfoHtml = `
      <div class="child-info">
        <div class="info-text">Name: ${childsName}</div>
        <div class="info-text">Gender: ${gender}</div>
        <div class="info-text">Date of Birth: ${dob}</div>
      </div>
    `;

    const tableRows = tableData.map(
      (item, index) => `
        <tr>
          <td style="padding: 8px; text-align: center;">${item.visit}</td>
          <td style="padding: 8px; text-align: center;">${item.height}</td>
          <td style="padding: 8px; text-align: center;">${item.weight}</td>
          <td style="padding: 8px; text-align: center;">${item.haemoglobin}</td>
        </tr>
      `,
    );

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: center; background-color: teal; color: white;">Visit Date</th>
            <th style="padding: 8px; text-align: center; background-color: teal; color: white;">Height</th>
            <th style="padding: 8px; text-align: center; background-color: teal; color: white;">Weight</th>
            <th style="padding: 8px; text-align: center; background-color: teal; color: white;">Haemoglobin</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join('')}
        </tbody>
      </table>
    `;

    const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
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
          .chart {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 16px;
            padding: 16px;
          }
          .chart-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #555;
          }
          .table {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 16px;
            padding: 16px;
          }
          .table-title {
            font-size: 18px;
            font-weight: bold;
            margin: 16px;
            color: #555;
          }
          .table-container {
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            elevation: 8;
          }
          .table-header {
            background-color: teal;
            padding: 8px;
            justify-content: space-evenly;
          }
          .table-header-text {
            font-size: 16px;
            color: white;
            font-weight: bold;
            text-align: center;
          }
          .table-row {
            flex-direction: row;
            align-items: center;
            padding-vertical: 8px;
            border-bottom-width: 1px;
            border-bottom-color: #ccc;
          }
          .table-cell {
            flex: 1;
            padding: 8px;
            text-align: center;
          }
          .table-cell-text {
            font-size: 14px;
            color: #333;
            text-align: center;
          }
          img {
            width:100px; 
            height:100px;
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

          <div class="chart">
            <div class="chart-title">BMI Chart</div>
            ${chartHtml}
          </div>

          ${tableHtml}

        </div>
      </body>
    </html>
  `;

    return htmlContent;
  };
  const generatePDF = async () => {
    try {
      const chartImageUri = await captureChart();
  
      if (chartImageUri) {
        // Option 1: Use a function to generate a unique filename based on the current date and time
        const generateUniqueFilename = () => {
          const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
          return `${childsName}_GrowthChart_${timestamp}.pdf`;
        };
  
        // Option 2: Increment the counter correctly using the setPdfCounter callback
        setPdfCounter((prevCounter) => prevCounter + 1);
        const options = {
          html: generateHTML(chartImageUri, selectedFromDate, selectedToDate),
          // Use either the function or counter approach for the filename
          // fileName: generateUniqueFilename(),
          fileName: `GrowthChartPerChildReport_${pdfCounter}.pdf`,
          directory: `Documents/${childsName}`,
        };
  
        const pdf = await RNHTMLtoPDF.convert(options);
        const pdfPath = pdf.filePath;
  
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/${childsName}_GrowthChart_${pdfCounter}.pdf`;
  
        const fileExists = await RNFS.exists(newPdfPath);
  
        if (fileExists) {
          setPdfCounter((prevCounter) => prevCounter + 1);
          const newPdfPathWithCounter = `${downloadsPath}/${childsName}_GrowthChart_${pdfCounter}.pdf`;
          await RNFS.moveFile(pdfPath, newPdfPathWithCounter);
  
          Alert.alert(
            'PDF Downloaded',
            `The PDF has been downloaded with a new filename:${childsName}_GrowthChart_${pdfCounter}.pdf`,
          );
        } else {
          await RNFS.moveFile(pdfPath, newPdfPath);
  
          Alert.alert(
            'PDF Downloaded',
            `The PDF has been downloaded in your downloads folder with filename:${childsName}_GrowthChart_${pdfCounter}.pdf`,
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
            ) : (
              <View style={styles.dateSelectionContainer}>
                <Text style={styles.dateSelectionText}>
                  {`Selected Dates: ${formatDate(
                    selectedFromDate,
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
              <Text style={styles.chartTitle}>Growth Chart</Text>
              <ScrollView horizontal={true}>
                <ViewShot
                  ref={chartRef}
                  options={{format: 'png', quality: 0.8}}>
                  <VictoryChart
                    padding={{top: 20, bottom: 50, left: 70, right: 40}}
                    domainPadding={{x: 20}}
                    scale={{x: 'band'}}
                    domain={{x: [0, 1]}} // Set the domain for the x-axis
                  >
                    <VictoryLegend
                      x={80}
                      y={0}
                      orientation="horizontal"
                      gutter={10}
                      data={[
                        {
                          name: 'Haemoglobin ',
                          symbol: {fill: 'rgba(237, 102, 99, 0.7)'},
                        },
                        {
                          name: 'Height ',
                          symbol: {fill: 'rgba(255, 163, 114, 0.7)'},
                        },
                        {
                          name: 'Weight ',
                          symbol: {fill: 'rgba(67, 101, 139, 0.7)'},
                        },
                      ]}
                    />
                    <VictoryAxis
                      label="Visits"
                      style={{
                        axisLabel: {padding: 30},
                      }}
                      tickValues={[0]} // Always include 0 as a tick value
                      tickFormat={value => 'Visit1'} // Use a fixed label for a single visit
                    />
                    <VictoryAxis
                      label="Data"
                      style={{
                        axisLabel: {padding: 35, y: -20},
                      }}
                      dependentAxis
                    />
                    <VictoryArea
                      data={normalizedHaemoglobin.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{data: {fill: 'rgba(237, 102, 99, 0.15)'}}}
                    />
                    <VictoryArea
                      data={normalizedHeights.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{data: {fill: 'rgba(255, 163, 114, 0.15)'}}}
                    />
                    <VictoryArea
                      data={normalizedWeights.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{data: {fill: 'rgba(67, 101, 139, 0.15)'}}}
                    />
                    <VictoryLine
                      data={normalizedHaemoglobin.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{
                        data: {
                          stroke: 'rgba(237, 102, 99, 0.7)',
                          strokeWidth: 2,
                        },
                      }}
                    />
                    <VictoryLine
                      data={normalizedHeights.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{
                        data: {
                          stroke: 'rgba(255, 163, 114, 0.7)',
                          strokeWidth: 2,
                        },
                      }}
                    />
                    <VictoryLine
                      data={normalizedWeights.map((value, index) => ({
                        x: index,
                        y: value,
                      }))}
                      style={{
                        data: {
                          stroke: 'rgba(67, 101, 139, 0.7)',
                          strokeWidth: 2,
                        },
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
                  <Text style={styles.tableHeaderText}>Height</Text>
                  <Text style={styles.tableHeaderText}>Weight</Text>
                  <Text style={styles.tableHeaderText}>Haemoglobin</Text>
                </View>
                {tableData.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{item.visit}</Text>
                    <Text style={styles.tableCell}>{item.height}</Text>
                    <Text style={styles.tableCell}>{item.weight}</Text>
                    <Text style={styles.tableCell}>{item.haemoglobin}</Text>
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
  pdfButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
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
    borderWidth: 1, // Add a border to the table
    borderColor: '#ccc', // Border color
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    color: '#555',
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
    borderBottomWidth: 1, // Add a border to the bottom of the header
    borderBottomColor: '#ccc', // Border color
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
});

export default GrowthChartPerChild;