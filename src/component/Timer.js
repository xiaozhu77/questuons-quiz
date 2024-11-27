import { useEffect } from "react";

function Timer({ dispatch, timeLeft }) {
  const mins = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "trik" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins}:{seconds}
    </div>
  );
}

export default Timer;
