import {View, Text} from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './Login';
import Dashboard from './Dashboard';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName={Login}>
                
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;