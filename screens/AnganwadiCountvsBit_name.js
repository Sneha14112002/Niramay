import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';

const AnganwadiCountvsBitName
 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make a GET request to your Node.js server
    axios.get('http://192.168.1.16:3000/anganwadi-count')
      .then(response => {
        setData(response.data);
        console.log(data)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 10 }}>
        Anganwadi Count vs Bit Name
      </Text>
      <BarChart
        data={{
          labels: data.map(item => item.bit_name), // An array of bit_names
          datasets: [
            {
              data: data.map(item => item.anganwadi_count), // An array of anganwadi_counts
            },
          ],
        }}
        width={350}
        height={300}
        yAxisLabel="Count"
        chartConfig={{
          backgroundGradientFrom: '#F7B733',
          backgroundGradientTo: '#FC4A1A',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          decimalPlaces: 0,
        }}
      />
    </View>
  );
};

export default AnganwadiCountvsBitName;
