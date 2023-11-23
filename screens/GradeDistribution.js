import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import { API_URL } from './config';
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
    color:'black'
  },
  dropdownContainer: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
    color:'black'
  },
  dropdownText: {
    fontSize: 16,
    color:'black'
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    width: 300,
    color:'black'
  },
  dropdownOptionText: {
    fontSize: 16,
    color:'black'
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
    color:'black'
  },
  legendContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 12,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
  tableContainer: {
    borderRadius:8,
    paddingBottom:20,
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
    color:'black'
  },
});

const colors = ['#FF5733', '#FFC300', '#33FF57'];

const GradeDistribution = () => {
  const [bitName, setBitName] = useState([]);
  const [selectedBitName, setSelectedBitName] = useState('');
  const [visitDate, setVisitDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetVisitDate = () => {
    setVisitDate([]);
  };
  
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/bit_name`)
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
      axios.get( `${API_URL}/visitDate/${selectedBitName}`)
        .then((response) => {
          setVisitDate(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedBitName]);

  useEffect(() => {
    if (selectedDate) {
      axios.get(`${API_URL}/child_distribution/${selectedBitName}/${selectedDate}`)
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

  const pieChartData = data.map((item, index) => ({
    name: item.grade,
    count: item.count,
    color: colors[index % colors.length],
  }));

  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Grade Distribution</Text>
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
              onSelect={(index, value) => setSelectedDate(value)}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
            />
          </View>
        </View>
      )}

      {data.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.label}>Grade Distribution Chart</Text>
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
          <View style={styles.legendContainer}>
            {pieChartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                {/* <View style={{ backgroundColor: item.color, ...styles.legendColor }}></View> */}
                {/* <Text style={styles.legendText}>{`${item.name} (${item.count})`}</Text> */}
              </View>
            ))}
          </View>
        </View>
      )}

      {data.length > 0 && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Grade Summary</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.grade}</Text>
                <Text style={styles.tableCell}>{item.count}</Text>
              </View>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default GradeDistribution;
