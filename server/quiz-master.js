/* eslint max-len: ["error", { "code": 200 }],
no-underscore-dangle: ["error", { "allow": ["_id"] }]
*/

// Datastore to maintain our quiz data
const Datastore = require('nedb');
const nedbPromise = require('nedb-promise');

class QuizMaster {
  constructor() {
    // Setup our Datastores
    this.db = {
      questions: nedbPromise.fromInstance(new Datastore()),
      quiz: nedbPromise.fromInstance(new Datastore()),
    };
  }

  // Start a game, if existing game, delete!
  async startGame(n) {
    // Build questions
    await this.buildQuestions(n);

    // Always remove existing games
    await this.db.quiz.remove({}, { multi: true });

    // Build object to return, which consists of quiz questions and a new game object
    const result = {};
    const answersArr = Array.from(new Array(n), () => ({
      input: null,
      correct: null,
    }));

    // Add the questions to the object
    result.questions = await this.getQuestions();

    // Add a new quiz to the Datastore and set the result as an object for return
    result.game = await this.db.quiz.insert({
      answers: answersArr,
      score: 0,
    });

    return result;
  }

  // Get the questions, excluding the answers
  async getQuestions() {
    const questions = await this.db.questions.find({}, { _id: 1, q: 1 });

    return questions;
  }

  // Return a solution(answer) based on ID
  async checkAnswer(solutionId) {
    const answer = await this.db.questions.findOne({ _id: solutionId }, { _id: 1, a: 1 });

    return answer;
  }

  // Build questions with random numbers
  async buildQuestions(n) {
    // Build an array with specified length, generate random numbers. Used for destructuring.
    const randArray = (x, max = 9, min = 0) => Array.from(new Array(x), () => Math.floor(Math.random() * (max - min + 1)) + min); // eslint-disable-line no-mixed-operators

    // Build an array of objects to use for quesitons.
    const questions = Array.from(new Array(n), (x, i) => {
      const [a, b] = randArray(2);
      return { _id: i, q: `${a} + ${b}`, a: (a + b).toString() };
    });

    // Remove any existing questions
    await this.db.questions.remove({}, { multi: true });

    // Insert questions into the Datastore
    await this.db.questions.insert(questions);

    return true;
  }
}

module.exports = QuizMaster;
