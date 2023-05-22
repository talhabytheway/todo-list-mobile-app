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
import {signInWithEmailAndPassword} from 'firebase/auth';
import actionCreators from '../store/actionCreators';
import {useSelector, useDispatch} from 'react-redux';
import {collection, addDoc, doc, setDoc, deleteDoc} from 'firebase/firestore';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const [taskId, setId] = useState('');

  const state = useSelector(state => state);
  const dispatch = useDispatch();

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  const onLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        dispatch(
          actionCreators.setAuth(
            userCredential.user.uid,
            userCredential.user.displayName,
            userCredential.user.email,
          ),
        );
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  async function addTaskAsync() {
    try {
      addDoc(collection(db, `users/${state.auth.uid}/todos`), {
        title: task,
        description: desc,
        uid: state.auth.uid,
      }).then(res => {
        dispatch(actionCreators.addTask(res.id, task, desc));
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  async function removeTask(id) {
    try {
      deleteDoc(doc(db, `users/${state.auth.uid}/todos/${id}`));
      console.log(id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
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
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          placeholder="task"
          onChangeText={text => setTask(text)}
          value={task}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          placeholder="desc"
          onChangeText={text => setDesc(text)}
          value={desc}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>
            {state.auth.uid !== '' ? 'Logged In' : 'Log In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addTaskAsync()}>
          <Text style={styles.buttonTitle}>task in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
        {Object.keys(state.todos).map(key => (
          <View key={key} onTouchEnd={() => removeTask(key)}>
            <Text>{state.todos[key].title}</Text>
            <Text>desc {JSON.stringify(state.todos[key].description)}</Text>
          </View>
        ))}
        <Text>{JSON.stringify(state)}</Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
