# The Quiz

A simple React based quiz by Ricky Sullivan.

I'm calling this the N.E.R.D stack, Node + Express + React + DB (NeDB).

To run:

```
npm install
npm start
```

Browse to [http://localhost:3000](http://localhost:3000)

## General

* I'm using [Concurrently](https://github.com/kimmobrunfeldt/concurrently) to run both the server and client at the same time.
* I'm running Node 9.4.0.
* All code is linted using ESLint (babel-eslint) and [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).
* I'm trialing [Prettier](https://prettier.io) (Prettier for VS Code) and have included this is my project.
* I'm transpiling from ES2017 using Babel in order to use Async and Await, there's also the added benefit of the trailing comma,
* There was no need to use external CSS files. I added it just to show my preference. I don't particually like writing CSS as Javascript objects.

## Backend

* The backend and API are built with Node, Express and [NeDB](https://github.com/louischatriot/nedb).
* Data for the quiz is stored in a MongoDB-like, in-memory database using a [promisified](https://github.com/jrop/nedb-promise) NeDB.
* I've added [Helmet](https://github.com/helmetjs/helmet) for good security measures.

## Frontend

* For brevity and ease of inspecting the code, the React app is being served by React Create App's built-in server. I could have ejected the code and built it into a dist folder to be served from Express, but I wanted to show my working code. Also, Webpack takes a month to configure :)
* For simplicity, I've stuck with React's built-in state management.
* For the UI, I've added [Semantic UI React](https://react.semantic-ui.com), I find it great for prototyping.
