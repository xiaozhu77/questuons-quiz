function Reset({ dispatch }) {
  return (
    <button className="btn btn-ui" onClick={() => dispatch({ type: "reset" })}>
      reset
    </button>
  );
}

export default Reset;
