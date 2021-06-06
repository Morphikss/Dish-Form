import React from 'react';
import { Form } from 'react-bootstrap'

const Select = ({errorMessage, children, ...props}) => (
  <>
    <Form.Control as='select' {...props} >
      {children}
    </Form.Control>
    {errorMessage &&
      <Form.Text className="text-muted">
        {errorMessage}
      </Form.Text>
    }
  </>
  // <div className='input-text'>
  //   <select {...props} >
  //     {children}
  //   </select>
  //   {errorMessage && <span className='errorMessage'>{errorMessage}</span>}
  // </div>
);

export default Select;