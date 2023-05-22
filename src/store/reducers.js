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
    case actionTypes.SET_AUTH: {
      console.log(action.payload, 'ughhhhhhhhhhhhhhhhhh');
      return {
        ...state,
        auth: {...action.payload},
      };
    }
    default:
      return state;
  }
}

export default reducer;
