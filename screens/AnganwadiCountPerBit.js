import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, FlatList, Image, Alert } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ModalSelector from 'react-native-modal-selector';
import { Calendar } from 'react-native-calendars';

const CustomMenuButton = ({ toggleMenu }) => {
  const handleMenuToggle = () => {
    toggleMenu(); // Call the toggleMenu function received as a prop
  };

  return (
    <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
      <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
    </TouchableOpacity>

  );
};

const DateRangePicker = ({ onSelectDateRange }) => {
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateSelect = (date) => {
    const { startDate, endDate } = selectedDateRange;
    if (!startDate || (startDate && endDate)) {
      // Select the start date
      setSelectedDateRange({
        startDate: date.dateString,
        endDate: null,
      });
    } else {
      // Select the end date
      setSelectedDateRange({
        startDate,
        endDate: date.dateString,
      });

      // Notify the parent component about the selected date range
      onSelectDateRange({
        startDate,
        endDate: date.dateString,
      });
    }
  };

  const clearDateRange = () => {
    setSelectedDateRange({
      startDate: null,
      endDate: null,
    });
    onSelectDateRange({
      startDate: null,
      endDate: null,
    });
  };

  return (
    <View>
      <View style={styles.dateRangeContainer}>
        <Text style={styles.dateRangeText}>
          {selectedDateRange.startDate ? `From: ${selectedDateRange.startDate}` : 'Select start date'}
        </Text>
        <Text style={styles.dateRangeText}>
          {selectedDateRange.endDate ? `To: ${selectedDateRange.endDate}` : 'Select end date'}
        </Text>
      </View>
      <Calendar
        style={styles.calendarContainer}
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDateRange.startDate || '']: {
            selected: true,
            startingDay: true,
            color: '#007BFF',
            textColor: 'white',
          },
          [selectedDateRange.endDate || '']: {
            selected: true,
            endingDay: true,
            color: '#007BFF',
            textColor: 'white',
          },
        }}
      />
      {(selectedDateRange.startDate || selectedDateRange.endDate) && (
        <TouchableOpacity style={styles.changeDateButton} onPress={clearDateRange}>
          <Text style={styles.changeDateButtonText}>Change Date</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


const AnganwadiCountPerBit = ({ toggleMenu,route }) => {
  const [data, setData] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const navigation = useNavigation();
  const chartRef = useRef();
  const [pdfCounter, setPdfCounter] = useState(1);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomMenuButton toggleMenu={toggleMenu} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/anganwadi-count`, {
          params: { startDate: selectedDateRange.startDate, endDate: selectedDateRange.endDate },
        });

        setData(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDateRange]); // Remove selectedYear as a dependency


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/anganwadi-count`, {
          params: { startDate: selectedDateRange.startDate, endDate: selectedDateRange.endDate },
        });

        if (response.data.length === 0) {
          // Show an alert if no data is available
          Alert.alert(
            'No Data',
            'No data available for the selected date range.',
            [
              {
                text: 'OK',
                onPress: () => { },
              },
            ]
          );
        }

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDateRange]);

  const handleDateRangeSelect = ({ startDate, endDate }) => {
    setSelectedDateRange({ startDate, endDate });
  };
  useEffect(() => {
    const updateChart = async () => {
      const chartImageUri = await captureChart();
      // Update the chart with the new image URI or take any other necessary action
    };

    updateChart();
  }, [data, selectedYear, selectedDateRange]);

  const chartData = selectedYear
    ? data.map((item) => ({
      bit_name: item.bit_name,
      anganwadi_count: parseInt(item.anganwadi_count),
    }))
    : data.reduce((result, item) => {
      const existingItem = result.find((x) => x.bit_name === item.bit_name);
      if (existingItem) {
        existingItem.anganwadi_count += parseInt(item.anganwadi_count);
      } else {
        result.push({
          bit_name: item.bit_name,
          anganwadi_count: parseInt(item.anganwadi_count),
        });
      }
      return result;
    }, []);

  const summaryTableData = chartData.reduce((result, item) => {
    const existingItemIndex = result.findIndex((x) => x.bit_name === item.bit_name);
    if (existingItemIndex !== -1) {
      // If the item already exists in the summary table data, update its count
      result[existingItemIndex].anganwadi_count += item.anganwadi_count;
    } else {
      // Otherwise, add a new item to the summary table data
      result.push({ bit_name: item.bit_name, anganwadi_count: item.anganwadi_count });
    }
    return result;
  }, []);



  const xAxisTickValues = chartData.map((item, index) => ({ x: index + 1, label: item.bit_name }));

  const generateHTML = (chartImageUri) => {
    let selectedDateRangeText = '';
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      selectedDateRangeText = `
            <div style="font-size: 16px; margin-bottom: 10px; color: #333; text-align: center;">
              <span style="font-weight: bold;">Date Range:</span> 
              <span style="color: #007BFF;">${selectedDateRange.startDate}</span> 
              <span style="font-weight: bold;">-</span> 
              <span style="color: #007BFF;">${selectedDateRange.endDate}</span>
            </div>
          `;
    }

    const chartHtml = `
          <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
            <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
          </div>
        `;

    const tableHtml = `
          <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
            <div style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Summary Table</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Bit Name</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Count</th>
              </tr>
              ${summaryTableData.map((item) => `
                <tr>
                  <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.anganwadi_count}</td>
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
                .selectedDate {
                  color: #007BFF;
                  font-weight: bold;
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
              <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #333; text-align: center;">Anganwadi Count Per Bit</div>
              ${selectedDateRangeText}
              ${chartHtml}
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
        // Increment the PDF counter
        setPdfCounter((prevCounter) => prevCounter + 1);

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

        const options = {
          html: generateHTML(chartImageUri),
          fileName: `AnganwadiCountPerBitReport_${pdfCounter}`, // Use the counter in the filename
          directory: 'Documents/ConsolidatedReports',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        const pdfPath = pdf.filePath;

        // Move the generated PDF to the Downloads directory
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/AnganwadiCountPerBitReport${pdfCounter}.pdf`;

        await RNFS.moveFile(pdfPath, newPdfPath);

        // Display an alert dialog after the PDF is generated
        Alert.alert(
          'PDF Generated!',
          `PDF has been generated successfully.\nFile Path: ${newPdfPath}`,
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


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Anganwadi Count Per Bit</Text>
      <DateRangePicker onSelectDateRange={handleDateRangeSelect} />


      <ScrollView horizontal={true}>
        <View style={styles.chartContainer} collapsable={false}>
          <ViewShot
            ref={chartRef}
            options={{ format: 'png', quality: 0.8 }}
          >
            <VictoryChart
              padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
              height={450}
              width={Math.max(300, data.length * 100)} // Ensure a minimum width
            >
              <VictoryAxis
                label="Bit Name"
                tickValues={xAxisTickValues.map((tick) => tick.x)}
                tickLabelComponent={<VictoryLabel angle={0} />} // Rotate labels horizontally
                style={{
                  axisLabel: { padding: 30 },
                }}
                tickFormat={(tick, index) => xAxisTickValues[index]?.label || ''}
              />

              <VictoryAxis
                dependentAxis
                label="Count of Anganwadi"
                style={{
                  axisLabel: { padding: 30 },
                }}
              />
              <VictoryBar
                data={chartData}
                x="bit_name"
                y="anganwadi_count"
                style={{ data: { fill: 'rgba(180, 80, 130, 1)' } }}
                barWidth={20}
                alignment="start"
                labels={({ datum }) => datum.anganwadi_count}
                labelComponent={<VictoryLabel dx={10} dy={0} />}
              />
            </VictoryChart>

          </ViewShot>
        </View>
      </ScrollView>
      <Text style={styles.summaryTableTitle}>Summary Table</Text>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Bit Name vs Count of Anganwadi</Text>
        <FlatList
          data={chartData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.bitName}>{item.bit_name}</Text>
              <Text style={styles.anganwadi_count}>{item.anganwadi_count}</Text>
            </View>
          )}
        />
      </View>
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
}; const styles = StyleSheet.create({
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
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    elevation: 4,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  changeDateButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    margin: 15,
  },
  changeDateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    alignContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    margin: 16,
    padding: 16,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  anganwadi_count: {
    fontSize: 16,
    color: '#333',
  },
  calendarContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    margin: 10,
  },
  summaryTableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
});

export default AnganwadiCountPerBit;