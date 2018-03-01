/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Input, Label, Transition, Button } from 'semantic-ui-react';

import './Quiz.css';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: this.props.game,
      questions: this.props.questions,
    };
    this.textInput = null;
  }

  checkScore = () => {
    const arr = Object.keys(this.state.game.answers)
      .map(item => this.state.game.answers[item].correct === true)
      .filter(Boolean);

    return arr.length;
  };

  checkAnswer = id => {
    fetch(`http://localhost:4000/api/quiz/solution/${id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          throw new Error(response.error);
        } else {
          return response;
        }
      })
      .then(response => {
        this.setState(prevState => ({
          ...prevState,
          game: {
            ...prevState.game,
            score: (() => {
              let score = this.checkScore();
              if (response.a === prevState.game.answers[id].input) {
                score += 1;
              }
              return score;
            })(),
            answers: {
              ...prevState.game.answers,
              [id]: {
                ...prevState.game.answers[id],
                correct: response.a === prevState.game.answers[id].input,
                actual: response.a,
              },
            },
          },
        }));
      })
      .then(this.checkScore())
      .catch(error => {
        console.log(error);
      });
  };

  handleAnswerChange = (e, data) => {
    this.setState(prevState => ({
      ...prevState,
      game: {
        ...prevState.game,
        answers: {
          ...prevState.game.answers,
          [data['data-questionid']]: {
            ...[data['data-questionid']],
            input: data.value,
            correct: null,
          },
        },
      },
    }));
  };

  handleAnswerInputKeyDown = id => {
    this.handleCheckAnswer(id);
  };

  handleCheckAnswer = id => {
    this.checkAnswer(id);
  };

  handleStartNew = () => {
    this.props.startNew();
  };

  render() {
    return (
      <Container className="quiz">
        <p>Answer each question and check your answers as you go.</p>
        <Form size="large">
          {this.state.questions.map((question, i) => (
            <Form.Group inline key={question._id}>
              <Form.Field className="question" inline>
                <label htmlFor={`question-${question._id}`}>
                  {question.q} = &nbsp;
                  <Input
                    input={
                      <input
                        type="text"
                        onKeyDown={e => {
                          if (e.repeat === false) {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                              this.handleAnswerInputKeyDown(question._id);
                            }
                          }
                        }}
                        tabIndex={this.state.game.answers[question._id].correct !== null ? '-1' : '0'}
                        readOnly={this.state.game.answers[question._id].correct !== null}
                        autoComplete="off"
                      />
                    }
                    id={`question-${question._id}`}
                    name={`question-${question._id}`}
                    data-questionid={question._id}
                    className="answer-input"
                    autoFocus={i === 0}
                    onChange={this.handleAnswerChange}
                    action={{
                      type: 'button',
                      color: (state => {
                        let color;
                        if (state) {
                          color = 'green';
                        } else if (state === false) {
                          color = 'red';
                        } else {
                          color = null;
                        }
                        return color;
                      })(this.state.game.answers[question._id].correct),
                      content: (state => {
                        let word;
                        if (state === null) {
                          word = 'Check';
                        } else {
                          word = null;
                        }
                        return word;
                      })(this.state.game.answers[question._id].correct),
                      icon: (state => {
                        let icon;
                        if (state) {
                          icon = 'checkmark';
                        } else if (state === false) {
                          icon = 'remove';
                        } else {
                          icon = null;
                        }
                        return icon;
                      })(this.state.game.answers[question._id].correct),
                      tabIndex: this.state.game.answers[question._id].correct !== null ? '-1' : '0',
                      onClick: () => {
                        if (this.state.game.answers[question._id].correct === null) {
                          this.handleCheckAnswer(question._id);
                        }
                      },
                    }}
                  />
                  <Transition duration="500" visible={!(this.state.game.answers[question._id].correct === null || this.state.game.answers[question._id].correct === true)}>
                    <Label pointing="left">
                      The correct answer is <strong>{this.state.game.answers[question._id].actual}</strong>
                    </Label>
                  </Transition>
                </label>
              </Form.Field>
            </Form.Group>
          ))}
        </Form>
        <p>Score: {this.state.game.score}</p>
        <p>Don&apos;t like the questions or want to try again?</p>
        <Button compact type="submit" onClick={this.handleStartNew}>
          Start a new game
        </Button>
      </Container>
    );
  }
}

Quiz.propTypes = {
  questions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  game: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  startNew: PropTypes.func.isRequired,
};

export default Quiz;
