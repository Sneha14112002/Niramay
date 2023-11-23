import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { API_URL } from './config';
const GrowthChartPerChild = ({ route }) => {
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

                const response = await fetch(`${API_URL}/getVisitsData`, {
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

    // Extract weight data and visit dates from formData
    const { data } = formData || {};
    const weights = data ? data.map((entry) => parseFloat(entry.weight)) : [];
    const heights = data ? data.map((entry) => parseFloat(entry.height)) : [];
    const haemoglobin = data ? data.map((entry) => parseFloat(entry.haemoglobin)) : [];
    const visitDates = data ? data.map((entry) => entry.visitDate) : [];

    // Create an array of custom labels for the graph ("visit1," "visit2," etc.)
    const customLabels = heights.map((_, index) => `visit${index + 1}`);

    // Before using haemoglobin array in the LineChart component
    const filledHaemoglobin = haemoglobin.map((value, index) => {
        if (isNaN(value) && index > 0) {
            // If the value is NaN and index is greater than 0, replace it with the previous numeric value
            let previousNumericValue = null;

            for (let i = index - 1; i >= 0; i--) {
                if (!isNaN(haemoglobin[i])) {
                    previousNumericValue = haemoglobin[i];
                    break;
                }
            }

            return previousNumericValue || 0;
        }
        return value;
    });

    console.log(filledHaemoglobin);

    // Create table data with visit dates
    const tableData = visitDates.map((visitDate, index) => ({
        visit: visitDate,
        height: `${parseFloat(heights[index]).toFixed(2)} cm`,
        weight: `${parseFloat(weights[index]).toFixed(2)} kg`,
        haemoglobin: `${parseFloat(haemoglobin[index]).toFixed(2)} g/dL`,
    }));

    // Normalize the height, weight, and haemoglobin data
    const normalize = (data) => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue;

        return data.map((value) => (value - minValue) / range);
    };


    // Normalize the height, weight, and haemoglobin datasets
    const normalizedHeights = normalize(heights);
    const normalizedWeights = normalize(weights);
    const normalizedHaemoglobin = normalize(filledHaemoglobin);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <View>
                    <View style={styles.chart}>
                        <Text style={styles.chartTitle}>Growth Chart</Text>
                        <ScrollView horizontal={true}>
                            <LineChart
                                data={{
                                    labels: customLabels, // Use custom labels for x-axis on the graph
                                    datasets: [
                                        {
                                            data: normalizedHaemoglobin,
                                            color: (opacity = 0.7) => `rgba(237, 102, 99, ${opacity})`, // Customize color for haemoglobin
                                            strokeWidth: 2,
                                            legend: 'Haemoglobin', // Legend for the haemoglobin data
                                        },
                                        {
                                            data: normalizedHeights,
                                            color: (opacity = 0.7) => `rgba(255, 163, 114, ${opacity})`, // Customize color for height
                                            strokeWidth: 2,
                                            legend: 'Height', // Legend for the height data
                                        },
                                        {
                                            data: normalizedWeights,
                                            color: (opacity = 0.7) => `rgba(67, 101, 139, ${opacity})`, // Customize color for weight
                                            strokeWidth: 2,
                                            legend: 'Weight', // Legend for the weight data
                                        },

                                    ],
                                }}
                                width={customLabels.length * 60} // Adjust width as needed
                                height={200}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 2,
                                    color: (opacity = 0.7) => `rgba(0, 128, 128, ${opacity})`, // Add color property for the chart
                                    yAxisInterval: 1,
                                }}
                                style={styles.chartStyle}

                            />

                        </ScrollView>
                    </View>


                    <View style={styles.table}>
                        <Text style={styles.tableTitle}>Summary Table</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Visit Date</Text>
                                <Text style={styles.tableHeaderText}>Height</Text>
                                <Text style={styles.tableHeaderText}>Weight</Text>
                                <Text style={styles.tableHeaderText}>Haemoglobin</Text>
                            </View>
                            {tableData.map((item, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{item.visit}</Text>
                                    <Text style={styles.tableCell}>{item.height}</Text>
                                    <Text style={styles.tableCell}>{item.weight}</Text>
                                    <Text style={styles.tableCell}>{item.haemoglobin}</Text>
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
        paddingVertical: 20,
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
        borderWidth: 1, // Add a border to the table
        borderColor: '#ccc', // Border color
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1, // Add a border to the bottom of the header
        borderBottomColor: '#ccc', // Border color
    },
    tableHeaderText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
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
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: '#333'

    },
});

export default GrowthChartPerChild;