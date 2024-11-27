function StartScreen({ nums, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{nums} questions to test your React mastery</h3>
      <button className="btn btn-ui" onClick={dispatch}>
        Let's start
      </button>
    </div>
  );
}
export default StartScreen;
