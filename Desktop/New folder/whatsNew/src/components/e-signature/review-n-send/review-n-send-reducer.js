import { reviewNSendActions } from './review-n-send-actions';

const reviewNSendReducer = (state, action) => {
    switch(action.type) {
        case reviewNSendActions.INPUT_CHANGE:
            return {
                ...state, 
                [action.field]: action.payload
            };
        case reviewNSendActions.DDP_SELECT:
            return {
                ...state, 
                [action.field]: action.payload
            };
        case reviewNSendActions.IS_DISABLED:
            return {
                ...state, 
                isDisabled: !!(action.payload)
            };
        default:
            return {...state}
    }
}

export default reviewNSendReducer;