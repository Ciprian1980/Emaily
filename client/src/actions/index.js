import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user')
    console.log('this is res.data:', res.data)
    dispatch({ type: FETCH_USER, payload: res.data });
};
//making a post request with a token and send it to our backend server 
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  //after we get back the response, we dispatch it with the action type
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);
  //navigate to surveys after user submitted the form
  history.push('/surveys');
  dispatch({ type: FETCH_USER,  payload: res.data });
}

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res.data })
}

