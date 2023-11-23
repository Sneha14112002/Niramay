import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const AnganwadiCountPerBit = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.7.70:3000/anganwadi-count');
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderSummaryItem = ({ item }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryBit}>{item.bit_name}</Text>
      <Text style={styles.summaryCount}>{item.anganwadi_count}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Anganwadi Count Per Bit</Text>
    {data.length > 0 ? (
      <View>
        <View style={styles.chartContainer}>
          <ScrollView horizontal={true}>
            <BarChart
              data={{
                labels: data.map((item) => item.bit_name),
                datasets: [
                  {
                    data: data.map((item) => item.anganwadi_count),
                  },
                ],
              }}
              width={data.length * 100}
              height={200}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              barPercentage={0.6}
              categoryPercentage={0.7}
              fromZero={false}
              style={{ marginVertical: 8, backgroundColor: '#f4f4f4' }}
              withInnerLines={true} // Enable inner lines
              withOuterLines={true} // Enable outer lines
              yAxisInterval={1}
              rotation={45}
              formatYLabel={(value) => `${value}`}
              horizontalLinesColor={'rgba(128, 0, 128, 0.7)'}
              verticalLinesColor={'rgba(128, 0, 128, 0.7)'}
            />
          </ScrollView>
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary Table</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.bit_name}
            renderItem={renderSummaryItem}
          />
        </View>
      </View>
    ) : (
      <Text>No data available</Text>
    )}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  chartContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
  },
  summaryContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  summaryBit: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  summaryCount: {
    marginLeft: 16,
    color: '#333',
    fontSize: 16,
  },
});

export default AnganwadiCountPerBit;