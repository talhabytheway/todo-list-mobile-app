import actionTypes from './actionTypes';

const initialState = {
  auth: {
    isLoggedIn: false,
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
    default:
      return state;
  }
}

export default reducer;
