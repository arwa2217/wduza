import {
  ADD_REACTION_REQUEST,
  ADD_REACTION_SUCCESS,
  ADD_REACTION_ERROR,
  REMOVE_REACTION_REQUEST,
  REMOVE_REACTION_SUCCESS,
  REMOVE_REACTION_ERROR,
} from "../actionTypes/post-reaction-action-type";

const initialState = {
  addingReaction: false,
  addedReaction: false,
  removingReaction: false,
  removedReaction: false,
};

const PostReactionReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case ADD_REACTION_REQUEST:
      return {
        ...state,
        addingReaction: true,
      };
    case ADD_REACTION_SUCCESS:
      return {
        ...state,
        addingReaction: false,
        addedReaction: true,
      };
    case ADD_REACTION_ERROR:
      return {
        ...state,
        addingReaction: false,
        addedReaction: true,
      };
    case REMOVE_REACTION_REQUEST:
      return {
        ...state,
        removingReaction: true,
      };
    case REMOVE_REACTION_SUCCESS:
      return {
        ...state,
        removingReaction: false,
        removedReaction: true,
      };
    case REMOVE_REACTION_ERROR:
      return {
        ...state,
        removingReaction: false,
        removedReaction: true,
      };
    default:
      return state;
  }
};

export default PostReactionReducer;
