import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer  from './authReducer';


//we name auth and form a descriptive name aso we can access later the value 
export default combineReducers({
    auth: authReducer,
    form: reduxForm
})

