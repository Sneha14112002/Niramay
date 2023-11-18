import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const ChildReport = ({ route }) => {
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

        const response = await fetch('http://192.168.1.16:3000/getVisitsData', {
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

  // Extract height and weight data from formData
  const { data } = formData || {};
  const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];
  const weights = data ? data.map((entry) => parseFloat(entry.weight)) : [];
  const visitLabels = data ? data.map((_, index) => `Visit ${index + 1}`) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Child Report</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View>
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Height Chart</Text>
            <BarChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: heights,
                  },
                ],
              }}
              width={350}
              height={200}
              yAxisLabel="Height (cm)"
              yAxisSuffix=" cm"
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 0.7) => `rgba(0, 128, 255, ${opacity})`,
                strokeWidth: 2,
                barRadius: 0,
                decimalPlaces: 2,
              }}
              style={styles.chartStyle}
            />
            <View style={styles.xAxisLabels}>
              {visitLabels.map((label, index) => (
                <Text key={index} style={styles.xAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Weight Chart</Text>
            <BarChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: weights,
                  },
                ],
              }}
              width={350}
              height={200}
              yAxisLabel="Weight (kg)"
              yAxisSuffix=" kg"
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 0.7) => `rgba(128, 0, 128, ${opacity})`,
                strokeWidth: 2,
                barRadius: 0,
                decimalPlaces: 2,
              }}
              style={styles.chartStyle}
            />
            <View style={styles.xAxisLabels}>
              {visitLabels.map((label, index) => (
                <Text key={index} style={styles.xAxisLabel}>
                  {label}
                </Text>
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chart: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
    marginLeft: 10,
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
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#888',
  },
});

export default ChildReport;