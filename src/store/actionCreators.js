import actionTypes from './actionTypes';

export default {
  addTask: (taskId, title, description) => ({
    type: actionTypes.ADD_TASK,
    payload: {
      taskId,
      title,
      description,
    },
  }),

  editTask: (uid, taskId, name, desc) => ({
    type: actionTypes.EDIT_TASK,
    payload: {uid, taskId, name, desc},
  }),

  removeTask: (uid, taskId) => ({
    type: actionTypes.REMOVE_TASK,
    payload: {uid, taskId},
  }),
  setAuth: (uid, name, email) => ({
    type: actionTypes.SET_AUTH,
    payload: {uid, name, email},
  }),
};
