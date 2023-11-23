import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import Draggable from 'react-native-draggable';
import { FlatList } from 'react-native';
import { API_URL } from './config';
const BitNamevsGender = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/childData`)
      .then((response) => {
        if (response.data instanceof Array) {
          setData(response.data);
        } else if (response.data instanceof Object) {
          const dataArray = Object.values(response.data);
          setData(dataArray);
        } else {
          console.error('Invalid data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const chartData = {
    labels: data.map((item) => item.bit_name),
    datasets: [
      {
        data: data.map((item) => parseInt(item.total_children_count)),
        color: (opacity = 1) => `rgba(280, 200, 250, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(110, 110, 90, ${opacity})`,
    barPercentage: 0.5,
    propsForDots: {
      r: '3',
    },
    propsForBackgroundLines: {
      stroke: '#fff',
    },
    labelRotation: 45,
    labelFontSize: 10,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Total Children by Bit Name</Text>
      <ScrollView horizontal={true}>
        <BarChart
          data={chartData}
          width={800}
          height={400}
          yAxisLabel="Count"
          chartConfig={chartConfig}
          style={styles.chart}
          ref={chartRef}
        />
      </ScrollView>
      <Text style={styles.legend}>Legend:</Text>
      <View style={styles.legendItem}>
        <View style={styles.legendColorBox} />
        <Text style={styles.legendText}>Total Children</Text>
      </View>
      <Draggable
        x={0}
        minX={0}
        maxX={chartData.labels.length * 60}
        onMove={(_, { x }) => {
          const scrollPosition = (x / (chartData.labels.length * 60)) * chartRef.current.scrollContentWidth;
          chartRef.current.scrollTo({ x: scrollPosition, animated: false });
        }}
      >
        <View style={styles.scrollbar} />
      </Draggable>
      <Text style={styles.summaryTableTitle}>Summary Table</Text>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Bit Name vs Count of Children</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.bitName}>{item.bit_name}</Text>
              <Text style={styles.childCount}>{item.total_children_count}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  chart: {
    margin: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  legend: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    backgroundColor: '#cecece',
    marginRight: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
  },
  scrollbar: {
    width: 50,
    height: 5,
    borderRadius: 5,
    marginTop: 10,
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
});

export default BitNamevsGender;