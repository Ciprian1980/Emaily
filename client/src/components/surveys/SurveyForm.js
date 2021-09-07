//SurveyForm shows a form for the user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import { Link } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

//field - html component helping to create forms
//reduxForm is adding props to SurveyForm through connect function. One of the props is handleSubmit.
class SurveyForm extends Component {
    renderFields() {
        return _.map(formFields, ({ label, name}) => {
            return (
            <Field key={name} component={SurveyField} type="text" label={label} name={name} />
            );
        });
    }

    render() {
        return (
            <div>
                {/* we dont want () for onSurveySubmit, because we wanna render after the user presses submit */}
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>
        )
    }
}
//if the prop in the function matches the prop in the FIELDS array,
//and 'title' is a property on the key 'name' which is a prop on the Field key={name},
//redux forms is passing the value 'You must provide a title' to the 
//SurveyField in the Field component.
function validate(values) {
    const errors = {};
    errors.recipients = validateEmails(values.recipients || '');

    //FIELDS is part of the _ lodash library.
    _.each(formFields, ({ name }) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value';
        }
    });
    
    return errors;
}

export default reduxForm({
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false
})(SurveyForm);