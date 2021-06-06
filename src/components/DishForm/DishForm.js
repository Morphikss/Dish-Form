import React from "react";
import Input from "./Input";
import _ from "lodash";
import { reduxForm, Field, formValueSelector, change, untouch, SubmissionError } from "redux-form";
import { connect } from "react-redux";
import TimeField from "react-simple-timefield";
import Select from "./Select";
import axios from "axios";
import { Button, Col, Container, Form } from "react-bootstrap";

const renderInput = ({ input, meta }) => <Input {...input} type='text' errorMessage={meta.touched && meta.error} />;
const renderNumberInput = ({ input, meta }) => <Input {...input} type='number' errorMessage={meta.touched && meta.error} />;
const renderFloatInput = ({ input, meta }) => <Input {...input} step="0.1" type='number' errorMessage={meta.touched && meta.error} />;
const renderTimeInput = ({ input, meta }) => (
  <>
    <TimeField required showSeconds {...input} className='timeField' />
    {meta.touched && meta.error ? <Form.Text className="text-muted">{meta.error}</Form.Text> : undefined}
  </>
);

const renderSelect = ({ input, meta, children }) => (
  <Select {...input} type='text' errorMessage={meta.touched && meta.error}>{children} </Select>
);

const required = (v) => {
  if (!v || v === '') {
    return 'this field is required'
  }
  return undefined;
};

const requiredTime = (v) => {
  if (v === '00:00:00') {
    return 'time field is required'
  }
  return undefined;
};

const positiveNumber = (v) => {
  if (v <= 0) {
    return 'number cannot be negative lol'
  }
  return undefined;
};

const onSubmit = (values) => {
  return axios.post(
    'https://frosty-wood-6558.getsandbox.com:443/dishes',
    values,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      window.alert(`You submitted:\n\n${JSON.stringify(response.data, null, 2)}`)
    })
    .catch(error => {
      Object.entries(error.response.data).map(([key, value]) => {
        switch (key) {
          case 'name':
            throw new SubmissionError({ name: value, _error: 'Submit failed!' })
          case 'type':
            throw new SubmissionError({ type: value, _error: 'Submit failed!' })
          case 'preparation_time':
            throw new SubmissionError({ preparation_time: value, _error: 'Submit failed!' })
          case 'no_of_slices':
            throw new SubmissionError({ no_of_slices: value, _error: 'Submit failed!' })
          case 'diameter':
            throw new SubmissionError({ diameter: value, _error: 'Submit failed!' })
          case 'spiciness_scale':
            throw new SubmissionError({ spiciness_scale: value, _error: 'Submit failed!' })
          case 'slices_of_bread':
            throw new SubmissionError({ slices_of_bread: value, _error: 'Submit failed!' })
          default:
            throw new SubmissionError({ _error: 'Unexpected validation error: ' + value })
        }
      })
    });
};

let DishForm = ({handleSubmit, valid, dishTypeValue, reset, dispatch, error, submitting, pristine}) => {
  let resetFields = (formName, fieldsObj) => {
    Object.keys(fieldsObj).forEach(fieldKey => {
      dispatch(change(formName, fieldKey, fieldsObj[fieldKey]));
      dispatch(untouch(formName, fieldKey));
    });
  }

  return(
    <Container className='mt-5'>
      <h2>Dish form</h2>
      <Col md={4}>
        <form onSubmit={handleSubmit}>

          <div className='inputField'>
            <label>Name</label>
            <Field
              name='name'
              component={renderInput}
              validate={required}
            />
          </div>

          <div className='inputField' >
            <label>Time</label>
            <Field
              name='preparation_time'
              component={renderTimeInput}
              validate={[requiredTime, required]}
            />
          </div>

          <div className="inputField">
            <label>Type</label>
            <Field
              name="type"
              component={renderSelect}
              validate={required}
              onChange={ () => (
                resetFields('dishForm', {
                  diameter: '',
                  spiciness_scale: '',
                  slices_of_bread: '',
                  no_of_slices: ''
                })
              )}
            >
              <option value=""/>
              <option value="pizza">Pizza</option>
              <option value="soup">Soup</option>
              <option value="sandwich">Sandwich</option>
            </Field>
          </div>

          {dishTypeValue === 'pizza' &&
          <>
            <div className="inputField">
              <label>Number of slices</label>
              <Field
                name='no_of_slices'
                parse={(val) => parseInt(val, 10)}
                component={renderNumberInput}
                validate={[required, positiveNumber]}
              />
            </div>

            <div className="inputField">
              <label>Diamater</label>
              <Field
                name='diameter'
                parse={(val) => parseFloat(val)}
                component={renderFloatInput}
                validate={[required, positiveNumber]}
              />
            </div>
          </>
          }

          {dishTypeValue === 'soup' &&
            <div className="inputField">
              <label>Spiciness scale</label>
              <Field
                name="spiciness_scale"
                parse={(val) => parseInt(val, 10)}
                component={renderSelect}
                validate={required}>
                {_.range(1, 10 + 1).map(value =>
                  <option key={value} value={value}>{value}</option>
                )}
              </Field>
            </div>
          }

          {dishTypeValue === 'sandwich' &&
            <div className="inputField">
              <label>Slices of bread</label>
              <Field
                name='slices_of_bread'
                parse={(val) => parseInt(val, 10)}
                component={renderNumberInput}
                validate={[required, positiveNumber]}
              />
            </div>
          }

          {error && <strong>{error}</strong>}

          <div className="inputField">
            <Button
              variant="dark"
              disabled={!valid}
              type="submit"
            >Submit</Button>
            <Button
              variant="danger"
              disabled={pristine || submitting}
              onClick={reset}
              style={{marginLeft: 10}}
            >Clear Values</Button>
          </div>
        </form>
      </Col>
    </Container>
  );
}

DishForm = reduxForm({
  form: 'dishForm',
  onSubmit,
}) (DishForm);

const selector = formValueSelector('dishForm')

DishForm = connect(
  state => {
    const dishTypeValue = selector(state, 'type')
    return {
      dishTypeValue,
    }
  }
)(DishForm);

export default DishForm;