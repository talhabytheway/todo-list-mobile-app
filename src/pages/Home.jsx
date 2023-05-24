import {StyleSheet, Text, View, Button} from 'react-native';
import React, {useEffect} from 'react';
import {signOut} from 'firebase/auth';
import actionCreators from '../store/actionCreators';
import {useDispatch, useSelector} from 'react-redux';
import {auth, db} from '../firebase/config';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {collection, getDocs} from 'firebase/firestore';
import AddTask from './AddTask';

const Home = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    let todos = {};
    getDocs(collection(db, `users/${state.auth.uid}/todos`)).then(
      querySnapshot => {
        querySnapshot.forEach(doc => {
          let {title, description} = doc.data();
          todos[doc.id] = {
            title,
            description,
          };
        });
        dispatch(actionCreators.setTasks(todos));
      },
    );
  }, []);

  function signout() {
    signOut(auth)
      .then(() => {
        dispatch(actionCreators.signout());
      })
      .finally(() => {
        Toast.show({
          type: 'success',
          text1: `Signed out Successfully ✅`,
        });
      })
      .catch(error => {
        let code = error.code.split('/');
        Toast.show({
          type: 'error',
          text1: `${code[0]} error ⚠️`,
          text2: `${code[1].replace(/-/g, ' ')}`,
        });
      });
  }
  return (
    <View>
      <Text>sakdlasj</Text>
      <Button onPress={signout} title="Logout" />
      <AddTask />
    </View>
  );
};

export default Home;
