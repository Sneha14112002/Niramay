import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Button,
    StatusBar,
    FlatList,
} from 'react-native';
import COLORS from '../constants/colors';
import { API_URL } from './config';

const GeneralHistoryDisplay = ({ route }) => {
    const { anganwadiNo, childsName } = route.params;
    const [generalHistoryData, setGeneralHistoryData] = useState(null);
    const [visitsData, setVisitsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addVisitMode, setAddVisitMode] = useState(false);
    const [newVisit, setNewVisit] = useState({
        date: '',
        noOfSupplements: '',
        haemoglobin: '',
        muac: '',
        weight: '',
        height: '',
        difference: '',
        grade: '',
        observations: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestData = {
                    anganwadiNo,
                    childsName,
                };
                const response = await fetch(`${API_URL}/getGeneralHistory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setGeneralHistoryData(data);
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

    useEffect(() => {
        const fetchVisitsData = async () => {
            try {
                const requestData = {
                    anganwadiNo,
                    childsName,
                };
                const visitsResponse = await fetch(`${API_URL}/getVisits`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                if (visitsResponse.status === 200) {
                    const visitsData = await visitsResponse.json();
                    setVisitsData(visitsData);
                } else {
                    console.log('Visits data not found in the database');
                }
            } catch (error) {
                console.error('Error fetching visits data:', error);
            }
        };

        fetchVisitsData();
    }, [anganwadiNo, childsName]);

    const handleAddVisit = () => {
        setAddVisitMode(true);
    };

    const handleCancelAddVisit = () => {
        setAddVisitMode(false);
        setNewVisit({
            date: '',
            noOfSupplements: '',
            haemoglobin: '',
            muac: '',
            weight: '',
            height: '',
            difference: '',
            grade: '',
            observations: '',
        });
    };

    const handleSaveVisit = async () => {
        try {
            const requestData = {
                anganwadiNo,
                childName: childsName,
                visitDate: newVisit.date,
                noOfSupplements: newVisit.noOfSupplements,
                haemoglobin: newVisit.haemoglobin,
                muac: newVisit.muac,
                weight: newVisit.weight,
                height: newVisit.height,
                difference: newVisit.difference,
                grade: newVisit.grade,
                observations: newVisit.observations,
            };
    
            const response = await fetch(`${API_URL}/visits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            if (response.status === 200) {
                // Successfully inserted into the server, you can update the local state as well.
                console.log('SILVIIIIIIIIIIIIIIIIIIII');
                setVisitsData([...visitsData, newVisit]);
                setNewVisit({
                    date: '',
                    noOfSupplements: '',
                    haemoglobin: '',
                    muac: '',
                    weight: '',
                    height: '',
                    difference: '',
                    grade: '',
                    observations: '',
                });
                setAddVisitMode(false);
            } else {
                console.log('Failed to insert data into the server');
            }
        } catch (error) {
            console.error('Error saving visit:', error);
        }
    };
    

    const renderVisitItem = ({ item }) => (
        <View style={styles.visitContainer}>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Visit Date:</Text>
                <Text style={styles.text}>{item.visitDate}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>No. of Supplements:</Text>
                <Text style={styles.text}>{item.noOfSupplements}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Haemoglobin:</Text>
                <Text style={styles.text}>{item.haemoglobin}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>MUAC:</Text>
                <Text style={styles.text}>{item.muac}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Height:</Text>
                <Text style={styles.text}>{item.height}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.text}>{item.weight}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Difference:</Text>
                <Text style={styles.text}>{item.difference}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Grade:</Text>
                <Text style={styles.text}>{item.grade}</Text>
            </View>
            <View style={styles.visitRow}>
                <Text style={styles.label}>Observations & Suggestions:</Text>
                <Text style={styles.text}>{item.observations}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <ScrollView style={styles.container}>
            {visitsData ? (
                <View style={styles.formDataContainer}>
                    <View style={styles.fieldContainer}>
                        <Text style={styles.subSectionTitle}>Child's Health Data</Text>
                    </View>
                    {generalHistoryData.map((healthData, index) => (
                        <View key={index} style={styles.fieldContainer}>
                            <Text style={styles.label}>Common Cold:</Text>
                            <Text style={styles.text}>{healthData.commonCold === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Cough:</Text>
                            <Text style={styles.text}>{healthData.cough === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Fever:</Text>
                            <Text style={styles.text}>{healthData.fever === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Vomiting:</Text>
                            <Text style={styles.text}>{healthData.vomiting === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Oedema:</Text>
                            <Text style={styles.text}>{healthData.oedema === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Vaccination Done:</Text>
                            <Text style={styles.text}>{healthData.vaccinationDone === 1 ? 'Yes' : 'No'}</Text>
                            <Text style={styles.label}>Eye:</Text>
                            <Text style={styles.text}>{healthData.eye}</Text>
                            <Text style={styles.label}>Ear:</Text>
                            <Text style={styles.text}>{healthData.ear}</Text>
                            <Text style={styles.label}>Face:</Text>
                            <Text style={styles.text}>{healthData.face}</Text>
                            <Text style={styles.label}>Hair:</Text>
                            <Text style={styles.text}>{healthData.hair}</Text>
                            <Text style={styles.label}>Abdomen:</Text>
                            <Text style={styles.text}>{healthData.abdomen}</Text>

                            <Text style={styles.label}>Other Signs:</Text>
                            <Text style={styles.text}>{healthData.otherSigns}</Text>
                            <Text style={styles.label}>Appetite Test:</Text>
                            <Text style={styles.text}>{healthData.appetiteTest}</Text>
                            <Text style={styles.label}>Thirst:</Text>
                            <Text style={styles.text}>{healthData.thirst}</Text>

                            <Text style={styles.label}>Motion:</Text>
                            <Text style={styles.text}>{healthData.motion}</Text>
                            <Text style={styles.label}>Observations and Suggestions:</Text>
                            <Text style={styles.text}>{healthData.observationsAndSuggestions}</Text>
                        </View>
                    ))}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.subSectionTitle}>Child's Visits Data</Text>
                    </View>
                    <FlatList
                        data={visitsData}
                        renderItem={renderVisitItem}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    {addVisitMode ? (
                        <View style={styles.addVisitContainer}>
                            <Text style={styles.subSectionTitle}>Add Visit</Text>
                            <Text style={styles.label}>Visit Date:</Text>
                            <TextInput
                                value={newVisit.date}
                                onChangeText={(text) => setNewVisit({ ...newVisit, date: text })}
                                placeholder="DD-MM-YYYY"
                                placeholderTextColor={COLORS.black}
                                keyboardType="phone-pad"
                                maxLength={10}
                                style={styles.textInput}
                            />
                            <Text style={styles.label}>No. of Supplements:</Text>
                            <TextInput
                                value={newVisit.noOfSupplements}
                                onChangeText={(text) => setNewVisit({ ...newVisit, noOfSupplements: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Haemoglobin:</Text>
                            <TextInput
                                value={newVisit.haemoglobin}
                                onChangeText={(text) => setNewVisit({ ...newVisit, haemoglobin: text })}
                                
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>MUAC:</Text>
                            <TextInput
                                value={newVisit.muac}
                                onChangeText={(text) => setNewVisit({ ...newVisit, muac: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Weight (Kg):</Text>
                            <TextInput
                                value={newVisit.weight}
                                onChangeText={(text) => setNewVisit({ ...newVisit, weight: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Height (cm):</Text>
                            <TextInput
                                value={newVisit.height}
                                onChangeText={(text) => setNewVisit({ ...newVisit, height: text })}
                                keyboardType="phone-pad"
                                style={styles.textInput}
                            />


                            <Text style={styles.label}>Difference:</Text>
                            <TextInput
                                value={newVisit.difference}
                                onChangeText={(text) => setNewVisit({ ...newVisit, difference: text })}
                                style={styles.textInput}
                            />

                            <Text style={styles.label}>Grade:</Text>
                            <TextInput
                                value={newVisit.grade}
                                onChangeText={(text) => setNewVisit({ ...newVisit, grade: text })}
                                style={styles.textInput}
                            />
                            <Text style={styles.label}>Observations & Suggestions:</Text>
                            <TextInput
                                value={newVisit.observations}
                                onChangeText={(text) => setNewVisit({ ...newVisit, observations: text })}
                                style={styles.textInput}
                            />
                            {/* Include other input fields for the new visit */}
                            <TouchableOpacity
                                onPress={handleSaveVisit}
                                style={styles.saveVisitButton}
                            >
                                <Text style={styles.buttonText}>Save Visit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCancelAddVisit}
                                style={styles.cancelVisitButton}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddVisit}
                            style={styles.addVisitButton}
                        >
                            <Text style={styles.buttonText}>Add Visit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <Text style={styles.errorText}>Data not found</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
    },
    formDataContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    fieldContainer: {
        marginBottom: 10,
    },
    subSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.black,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color:COLORS.black,
    },
    text: {
        fontSize: 16,
        color:COLORS.black,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    addVisitButton: {
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addVisitContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color:COLORS.black,
    },
    saveVisitButton: {
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelVisitButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    visitContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
    },
    visitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});

export default GeneralHistoryDisplay;