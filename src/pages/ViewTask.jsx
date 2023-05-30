import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import ratios from '../constants/ratios';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import {db} from '../firebase/config';
import {doc, deleteDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import actionCreators from '../store/actionCreators';

import Arrow from '../assets/svgs/Arrow';
import {useDispatch, useSelector} from 'react-redux';

const ViewTask = ({navigation, route}) => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const {id, title, description} = route.params;

  function removeTask() {
    deleteDoc(doc(db, `users/${state.auth.uid}/todos/${id}`))
      .then(() => dispatch(actionCreators.removeTask(id)))
      .then(() => navigation.popToTop())
      .finally(() => {
        Toast.show({
          type: 'success',
          text1: `Deleted task successfully 🗑`,
        });
      })
      .catch(error => {
        let code = error.code.split('/');
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
  return (
    <View style={styles.par}>
      <View style={styles.textPar}>
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.arr}>
          <Arrow />
        </TouchableOpacity>
        <Text style={styles.todoTitle}>{title}</Text>
      </View>
      <ScrollView style={styles.descPar}>
        <Text style={styles.todoDesc}>{description}</Text>
      </ScrollView>
      <View style={styles.btnParCont}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddTask', {id, title, description})
          }
          style={styles.btnPar}>
          <Text style={styles.btnTxt}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={removeTask} style={styles.btnPar}>
          <Text style={styles.btnTxt}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewTask;

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
    paddingVertical: ratios.widthPixel(20),
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
});
