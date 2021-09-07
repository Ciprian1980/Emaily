//SurveyField contains logic to render a single label and text input

import React from 'react';

//some props are just available to us by default like the props.input
//Some Event listeners live on props.input that we can work with
//meta, error, touched are validation props that come with redux forms
//touched is returning the error when the user touches the input field.
export default ({ input, label,  meta: { error, touched } }) => {
    
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '5px' }}/>
            <div className="red-text" style={{ marginBottom: '20px' }}>
            {touched && error}
            </div>
        </div>
    );
};