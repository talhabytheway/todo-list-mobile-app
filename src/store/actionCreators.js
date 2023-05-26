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

  setTasks: tasks => ({
    type: actionTypes.ADD_TASKS,
    payload: tasks,
  }),

  editTask: (taskId, title, description) => ({
    type: actionTypes.EDIT_TASK,
    payload: {taskId, title, description},
  }),

  removeTask: taskId => ({
    type: actionTypes.REMOVE_TASK,
    payload: taskId,
  }),
  setAuth: (uid, name, email) => ({
    type: actionTypes.SET_AUTH,
    payload: {uid, name, email},
  }),
  signout: () => ({
    type: actionTypes.SIGN_OUT,
  }),
};
