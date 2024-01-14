import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import COLORS from '../constants/colors';
const { width } = Dimensions.get('window');
const images = [
  require('../assets/ngo_image3.jpeg'),
  require('../assets/ngo_image1.jpeg'), // Replace with your image paths
  require('../assets/ngo_image2.jpeg'),
  
  // Add more images as needed
];
const AboutUsScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     setActiveIndex(viewableItems[0].index || 0);
  //   }
  // }, []);
  const renderItem = ({ item }) => (
    <Image source={item} style={styles.image} resizeMode="cover" />
  );
  return (
    <ScrollView contentContainerStyle={styles.container}>
  
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo2.jpg')} // Replace with the actual path to your NGO's logo
          style={styles.logo}
          resizeMode="contain" // Adjust resizeMode as needed
        />
        <View style={styles.textContainer}>
          <Text style={styles.ngoName}>Niramay</Text>
          <Text style={styles.tagline}>'सेवा परमो धर्म'</Text>
        </View>

      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subHeading}>Our Aim</Text>
        <Text style={styles.aimText}>
          To provide health guidance and medication to children from slums of Pune.
          Niramay was inaugurated on 28th August 2007 on the auspicious day of ‘Raksha Bandhan’.
        </Text>
        <Text style={styles.subHeading}>Mission</Text>
        <Text style={styles.aimText}>
          Provide immunization and parental care to a larger number of slum children
          Curb the problem of malnutrition
          Institute counselling and clinical centers for adolescent girls so that they can raise a healthy future generation In keeping with this mission, Niramay runs several well-received programmes in Pune.
        </Text>
      </View>
      <View style={styles.sliderContainer}>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ width }}
          // onViewableItemsChanged={onViewableItemsChanged} // Add onViewableItemsChanged callback
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }} // Adjust threshold as needed
        />
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : null,
                index === 0 ? { marginLeft: 0 } : null, // Adjust marginLeft for the first dot
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.logoContainer2}>
        <Image
          source={require('../assets/college_logo.png')} // Replace with the actual path to your NGO's logo
          style={styles.logo}
          resizeMode="contain" // Adjust resizeMode as needed
        />
        <View style={styles.textContainer}>
          <Text style={styles.ngoName}>Cummins College Of Engineering For Women</Text>
          <Text style={styles.tagline}>'शीलं परं भूषणं'</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subHeading}>Developed By:</Text>
        <Text style={styles.aimText}>
         Sneha Marcus Shinde</Text>
         <Text style={styles.aimText}>
         Piyusha Sandip shinde</Text>
         <Text style={styles.aimText}>
         Silvi Parlani</Text>
         <Text style={styles.aimText}>
         Simran Suresh Modi</Text>
      
            <Text style={styles.subHeading}>Mentors:</Text>
            <Text style={styles.aimText}>
            Vaishali Salgar</Text>
            <Text style={styles.aimText}>
            Shilpa Deshpande</Text>
    
            <View style={styles.mentor}>
            <Text style={styles.subHeading}>contact us on:</Text>
            <Text style={styles.aimText}>Email: administrator@cumminscollege.in
Tel: 020- 25311000, 25477211      
            </Text>
          
            </View>
      </View>
      
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  logo: {
    width: 100,
    height: 100, // Adjust dimensions as needed
    marginRight: 20,

  },
  textContainer: {
    flex: 1,
  },
  ngoName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',

  },
  tagline: {
    fontSize: 16,
    color: COLORS.theme,

  },
  aimText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',

  },
  subHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555', // Slightly darker text color
  },
  sliderContainer: {
    height: 200, // Adjust the height as needed
    marginTop: 20,
  },
  image: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    paddingHorizontal: 5, // Add horizontal padding for dots alignment
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3, // Adjust horizontal margin for spacing between dots
  },
  activeDot: {
    backgroundColor: COLORS.theme, // Change to your active dot color
  },
  mentor:{}
  // Other styles as needed
});

export default AboutUsScreen;
