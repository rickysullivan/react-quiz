/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
import React, { Component } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import StartForm from './components/StartForm';
import Quiz from './components/Quiz';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: {},
      active: null,
    };
  }

  resetGame = () => {
    this.setState({ game: null });
  };

  startGame = n => {
    this.setState({ game: null });
    fetch('http://localhost:4000/api/quiz', {
      body: JSON.stringify({ questions: n }),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
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
        this.setState({ active: true, game: response.game, questions: response.questions });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const stage =
      this.state.game && this.state.game._id ? (
        <Quiz active={this.state.active} game={this.state.game} questions={this.state.questions} startNew={this.resetGame} />
      ) : (
        <StartForm handleStartGame={this.startGame} />
      );

    return (
      <div className="app">
        <Container text>
          <Grid verticalAlign="middle" columns={1} centered>
            <Grid.Row>
              <Grid.Column>
                <Container>
                  <Header as="h1">The Quiz</Header>
                </Container>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>{stage}</Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
