import axios from 'axios';
import { FETCH_USER } from './types';
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