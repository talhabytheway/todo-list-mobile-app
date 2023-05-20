import actionTypes from './actionTypes';
import {db} from '../firebase/config';
import {collection, addDoc, doc, setDoc} from 'firebase/firestore';

export default {
  addTask: (uid, title, description) => {
    const addTaskAsync = async () => {
      try {
        const taskRef = await addDoc(collection(db, 'todos'), {
          title,
          description,
          uid,
        });
        console.log(taskRef);
        return {
          type: actionTypes.ADD_TASK,
          payload: {
            taskId: taskRef.id,
            title,
            description,
          },
        };
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
    return addTaskAsync();
  },

  editTask: (uid, taskId, name, desc) => ({
    type: actionTypes.EDIT_TASK,
    payload: {uid, taskId, name, desc},
  }),

  removeTask: (uid, taskId) => ({
    type: actionTypes.REMOVE_TASK,
    payload: {uid, taskId},
  }),
  signIn: (email, password) => ({
    type: actionTypes.SIGN_IN,
    payload: {email, password},
  }),
  signUp: (name, email, password) => ({
    type: actionTypes.SIGN_IN,
    payload: {name, email, password},
  }),
};
