import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../firebase/config';
import {collection, addDoc, doc, setDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import actionCreators from '../store/actionCreators';
import ratios from '../constants/ratios';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import Arrow from '../assets/svgs/Arrow';

const AddTask = ({navigation, route}) => {
  const {id, title, description} = route.params;
  const [task, setTask] = useState(title);
  const [desc, setDesc] = useState(description);
  const dispatch = useDispatch();
  let authState = useSelector(state => state.auth);

  async function addTaskAsync() {
    if (task == '' || desc == '') {
      Toast.show({
        type: 'info',
        text1: `Title and Description fields can not be empty ⚠️`,
      });
    } else {
      addDoc(collection(db, `users/${authState.uid}/todos`), {
        title: task,
        description: desc,
        uid: authState.uid,
      })
        .then(res => {
          dispatch(actionCreators.addTask(res.id, task, desc));
        })
        .then(() => navigation.popToTop())
        .finally(() => {
          Toast.show({
            type: 'success',
            text1: `Added task Successfully ✅`,
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
  }
  function editTask() {
    if (task == '' || desc == '') {
      Toast.show({
        type: 'info',
        text1: `Title and Description fields can not be empty ⚠️`,
      });
    } else {
      setDoc(doc(db, `users/${authState.uid}/todos/${id}`), {
        title: task,
        description: desc,
        uid: authState.uid,
      })
        .then(() => {
          dispatch(actionCreators.editTask(id, task, desc));
        })
        .then(() => navigation.navigate('Home'))
        .then(() => {
          Toast.show({
            type: 'success',
            text1: `Edited Task Successfully 📝`,
          });
        })
        .catch(error => {
          let code = error?.code.split('/');
          error.code !== undefined
            ? Toast.show({
                type: 'error',
                text1: `${code[0]} error ⚠️`,
                text2: `${code[1].replace(/-/g, ' ')}`,
              })
            : Toast.show({
                type: 'error',
                text1: error,
              });
        });
    }
  }

  return (
    <View style={styles.par}>
      <View style={styles.textPar}>
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.arr}>
          <Arrow />
        </TouchableOpacity>
        <Text style={styles.todoTitle}>{id == '' ? 'Add' : 'Edit'} Task</Text>
      </View>
      <View style={styles.titlePar}>
        <TextInput
          placeholder="Task Title"
          onChangeText={text => setTask(text)}
          value={task}
          underlineColorAndroid="transparent"
          autoCapitalize="words"
        />
      </View>
      <ScrollView style={styles.descPar}>
        <TextInput
          placeholder="Task Description"
          onChangeText={text => setDesc(text)}
          multiline={true}
          value={desc}
          underlineColorAndroid="transparent"
          autoCapitalize="sentences"
        />
      </ScrollView>
      <View style={styles.btnParCont}>
        <TouchableOpacity
          onPress={() => (id == '' ? addTaskAsync() : editTask())}
          style={styles.btnPar}>
          <Text style={styles.btnTxt}>{id == '' ? 'Add' : 'Edit'} Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  par: {
    flex: 1,
    backgroundColor: colors.beige,
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: ratios.widthPixel(20),
    paddingVertical: ratios.widthPixel(8),
  },
  arr: {
    transform: [{rotate: '180deg'}],
    marginTop: ratios.widthPixel(4),
  },
  textPar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  todoTitle: {
    fontFamily: fonts.semi,
    fontSize: ratios.fontPixel(25),
    color: colors.brown,
    textAlign: 'center',
    flexGrow: 1,
  },
  todoDesc: {
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(17),
    color: colors.brown,
    paddingBottom: ratios.widthPixel(30),
  },
  descPar: {
    backgroundColor: '#fffa',
    flex: 1,
    marginTop: ratios.widthPixel(20),
    borderRadius: ratios.widthPixel(12),
    paddingHorizontal: ratios.widthPixel(20),
    paddingBottom: ratios.widthPixel(20),
  },
  btnParCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ratios.widthPixel(20),
    marginTop: ratios.widthPixel(16),
  },
  btnPar: {
    backgroundColor: colors.pink,
    paddingVertical: ratios.widthPixel(12),
    borderRadius: ratios.widthPixel(12),
    flexGrow: 1,
  },
  btnTxt: {
    textAlign: 'center',
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(19),
    color: 'white',
  },
  titlePar: {
    backgroundColor: '#fffa',
    borderRadius: ratios.widthPixel(12),
    paddingHorizontal: ratios.widthPixel(20),
    marginTop: ratios.widthPixel(16),
  },
});

export default AddTask;
