import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { API_URL } from './config';
const GradePerChild = ({ route }) => {
  const { anganwadiNo, childsName } = route.params;

  // State variables to store data
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          anganwadiNo,
          childsName,
        };
   
        const response = await fetch( `${API_URL}/getVisitsData`, {
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
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [anganwadiNo, childsName]);

  // Extract grade data from formData
  const { data } = formData || {};
  const grades = data ? data.map((entry) => entry.grade) : [];

  // Convert categorical grades to numerical values
  const gradeValues = grades.map((grade) => {
    switch (grade) {
      case 'NORMAL':
        return 0;
      case 'MAM':
        return 1;
      case 'SAM':
        return 2;
      default:
        return 0; // Handle other cases as needed
    }
  });

  const chartData = {
    labels: data ? data.map((_, index) => `Visit ${index + 1}`) : [],
    datasets: [
      {
        data: gradeValues,
        strokeWidth: 2,
      },
    ],
  };

  const tableData = data || [];

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View>
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Grade Chart</Text>
            <ScrollView horizontal={true}>
              <LineChart
                data={chartData}
                width={chartData.labels.length * 100} // Adjust width as needed
                height={200}
                yAxisLabel="Grade"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  color: (opacity = 0.7) => `rgba(128, 0, 128, ${opacity})`,
                  decimalPlaces: 0,
                }}
                style={styles.chartStyle}
                formatYLabel={(value) => {
                  switch (value) {
                    case 0:
                      return 'Normal';
                    case 1:
                      return 'MAM';
                    case 2:
                      return 'SAM';
                    default:
                      return '';
                  }
                }}
              />
            </ScrollView>
          </View>

          <View style={styles.table}>
            <Text style={styles.tableTitle}>Summary Table</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader, { flex: 2 }]}>
                  <Text style={styles.tableHeaderText}>Visit Date</Text>
                </View>
                <View style={[styles.tableHeader, { flex: 1 }]}>
                  <Text style={styles.tableHeaderText}>Grade</Text>
                </View>
              </View>
              {tableData.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text style={styles.tableCellText}>{item.visitDate}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.tableCellText}>{item.grade}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
    padding: 8,
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
  },
  tableCellText: {
    fontSize: 14,
    color: '#333',
    textAlign:'center'
  },
});

export default GradePerChild;