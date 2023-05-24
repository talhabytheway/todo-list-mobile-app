import actionTypes from './actionTypes';

const initialState = {
  auth: {
    uid: '',
    name: '',
    email: '',
  },
  todos: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TASK: {
      const {taskId, title, description} = action.payload;
      return {
        ...state,
        todos: {
          [taskId]: {
            title,
            description,
          },
          ...state.todos,
        },
      };
    }
    case actionTypes.ADD_TASKS: {
      return {
        ...state,
        todos: {
          ...action.payload,
        },
      };
    }
    case actionTypes.SET_AUTH: {
      return {
        ...state,
        auth: {...action.payload},
      };
    }
    case actionTypes.REMOVE_TASK: {
      let id = action.payload;
      const deepCopy = JSON.parse(JSON.stringify(state));
      delete deepCopy.todos[id];
      return deepCopy;
    }
    case actionTypes.EDIT_TASK: {
      let {taskId, name, desc} = action.payload;
      const deepCopy = JSON.parse(JSON.stringify(state));
      deepCopy.todos[taskId] = {
        name,
        description,
      };
    }
    case actionTypes.SIGN_OUT: {
      return {
        ...state,
        auth: {
          uid: '',
          name: '',
          email: '',
        },
      };
    }
    default:
      return state;
  }
}

export default reducer;
