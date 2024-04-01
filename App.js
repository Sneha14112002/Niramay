import React,{useState} from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Signup, Welcome, Assistant_form } from "./screens";
import CustomerForm from './screens/CustomerForm';
import HomePage from './screens/HomePage';
import ViewForm from './screens/ViewForm';
import IsChildAlreadyPresent from './screens/IsChildAlreadyPresent';
import COLORS from './constants/colors';
import ChildPresent from './screens/ChildPresent';
import GeneralHistoryForm from './screens/GeneralHistoryForm';
import IsChild from './screens/IsChild';
import ChildReport from './screens/ChildReport'
import GeneralHistoryDisplay from './screens/GeneralHistoryDisplay';
import ConsolidatedReports from './screens/ConsolidatedReports';
import BitNamevsGender from './screens/BitNamevsGender';
import GradeDistribution from './screens/GradeDistribution'
import Reports from './screens/Reports';
import HeightPerChild from './screens/HeightPerChild'
import WeightPerChild from './screens/WeightPerChild'
import HaemoglobinPerChild from './screens/HaemoglobinPerChild'
import GradePerChild from './screens/GradePerChild'
import AnganwadiCountvsBit_name from './screens/AnganwadiCountvsBit_name';
import BitNamevsGenderGraph from './screens/BitNamevsGenderGraph';
import GrowthChartPerChild from './screens/GrowthChartPerChild';
import PhoneCheck from './screens/PhoneCheck';
import GradeTransition from './screens/GradeTransition';
const Stack = createNativeStackNavigator();
import Menu from './screens/menu';
import BMIChartvsPerVisit from './screens/BMIChartvsPerVisit';
import AnganwadiCountPerBit from './screens/AnganwadiCountPerBit';
import ChangePassword from './screens/ChangePassword';
import SideMenu from 'react-native-side-menu';
import AboutUsScreen from './screens/AboutUsScreen';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawerButton, setShowDrawerButton] = useState(false); // Add state to control drawer button visibility

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="teal" barStyle="light-content" />
      <StatusBar hidden={true} />
      <NavigationContainer>
      <SideMenu
      isOpen={isOpen}
      menu={<Menu toggleMenu={toggleMenu} />}
      onChange={(isOpen) => setIsOpen(isOpen)}
    >
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
              shadowColor: 'transparent'
            }}
          />
          
         
          <Stack.Screen
            name="Menu"
            component={Menu}
            options={{
              headerShown: false,
              shadowColor: 'transparent'
            }}
          />
          

          <Stack.Screen
  name="HomePage"
  options={{
    headerShown: false,
  }}
>
  {(props) => (
    <HomePage {...props} toggleMenu={toggleMenu} />
  )}
</Stack.Screen>

          <Stack.Screen
            name="CustomerForm"
            component={CustomerForm}
            options={{

              headerStyle: {
                backgroundColor: 'teal', // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Personal Information'
              // headerTintColor: COLORS.white,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,

            }}

          />


          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
            }}
          />
          <Stack.Screen
            name="IsChildAlreadyPresent"
            component={IsChildAlreadyPresent}
            options={{
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Child Profile'


            }}
          />
          <Stack.Screen
            name="ViewForm"
            component={ViewForm}
            options={{
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Child Profile'


            }}
          />
          <Stack.Screen
            name="ChildPresent"
            component={ChildPresent}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
            }}
          />

          <Stack.Screen
            name="GeneralHistoryForm"
            component={GeneralHistoryForm}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Medical Form",
            }}
          />
          <Stack.Screen
            name="IsChild"
            component={IsChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Child Profile",
            }}
          />
          <Stack.Screen
            name="ChildReport"
            component={ChildReport}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />

          <Stack.Screen
            name="ConsolidatedReports"
            component={ConsolidatedReports}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "ConsolidatedReport",
            }}
          />
          <Stack.Screen
            name="GeneralHistoryDisplay"
            component={GeneralHistoryDisplay}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />


          <Stack.Screen
            name="BitNamevsGender"
   
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
            >
  {(props) => (
    <BitNamevsGender {...props} toggleMenu={toggleMenu} />
  )}
</Stack.Screen>
          <Stack.Screen
            name="GradeDistribution"
            
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
            >
            {(props) => (
              <GradeDistribution {...props} toggleMenu={toggleMenu} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AnganwadiCountvsBit_name"
            component={AnganwadiCountvsBit_name}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />

          <Stack.Screen
            name="Reports"
            
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
            >
  {(props) => (
    <Reports {...props} toggleMenu={toggleMenu} />
  )}
</Stack.Screen>
          <Stack.Screen
            name="HeightPerChild"
            component={HeightPerChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />


          <Stack.Screen
            name="WeightPerChild"
            component={WeightPerChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />


          <Stack.Screen
            name="HaemoglobinPerChild"
            component={HaemoglobinPerChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />

          <Stack.Screen
            name="GradePerChild"
            component={GradePerChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />

          <Stack.Screen
            name="BitNamevsGenderGraph"
           
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
            >
  {(props) => (
    <BitNamevsGenderGraph {...props} toggleMenu={toggleMenu} />
  )}
</Stack.Screen>

<Stack.Screen
            name="GrowthChartPerChild"
            component={GrowthChartPerChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />
          <Stack.Screen
            name="BMIChartvsPerVisit"
            component={BMIChartvsPerVisit}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />
          

          <Stack.Screen
            name="AnganwadiCountPerBit"
        
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
            >
  {(props) => (
    <AnganwadiCountPerBit {...props} toggleMenu={toggleMenu} />
  )}
</Stack.Screen>


<Stack.Screen
              name="PhoneCheck"
              component={PhoneCheck}
              options={{
                // headerShown: false,
                headerStyle: {
                  backgroundColor: COLORS.theme, // Set your desired background color

                },
                headerTintColor: COLORS.white,
                title: "Verification",
              }}
            />

<Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{
                // headerShown: false,
                headerStyle: {
                  backgroundColor: COLORS.theme, // Set your desired background color

                },
                headerTintColor: COLORS.white,
                title: "Verification",
              }}
            />

<Stack.Screen
              name="GradeTransition"
        
              options={{
                // headerShown: false,
                headerStyle: {
                  backgroundColor: COLORS.theme, // Set your desired background color

                },
                headerTintColor: COLORS.white,
                title: "Consolidated Report",
              }}
              >
              {(props) => (
                <GradeTransition {...props} toggleMenu={toggleMenu} />
              )}
            </Stack.Screen>
             <Stack.Screen
              name="AboutUsScreen"
              component={AboutUsScreen}
              options={{
                headerStyle: {
                  backgroundColor: COLORS.theme,
                },
                headerTintColor: COLORS.white,
                title: "About Us",
              }}
            />
          </Stack.Navigator>
        </SideMenu>
      </NavigationContainer>
    </View>
  );
}