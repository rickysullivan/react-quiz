// npm
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

// App modules
const QuizMaster = require('./quiz-master');

// Our express app :)
const app = express();

// Quizmaster instance
const qm = new QuizMaster();

// Prevent vulnerabilities
app.use(helmet({ noCache: true }));

// Enable req body parser
app.use(bodyParser.json());

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST with body to start a new quiz
app.post('/api/quiz', (req, res) => {
  req.accepts('application/json');
  const qNumber = req.body.questions;

  if (typeof qNumber !== 'number' || qNumber < 1) {
    res.status(400).json({ error: 'questions key must be a number and greater than 1' });
  } else {
    qm.startGame(qNumber).then(data => {
      res.json(data);
    });
  }
});

// GET solution by ID
app.get('/api/quiz/solution/:id', (req, res) => {
  const solutionNumber = req.params.id;
  if (!/^\d+$/.test(solutionNumber) || +solutionNumber < 0) {
    res.status(400).json({ error: 'solution id param must be a number' });
  } else {
    qm.checkAnswer(+solutionNumber).then(data => {
      if (data !== null) {
        res.json(data);
      } else {
        res.status(400).json({ error: "solution id doesn't exist" });
      }
    });
  }
});

// Start server, listening on port 4000
app.listen(4000);
