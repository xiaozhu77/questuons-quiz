// import DateCounter from "./DateCounter";
import { useEffect, useReducer } from "react";
import Header from "./component/Header";
import Main from "./component/Main";
import Error from "./component/Error";
import Loader from "./component/Loader";
import StartScreen from "./component/StartScreen";
import Questions from "./component/Questions";
import NextQuestion from "./component/NextQuestion";
import Progress from "./component/Progress";
import Finished from "./component/Finished";
import Reset from "./component/Reset";

const initialstate = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  Highlight: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        Highlight:
          state.points > state.Highlight ? state.points : state.Highlight,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "reset":
      return { ...state, status: "ready", answer: null, index: 0, points: 0 };
    default:
      throw new Error("Unkonwn action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, Highlight }, dispatch] =
    useReducer(reducer, initialstate);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  function handdispatchstart() {
    dispatch({ type: "start" });
  }

  useEffect(function () {
    async function fakeFetch() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
        if (!res.ok) throw new Error();
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    fakeFetch();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen nums={numQuestions} dispatch={handdispatchstart} />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextQuestion
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </>
        )}
        {status === "finished" && (
          <>
            <Finished
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              Highlight={Highlight}
            />
            <Reset dispatch={dispatch} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
