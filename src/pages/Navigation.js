import Home from './Home';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ViewTask from './ViewTask';
import AddTask from './AddTask';

const Stack = createStackNavigator();

const Navigation = () => {
  let authState = useSelector(state => state.auth);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={authState.uid != '' ? 'Home' : 'Login'}>
        {authState.uid !== '' ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ViewTask" component={ViewTask} />
            <Stack.Screen name="AddTask" component={AddTask} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
