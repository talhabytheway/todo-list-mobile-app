import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import actionCreators from '../store/actionCreators';

import {useDispatch, useSelector} from 'react-redux';
import {auth, db} from '../firebase/config';
import {signOut} from 'firebase/auth';
import {collection, getDocs} from 'firebase/firestore';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Arrow from '../assets/svgs/Arrow';

import colors from '../constants/colors';
import fonts from '../constants/fonts';
import ratios from '../constants/ratios';

const Home = ({navigation}) => {
  const state = useSelector(state => state);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getTodos();
  }, []);

  function getTodos() {
    setLoading(true);
    let todos = {};
    getDocs(collection(db, `users/${state.auth.uid}/todos`))
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let {title, description} = doc.data();
          todos[doc.id] = {
            title,
            description,
          };
        });
        dispatch(actionCreators.setTasks(todos));
      })
      .finally(() => setLoading(false))
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
    <View style={styles.bg}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.even} onPress={getTodos}>
          <Text
            style={[
              styles.mainHeading,
              {flexGrow: 0, fontSize: ratios.fontPixel(37)},
            ]}>
            ↻
          </Text>
        </TouchableOpacity>
        <Text style={styles.mainHeading}>Tasks</Text>
        <TouchableOpacity style={styles.mainCtaPar} onPress={signout}>
          <Text style={styles.mainCta}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <Text style={styles.todoTitle}>Loading</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll}>
          {Object.keys(state.todos).map(key => (
            <View key={key} style={styles.cardPar}>
              <View style={styles.textPar}>
                <Text style={styles.todoTitle}>{state.todos[key].title}</Text>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.todoDesc}>
                  {state.todos[key].description}
                </Text>
              </View>
              <TouchableOpacity
                hitSlop={24}
                onPress={() =>
                  navigation.navigate('ViewTask', {
                    id: key,
                    title: state.todos[key].title,
                    description: state.todos[key].description,
                  })
                }>
                <Arrow />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddTask', {
                id: '',
                title: '',
                description: '',
              })
            }
            style={styles.cardPar}>
            <Text style={styles.todoTitle}>+ Add Task</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  nav: {
    paddingHorizontal: ratios.widthPixel(20),
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.pink + 'ee',
    flexDirection: 'row',
    height: ratios.heightPixel(100),
    alignItems: 'center',
  },
  mainHeading: {
    fontFamily: fonts.semi,
    fontSize: ratios.fontPixel(27),
    color: colors.beige,
    textAlign: 'center',
    flexGrow: 1,
  },
  proIcon: {
    padding: ratios.widthPixel(8),
    borderRadius: 100,
    backgroundColor: colors.beige,
  },
  cardPar: {
    marginHorizontal: ratios.widthPixel(32),
    marginVertical: ratios.widthPixel(8),
    paddingLeft: ratios.widthPixel(16),
    paddingRight: ratios.widthPixel(12),
    paddingVertical: ratios.widthPixel(12),
    elevation: 8,
    backgroundColor: colors.beige,
    shadowColor: '#000',
    shadowOffset: {width: ratios.widthPixel(2), height: ratios.widthPixel(2)},
    shadowOpacity: 0.25,
    shadowRadius: ratios.widthPixel(16),
    borderColor: colors.pink,
    borderWidth: ratios.widthPixel(1),
    borderRadius: ratios.widthPixel(12),
    flexDirection: 'row',
    gap: ratios.widthPixel(8),
    alignItems: 'center',
  },
  textPar: {
    width: '90%',
  },
  todoTitle: {
    fontFamily: fonts.semi,
    fontSize: ratios.fontPixel(25),
    color: colors.pink,
  },
  todoDesc: {
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(15),
    color: colors.brown,
  },
  loading: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ratios.widthPixel(100),
  },
  mainCtaPar: {
    backgroundColor: colors.beige,
    paddingHorizontal: ratios.widthPixel(16),
    paddingVertical: ratios.widthPixel(8),
    borderRadius: ratios.widthPixel(7),
  },
  mainCta: {
    fontFamily: fonts.semi,
    fontSize: ratios.fontPixel(14),
    color: colors.brown,
  },
  even: {
    marginRight: ratios.widthPixel(48),
  },
});
