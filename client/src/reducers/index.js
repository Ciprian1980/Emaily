import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer  from './authReducer';
import surveysReducer from './surveysReducers';
import deleteSurveysReducer from './deleteSurveysReducer';


//we name auth and form a descriptive name aso we can access later the value 
export default combineReducers({
    auth: authReducer,
    form: reduxForm,
    surveys: surveysReducer,
    deleteSurveys: deleteSurveysReducer
})

