import { FETCH_USER } from '../actions/types';

// export default function authReducer(state = {}, action) {
//     console.log("console log from action:", action);
//     switch (action.type) {
//       default:
//         return state;
//     }
//   }
  

export default function authReducer(state = null, action) {
    console.log('this is action.payload:', action.payload)
    //we return null if action is pending. 
    //Return action.payload if user is logged in. False if it's logged out.
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        default:
            return state;
    }
}