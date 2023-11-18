import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import Draggable from 'react-native-draggable';

const BitNamevsGenderGraph = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://192.168.1.16:3000/childDataGender')
      .then((response) => {
        if (response.data) {
          // Check if response.data is defined
          if (response.data instanceof Array) {
            // If the response is an array (ReadableNativeArray), use it as-is
            setData(response.data);
          } else if (response.data instanceof Object) {
            // If the response is an object (ReadableMap), convert it to an array
            const dataArray = Object.values(response.data);
            setData(dataArray);
          } else {
            console.error('Invalid data format:', response.data);
          }
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
        data: data.map((item) => parseInt(item.male_count)),
        color: (opacity = 1) => `rgba(255, 87, 51, ${opacity})`,
        legend: 'Male',
      },
      {
        data: data.map((item) => parseInt(item.female_count)),
        color: (opacity = 1) => `rgba(51, 255, 87, ${opacity})`,
        legend: 'Female',
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    barPercentage: 0.6,
    propsForDots: {
      r: '4',
    },
    propsForBackgroundLines: {
      stroke: 'transparent',
    },
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color for the bars
    labelRotation: 45,
    labelFontSize: 10,
  };

  if (data.length === 0) {
    return <Text>Loading data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Children by Bit Name and Gender</Text>
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
        <View style={[styles.legendColorBox, { backgroundColor: '#FF5733' }]} />
        <Text style={styles.legendText}>Male</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColorBox, { backgroundColor: '#33FF57' }]} />
        <Text style={styles.legendText}>Female</Text>
      </View>
      {/* Add the draggable scrollbar component */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    width: '100%',
    height: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
  },
  legend: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
  scrollbar: {
    width: 50,
    height: 5,
    borderRadius: 5,
  },
});

export default BitNamevsGenderGraph;