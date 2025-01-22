import React, { useState, useRef } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(1);
  const persistentValue = useRef(0);

  const incrementCounter = () => {
    setCount(count + 1);
    persistentValue.current += 1;
  };
  renderCount.current += 1;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>State Count: {count}</h2>
      <h2>Persistent Value (useRef): {persistentValue.current}</h2>
      <h2>Render Count: {renderCount.current}</h2>
      <button onClick={incrementCounter} style={{ padding: "10px 20px" }}>
        Increment
      </button>
    </div>
  );
}
 
export default Counter;