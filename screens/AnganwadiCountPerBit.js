import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, FlatList ,Image,Alert} from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './config';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ModalSelector from 'react-native-modal-selector';
const CustomMenuButton = ({toggleMenu}) => {
    const handleMenuToggle = () => {
      toggleMenu(); // Call the toggleMenu function received as a prop
    };
  
    return (
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
        <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
      </TouchableOpacity>
      
    );
  };

  const YearDropdown = ({ selectedYear, onYearChange, uniqueYears }) => {
    const dropdownData = (uniqueYears || []).map((year) => ({ key: year !== null ? year.toString() : '', label: year !== null ? year.toString() : '' }));
  
    return (
      <View style={styles.dropdownContainer}>
        <ModalSelector
          data={dropdownData}
          initValue={selectedYear ? selectedYear.toString() : 'Select Year'}
          onChange={(option) => onYearChange(option.label)}
          style={styles.modalSelectorContainer}
          selectTextStyle={styles.modalSelectorText}
          optionTextStyle={styles.modalSelectorText}
        />
      </View>
    );
  };
  
  const AnganwadiCountPerBit = ({ toggleMenu }) => {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [uniqueYears, setUniqueYears] = useState([]);
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
            params: { year: selectedYear },
          });
    
          setData(response.data);
    
          // Extract unique years from the dataset
          const years = [...new Set(response.data.map((item) => item.extracted_year))];
          //setUniqueYears(years);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [selectedYear]);
    useEffect(() => {
      const fetchUniqueYears = async () => {
        try {
          const response = await axios.get(`${API_URL}/availableYears`);
          setUniqueYears(response.data);
          console.log('hello',response.data)
        } catch (error) {
          console.error('Error fetching unique years:', error);
        }
      };
  
      fetchUniqueYears();
    }, []);
  
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
  
    const xAxisTickValues = selectedYear
      ? data.map((item, index) => ({ x: index + 1, label: item.bit_name }))
      : chartData.map((item, index) => ({ x: index + 1, label: item.bit_name }));

      const generateHTML = (chartImageUri, selectedYear) => {
        const chartHtml = `
          <div style="margin: 16px; background-color: white; border-radius: 10px; elevation: 4; padding: 16px;">
            <img src="${chartImageUri}" alt="Chart" style="width: 100%; height: 400px; object-fit: contain;"/>
          </div>
        `;
      
        const tableHtml = `
          <div style="background-color: #fff; border-radius: 15px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3); elevation: 8; margin: 16px;">
            <h2 style="font-size: 20px; font-weight: bold; margin: 16px; color: #333; text-align: center;">Anganwadi Count Per Bit</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Bit Name</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc; font-weight: bold;">Count</th>
              </tr>
              ${chartData.map((item) => `
                <tr>
                  <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">${item.bit_name}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">${item.anganwadi_count}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
      
        const yearHtml = selectedYear ? `<div style="text-align: center; margin-top: 10px; font-size: 16px; color: #333;">Year: ${selectedYear}</div>` : '';
      
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
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #333; text-align: center;">Anganwadi Count Per Bit</h2>
              ${yearHtml}
              ${chartHtml}
              <h2 style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #333; text-align: center;">Summary Table</h2>
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
          html: generateHTML(chartImageUri, selectedYear),
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
          `PDF has been generated successfully in downloads folder with filename: AnganwadiCountPerBitReport${pdfCounter}`,
          [
            {
              text: 'OK',
              onPress: () => {},
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
  
        <Text style={styles.label}>Select Year:</Text>
        <YearDropdown
          selectedYear={selectedYear}
          onYearChange={(year) => setSelectedYear(year)}
          uniqueYears={uniqueYears}
        />
        <ScrollView horizontal={true}>
          <View style={styles.chartContainer} collapsable={false}>
            <ViewShot
              ref={chartRef}
              options={{ format: 'png', quality: 0.8 }}
            >
              <VictoryChart
                domainPadding={{ x: 5 }}
                padding={{ left: 50, right: 50, top: 20, bottom: 50 }}
                height={450}
                width={data.length * 100}
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
          <Text style={styles.tableTitle}>Bit Name vs Count of Children</Text>
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
  anganwadi_count: {
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
    width:250,
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
    marginLeft:20,
    color: 'black',
  },
});

export default AnganwadiCountPerBit;