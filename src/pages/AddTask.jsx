import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../firebase/config';
import {collection, addDoc, doc, deleteDoc, setDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import actionCreators from '../store/actionCreators';

const AddTask = () => {
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const [edit, setEdit] = useState('');
  const dispatch = useDispatch();

  let authState = useSelector(state => state.auth);
  let todos = useSelector(state => state.todos);

  async function addTaskAsync() {
    addDoc(collection(db, `users/${authState.uid}/todos`), {
      title: task,
      description: desc,
      uid: authState.uid,
    })
      .then(res => {
        dispatch(actionCreators.addTask(res.id, task, desc));
      })
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

  function setEditState(id, title, description) {
    setTask(title);
    setDesc(description);
    setEdit(id);
  }
  function editTask() {
    setDoc(doc(db, `users/${authState.uid}/todos/${edit}`), {
      title: task,
      description: desc,
      uid: authState.uid,
    })
      .then(() => {
        dispatch(actionCreators.editTask(edit, task, desc));
      })
      .then(() => {
        setTask('');
        setDesc('');
        setEdit('');
      })
      .finally(() => {
        Toast.show({
          type: 'success',
          text1: `Edited Task Successfully 📝`,
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

  function removeTask(id) {
    deleteDoc(doc(db, `users/${authState.uid}/todos/${id}`))
      .then(() => dispatch(actionCreators.removeTask(id)))
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <View style={{padding: 20}}>
      <TextInput
        placeholder="task"
        onChangeText={text => setTask(text)}
        value={task}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="desc"
        onChangeText={text => setDesc(text)}
        value={desc}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={() => (edit.length > 1 ? editTask() : addTaskAsync())}
        style={{
          color: 'white',
          backgroundColor: 'seagreen',
          padding: 3,
          alignItems: 'center',
        }}>
        <Text>{edit.length > 1 ? 'EDIT' : 'ADD'} TASK</Text>
      </TouchableOpacity>

      <View>
        {Object.keys(todos).map(key => (
          <>
            <Text>
              {todos[key].title} {key}
            </Text>
            <Text onPress={() => removeTask(key)}>Remove ❌</Text>
            <Text
              onPress={() =>
                setEditState(key, todos[key].title, todos[key].description)
              }>
              EDIT 📝
            </Text>
          </>
        ))}
      </View>
    </View>
  );
};

export default AddTask;
