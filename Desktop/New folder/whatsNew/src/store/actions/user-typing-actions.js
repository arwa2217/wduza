import { CLEAR_TYPING_FLAG } from "../actionTypes/user-typing-actionTypes";
const clearTyping = () => {
  return {
    type: CLEAR_TYPING_FLAG,
  };
};
export { clearTyping };
