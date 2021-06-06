import React from 'react';
import { Form } from 'react-bootstrap'

const Input = ({errorMessage, ...props}) => (
  <>
    {/*<input {...props} />*/}
    <Form.Group>
      <Form.Control {...props} />
      {errorMessage &&
        <Form.Text className="text-muted">
          {errorMessage}
        </Form.Text>
      }
    </Form.Group>
    {/*{errorMessage && <span className='errorMessage'>{errorMessage}</span>}*/}
  </>
);

export default Input;