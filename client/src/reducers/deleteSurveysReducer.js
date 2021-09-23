import { DELETE_SURVEYS } from '.././actions/types';

export default function(state = [], action) {
    switch(action.type) {
        case DELETE_SURVEYS: 
            return action.payload;
        default: 
            return state;
    }
}