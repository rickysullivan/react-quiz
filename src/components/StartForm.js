import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button, Message, Container, Transition } from 'semantic-ui-react';

class StartForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: null,
      noOfQuestions: null,
    };
  }

  startGame = n => {
    this.props.handleStartGame(n);
  };

  handleChange = e => {
    let isValid = null;
    if (e.target.value !== '') {
      isValid = +e.target.value > 0;
    }
    this.setState({ noOfQuestions: +e.target.value, valid: isValid });
  };

  handleSubmit = () => {
    this.startGame(this.state.noOfQuestions);
  };

  render() {
    return (
      <Container>
        <p>This quiz game generates a number of simple math questions.</p>
        <p>Enter the number of questions you&apos;d like and click Start</p>
        <Form error={!(this.state.valid === null || this.state.valid === true)}>
          <Form.Field width={2} error={!(this.state.valid === null || this.state.valid === true)}>
            <Input fluid input={<input type="text" maxLength="2" />} autoFocus placeholder="e.g. 5" onChange={this.handleChange} />
          </Form.Field>
          <Transition duration="500" visible={!(this.state.valid === null || this.state.valid === true)}>
            <Message size="small" error content="You must enter a number greater than 0" />
          </Transition>
          <Button type="submit" disabled={!this.state.valid} onClick={this.handleSubmit}>
            Start
          </Button>
        </Form>
      </Container>
    );
  }
}

StartForm.propTypes = {
  handleStartGame: PropTypes.func.isRequired,
};

export default StartForm;
