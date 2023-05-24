import 'react-native-gesture-handler';
import React from 'react';
import {View, StatusBar} from 'react-native';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

import {store, persistor} from './src/store/store';
import Navigation from './src/pages/Navigation';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar translucent backgroundColor="transparent" />
          <Navigation />
        </PersistGate>
      </Provider>
      <Toast />
    </View>
  );
};

export default App;
