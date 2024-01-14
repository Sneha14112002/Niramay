import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import {
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryAxis,
  VictoryLegend,
  VictoryLabel,
} from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ModalDropdown from 'react-native-modal-dropdown';
import { API_URL } from './config';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import ModalSelector from 'react-native-modal-selector';
const GradeTransition = () => {
  const [data, setData] = useState([]);
  const [distinctYears, setDistinctYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const chartContainerRef = useRef();

  useEffect(() => {
    fetchData();
    fetchDistinctYears();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getTransitionCount`, {
        params: { year: selectedYear },
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDistinctYears = async () => {
    try {
      const response = await axios.get(`${API_URL}/getDistinctYears`);
      setDistinctYears(response.data);
    } catch (error) {
      console.error('Error fetching distinct years:', error);
    }
  };

  const onYearChange = (index, value) => {
    setSelectedYear(value);
    // Fetch data again when the year changes
    fetchData();
  };

  // Log the data to check if it's available
  console.log('Data:', data);

  // Check if data is empty or undefined before rendering
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  const chartData = data.map((item) => ({
    bit_name: item.bit_name,
    mam_to_normal_count: item.mam_to_normal_count,
    sam_to_normal_count: item.sam_to_normal_count,
  }));

  const captureChart = async () => {
    try {
      if (chartContainerRef.current) {
        const uri = await captureRef(chartContainerRef, {
          format: 'png',
          quality: 0.8,
        });
        return uri;
      } else {
        console.error('Chart container ref is not available for capture');
        return null;
      }
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };


  const generatePDFHtml = (chartImageUri) => {

    const chartImageHtml = chartImageUri ? `<img src="${chartImageUri}" style="width:100%;height: 300px; object-fit: contain;" />` : '';

    const tableHtml = `
    
      <div>
        <h2 style="text-align: center;">Transition Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: teal; color: white; text-align: center;">
            <th style="padding: 10px;">Name</th>
            <th style="padding: 10px;">MAM to Normal</th>
            <th style="padding: 10px;">SAM to Normal</th>
          </tr>
          ${data
        .map(
          (item) => `
                <tr style="text-align: center;">
                  <td style="padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ccc;">${item.mam_to_normal_count}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ccc;">${item.sam_to_normal_count}</td>
                </tr>
              `
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
         

          <div class="chart">
            <div class="chart-title">BMI Chart</div>
            ${chartImageHtml}
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
      const htmlContent = generatePDFHtml(chartImageUri);

      if (chartImageUri) {
        const options = {
          html: htmlContent,
          fileName: 'GradeTransitionReport',
          directory: 'Documents/ConsolidatedReports',
        };
        const pdf = await RNHTMLtoPDF.convert(options);
        const pdfPath = pdf.filePath;
  
        // Move the generated PDF to the Downloads directory
        const downloadsPath = RNFS.DownloadDirectoryPath;
        const newPdfPath = `${downloadsPath}/GradeTransitionReport.pdf`;
  
        await RNFS.moveFile(pdfPath, newPdfPath);
  
        // Display an alert dialog after the PDF is generated
        Alert.alert(
          'PDF Generated!',
          `PDF has been downloaded in Downloads Folder`,
          [
            // {
            //   text: 'Click here to open the PDF',
            //   onPress: () => {
            //     // Open the generated PDF when the button in the alert dialog is pressed
            //     Linking.openURL(`file://${newPdfPath}`);
            //   },
            // },
            {
              text: 'OK',
              onPress: () => {
                // Do something when the OK button is pressed
                // This can be left empty if you don't need any action
              },
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Grade Transitions</Text>
        <Text style={styles.label}>Select Year:</Text>
        
        {/* Dropdown for selecting year */}
        <ModalSelector
          data={['All Years', ...distinctYears.map((year) => ({ key: year.toString(), label: year.toString() }))]}
          initValue={selectedYear || 'All Years'}
          onChange={(option) => onYearChange(option.key, option.label)}
          style={styles.yearDropdown} // Apply styles for ModalSelector container
          selectTextStyle={styles.dropdownText} // Apply styles for selected text
          optionContainerStyle={styles.optionContainer} // Apply styles for option container
          optionTextStyle={styles.optionText} // Apply styles for option text
        />

        {/* Container for the Bar Chart */}
        <ScrollView horizontal={true}>
          <View style={styles.chartContainer} ref={chartContainerRef}>
            {/* Stacked Bar Chart using Victory */}
            <VictoryChart
              domainPadding={{ x: 20 }}
              width={data.length * 80} // Adjust the width as needed
              padding={{ bottom: 90, left: 80, top: 30, right: 20 }} // Increase this value
            >
              {/* Add Y-axis */}
              <VictoryAxis
                dependentAxis
                tickCount={5} // Adjust the tick count as needed
                label="No. of Transitions" // Add Y-axis label here
                style={{
                  axisLabel: { padding: 40 }, // Adjust padding as needed
                }}
              />

              <VictoryStack colorScale={['#9dd9f3', '#0f4c75']}>
                <VictoryBar data={chartData} x="bit_name" y="mam_to_normal_count" />
                <VictoryBar data={chartData} x="bit_name" y="sam_to_normal_count" />
              </VictoryStack>

              <VictoryAxis
                tickValues={chartData.map((item) => item.bit_name)}
                style={{
                  tickLabels: { angle: -45, textAnchor: 'end' },
                }}
              />

              <VictoryLabel
                text="Bit Name"
                textAnchor="middle"
                verticalAnchor="start"
                x={data.length * 40}
                y={285}
              />
              {/* No need to add Y-axis label again here */}
              <VictoryLegend
                x={10}
                y={1}
                centerTitle
                orientation="horizontal"
                gutter={20}
                rowGutter={10}
                style={{ title: { fontSize: 20 } }}
                data={[
                  { name: 'MAM to Normal', symbol: { fill: '#9dd9f3' } },
                  { name: 'SAM to Normal', symbol: { fill: '#0f4c75' } },
                ]}
              />
            </VictoryChart>
          </View>
        </ScrollView>
        {/* Table */}
        <ScrollView horizontal={true}>
          <View style={styles.table}>
            <Text style={styles.tableTitle}>Transition Summary</Text>
            <ScrollView horizontal={true}>
              <Table style={styles.tableContainer}>
                <Row
                  data={['Name', 'MAM to Normal', 'SAM to Normal']} // Updated labels
                  style={styles.tableHeader}
                  textStyle={styles.tableHeaderText}
                />
                {data.map((item) => (
                  <Row
                    key={item.bit_name}
                    data={[item.bit_name, item.mam_to_normal_count, item.sam_to_normal_count]}
                    style={styles.tableRow}
                    textStyle={styles.tableCell}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        {/* Button to generate PDF */}
        <TouchableOpacity
          style={{
            ...styles.printButton,
            position: 'absolute',
            top: 10,
            right: -20,
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
              marginEnd: 40,
              marginBottom: 40
            }}
          />
          <Text style={{ color: 'black', fontSize: 14, marginTop: -40, marginEnd: 45 }}> PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: 100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: 350,
  },
  tableHeader: {
    backgroundColor: 'teal',
    justifyContent: 'space-evenly',
    paddingVertical: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  pdfButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
  },
  yearDropdown: {
    height: 60, // Change the height as needed
    width: '90%', // Change the width as needed
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    color: 'black',
  },
  
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  optionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:20,
    color: 'black',
  },
});

export default GradeTransition;