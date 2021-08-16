//index.js, responsible for redux(data) setup in our application
import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers'

import App from './components/App';


const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
//made change
//it was reducers => [], {} etc

ReactDOM.render(
    //provider is a react componenent which knows how to read changes in redux store 
    //everytime there is a change in state. The provider will inform the App component and it's children,
    //updating it's components with the new state.
    <Provider store={store}><App /></Provider>, 
    document.querySelector('#root')
    );
console.log('STRIPE key is:', process.env.REACT_APP_STRIPE_KEY)
console.log('ENVIROMENT is', process.env.NODE_ENV);