import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity, // Add this import
  Image, // Add this import
  Alert
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import { API_URL } from './config';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Modal, TouchableHighlight } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import Calendar component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  dropdownContainer: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    width: 300,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: 'black',
  },
  chartSection: {
    alignItems: 'center',
    padding: 20,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  tableContainer: {
    borderRadius: 8,
    paddingBottom: 20,
    marginTop: 20,
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
    paddingVertical: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    color: 'black',
  },
  printButton: {
    position: 'absolute',
    top: 10,
    right: -5,
    borderRadius: 25,
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  printButtonText: {
    color: 'black',
    fontSize: 16,
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
  noChildListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    // Add new style properties for the rectangular shape
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
    // fontWeight: 'bold',
  },

});



const colors = {
  NORMAL: '#33FF57',
  MAM: '#FFC300',
  SAM: '#FF5733',
};

const GradeDistribution = () => {
  const [bitName, setBitName] = useState([]);
  const [selectedBitName, setSelectedBitName] = useState('');
  const [visitDate, setVisitDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gradeDetails, setGradeDetails] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModalGrade, setSelectedModalGrade] = useState(null);
  const [modalGradeDetails, setModalGradeDetails] = useState([]);
  const [noDataAlert, setNoDataAlert] = useState(false); // State for no data alert

  const resetVisitDate = () => {
    setVisitDate([]);
  };

  const chartRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/bit_name`)
      .then((response) => {
        setBitName(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedBitName) {
      axios
        .get(`${API_URL}/visitDate/${selectedBitName}`)
        .then((response) => {
          const formattedVisitDates = response.data.map((dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = `0${date.getMonth() + 1}`.slice(-2);
            const day = `0${date.getDate()}`.slice(-2);
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
          });
          setVisitDate(formattedVisitDates);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedBitName]);


  useEffect(() => {
    if (selectedDate) {
      axios
        .get(`${API_URL}/child_distribution/${selectedBitName}/${selectedDate}`)
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            grade: item.grade,
            count: item.count,
          }));
          setData(formattedData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedDate, selectedBitName]);


  useEffect(() => {
    if (selectedFromDate && selectedToDate && selectedModalGrade && selectedBitName) {
      axios
        .get(`${API_URL}/grade_details_range/${selectedBitName}/${selectedFromDate}/${selectedToDate}/${selectedModalGrade}`)
        .then((response) => {
          setModalGradeDetails(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (selectedModalGrade && selectedBitName && selectedDate) {
      axios
        .get(`${API_URL}/grade_details/${selectedBitName}/${selectedDate}/${selectedModalGrade}`)
        .then((response) => {
          setModalGradeDetails(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedFromDate, selectedToDate, selectedBitName, selectedModalGrade, selectedDate]);



  const pieChartData = data.map((item, index) => ({
    name: item.grade,
    count: item.count,
    color: colors[item.grade],
  }));


  const captureChartImage = async () => {
    try {
      const image = await captureRef(chartRef, { format: 'png', quality: 1 });
      return image;
    } catch (error) {
      console.error('Error capturing chart image:', error);
      return null;
    }
  };


  const generatePDF = async () => {
    try {
      // if (!selectedBitName || !selectedDate) {
      //   Alert.alert(
      //     'Error',
      //     'Please select an Anganwadi Name and Visit Date before generating PDF.'
      //   );
      //   return;
      // }

      const chartImage = await captureChartImage();

      const options = {
        html: generateHTMLContent(chartImage),
        fileName: `${selectedBitName}_${selectedDate}.pdf`,
        directory: RNFS.DownloadDirectoryPath,
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      const downloadsPath = RNFS.DownloadDirectoryPath;
      const newPdfPath = `${downloadsPath}/GradeDistribution_${selectedBitName}_${selectedDate}.pdf`;

      await RNFS.moveFile(pdf.filePath, newPdfPath);

      Alert.alert('PDF Downloaded', `The PDF has been downloaded in your downloads folder with name GradeDistribution_${selectedBitName}_${selectedDate}.pdf.`);

      console.log('PDF generated:', pdf.filePath);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDayPress = async (day) => {
    try {
      if (!selectedFromDate) {
        setSelectedFromDate(day.dateString);
      } else if (!selectedToDate) {
        if (day.dateString < selectedFromDate) {
          Alert.alert('Invalid Date', 'End date must be after the start date');
          return;
        }
        setSelectedToDate(day.dateString);
        setLoading(true);
        const response = await axios.get(`${API_URL}/child_distribution_range/${selectedBitName}/${selectedFromDate}/${day.dateString}`);
        const formattedData1 = response.data.map((item) => ({
          grade: item.grade,
          count: item.count,
        }));
        setData(formattedData1);
        setLoading(false);
        // Check if data is empty
        if (formattedData1.length === 0) {
          Alert.alert('No Data', 'No data available for the selected date range');
          clearDateSelection(); // Clear selected dates
        }
      } else {
        setSelectedFromDate(day.dateString);
        setSelectedToDate('');
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    setSelectedBitName(selectedBitName);
  };


  const changeDateSelection = () => {
    setSelectedFromDate('');
    setSelectedToDate('');
    setData([]);
  };

  const clearDateSelection = () => {
    setSelectedFromDate('');
    setSelectedToDate('');
    setData([]);
  };


  const generateHTMLContent = (chartImage) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial, sans-serif';
          padding: 20px;
        }
        .headerContainer {
          display: flex;
          align-items: left;
          border-bottom: 1px solid orange; /* Thin line below the heading */
          padding-bottom: 15px; /* Adjust as needed */
        }
        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          color: black;
        }
        p {
          font-size: 16px;
          margin-bottom: 20px;
          color: black;
        }
        img {
          width: 100%;
          max-width: 500px; /* Adjust as needed */
          height: auto;
          margin-bottom: 20px;
        }
        .chart-section {
          align-items: center;
          padding: 20px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          margin-top: 20px;
        }
        .chart-image {
          width: 100%; 
          max-width: 100%; 
          height: auto;
          margin-bottom: 20px;
        }
        .label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: black;
        }
        .table-container {
          border-radius: 8px;
          padding-bottom: 20px;
          margin-top: 20px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          overflow-x: auto; /* Enable horizontal scroll for the table */
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .table-header {
          background-color: teal;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        .table-row {
          border-bottom: 1px solid #ccc;
        }
        .table-cell {
          padding: 8px;
          text-align: center;
          color: black;
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
      <h1>Grade Distribution</h1>
      <p>Anganwadi Name: ${selectedBitName}</p>
      <body>
    <!-- header and other content omitted for brevity -->
    ${
    // Conditionally render selected date or date range
    selectedDate
      ? `<p>Visit Date: ${selectedDate}</p>`
      : selectedFromDate && selectedToDate
        ? `<div class="dateRange">
             <p>Selected Date Range:</p>
             <p>From: ${selectedFromDate}</p>
             <p>To: ${selectedToDate}</p>
           </div>`
        : ''
    }
  </body>
      ${chartImage ? `<div class="chart-section"><img class="chart-image" src="${chartImage}" alt="Grade Distribution Chart" /></div>` : ''}
      <div class="table-container">
        <table class="table">
          <thead>
            <tr class="table-header">
              <th class="table-cell">Grade</th>
              <th class="table-cell">Count</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item) => `
              <tr class="table-row">
                <td class="table-cell">${item.grade}</td>
                <td class="table-cell">${item.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
  </html>
  `;

  const renderChildList = () => {
    if (!modalGradeDetails.length) {
      return <Text style={styles.noChildListText}>No children in this Bit Name</Text>;
    }

    return (
      <FlatList
        data={modalGradeDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.modalItem}>
            <Text style={styles.modalItemText}>{item.childName}</Text>
            <Text style={styles.modalItemText}>{item.anganwadiNo}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Grade Distribution</Text>
        <TouchableOpacity
          style={styles.printButton}
          onPress={() => generatePDF()}
          activeOpacity={0.2}
        >
          <Image
            source={require('../assets/printer1.png')}
            style={{ width: 35, height: 35, borderRadius: 10, backgroundColor: '#f4f4f4' }}
          />
          <Text style={styles.printButtonText}> PDF</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>Select Anganwadi Name:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0072ff" />
          ) : (
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={bitName}
                defaultValue="Select an Anganwadi Name"
                onSelect={(index, value) => {
                  setSelectedBitName(value);
                  resetVisitDate();
                  setSelectedGrade(''); // Reset selected grade when Anganwadi Name changes
                  setGradeDetails([]); // Reset grade details when Anganwadi Name changes
                }}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownOptions}
                dropdownTextStyle={styles.dropdownOptionText}
              />
            </View>
          )}
        </View>

        {visitDate.length > 0 && (
          <View>
            <Text style={styles.label}>Select Visit Date:</Text>
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={visitDate}
                defaultValue="Select the Visit Date"
                onSelect={(index, value) => {
                  setSelectedDate(value);
                  setSelectedGrade(''); // Reset selected grade when Visit Date changes
                  setGradeDetails([]); // Reset grade details when Visit Date changes
                }}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdownOptions}
                dropdownTextStyle={styles.dropdownOptionText}
              />
            </View>
          </View>
        )}

        <View style={styles.calendarContainer}>
          <Calendar
            markingType={'period'}
            markedDates={{
              [selectedFromDate]: { startingDay: true, color: '#00B0FF' },
              [selectedToDate]: { endingDay: true, color: '#00B0FF' },
            }}
            onDayPress={handleDayPress}
            style={styles.calendarContainer} // Apply the styles here
          />
        </View>


        <View style={styles.selectedDateContainer}>
          {(selectedFromDate || selectedToDate) && (
            <>
              {selectedFromDate && (
                <View>
                  <Text style={styles.selectedDateText}>From:</Text>
                  <Text style={styles.selectedDateText}>{selectedFromDate}</Text>
                </View>
              )}
              {selectedToDate && (
                <View>
                  <Text style={styles.selectedDateText}>To:</Text>
                  <Text style={styles.selectedDateText}>{selectedToDate}</Text>
                </View>
              )}
            </>
          )}
        </View>



        {data.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.label}>Grade Distribution Chart</Text>
            <View ref={chartRef} collapsable={false}>
              <PieChart
                data={pieChartData}
                width={300}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: '#1E2923',
                  backgroundGradientTo: '#08130D',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="5"
                absolute
              />
            </View>
          </View>
        )}

        {data.length > 0 && (
          <View>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Grade Summary</Text>
              </View>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedModalGrade(item.grade);
                      setModalVisible(true);
                    }}
                    style={styles.tableRow}
                  >
                    <Text style={styles.tableCell}>{item.grade}</Text>
                    <Text style={styles.tableCell}>{item.count}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Grade Details for {selectedModalGrade}</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Anganwadi No</Text>
              </View>
              {renderChildList()}
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScrollView>
  );

};

export default GradeDistribution;