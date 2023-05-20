import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/pages/Home';
import LoginScreen from './src/pages/LoginScreen';
import RegistrationScreen from './src/pages/RegistrationScreen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './src/store/store';
const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar translucent backgroundColor="transparent" />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName={user ? 'Home' : 'Login'}>
              {user ? (
                <Stack.Screen name="Home">
                  {props => <Home {...props} extraData={user} />}
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen
                    name="Registration"
                    component={RegistrationScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default App;
