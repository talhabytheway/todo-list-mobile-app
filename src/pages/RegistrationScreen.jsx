import React, {useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {auth, db} from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from 'firebase/auth';
import {doc, setDoc, addDoc, collection} from 'firebase/firestore';
import actionCreators from '../store/actionCreators';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';

export default function RegistrationScreen({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let dispatch = useDispatch();

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const auth = getAuth();
        updateProfile(auth.currentUser, {displayName: fullName});
        const data = {
          uid: userCredential.user.uid,
          name: fullName,
          email: userCredential.user.email,
        };
        dispatch(
          actionCreators.setAuth(
            userCredential.user.uid,
            fullName,
            userCredential.user.email,
          ),
        );
        const usersRef = doc(db, 'users', userCredential.user.uid);
        setDoc(usersRef, data);

        addDoc(collection(db, `users/${userCredential.user.uid}/todos`), {
          title: 'Sample Task',
          description: 'Task Desc',
          uid: userCredential.user.uid,
        });
      })
      .finally(() => {
        Toast.show({
          type: 'success',
          text1: `Signed up Successfully ✅`,
        });
      })
      .catch(error => {
        let code = error.code.split('/') || code;
        console.error(`${code[0]} error ${code[1].replace(/-/g, ' ')}`);
        Toast.show(
          error.code
            ? {
                type: 'error',
                text1: `${code[0]} error ⚠️`,
                text2: `${code[1].replace(/-/g, ' ')}`,
              }
            : {
                type: 'error',
                text1: error,
              },
        );
      });
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already got an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  title: {},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: 'center',
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: '#788eec',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
