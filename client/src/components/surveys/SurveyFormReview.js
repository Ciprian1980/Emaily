//SurveyFormReview shows users their inputs for review
//we need to connect to the redux store with connect to have access to values.
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

//withRouter gives access to the object history that helps to navigate in our app
//after request was made.
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
    const reviewFields = _.map(formFields, ({ name, label }) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        )
    })
    return (
        <div>
            <h5>please confirm your entries</h5>
            {reviewFields}
            <button
                className="yellow darken-3 btn-flat"
                onClick={onCancel}
            >
                Back
            </button>
            <button 
                onClick={() => submitSurvey(formValues, history)}
                className="green btn-flat right white-text">
                Send Survey
                <i className="material-icons right">email</i>
            </button>
        </div>
    )
}
//taking the state transforming into props and sending down into the component.
//we can access reduxForm values through state and connect.
//surveyForm.values are properties on the state.form object.
function mapStateToProps(state) {
    return {
        formValues: state.form.surveyForm.values 
    }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));