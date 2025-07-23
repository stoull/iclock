import { useState, useEffect } from "react";

const Home = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  }

  console.log('Home component rendered');

  return (
    <div className="Home">
        
        <h1>Welcome to the Home Page</h1>
        <p> Count: {count}</p>
        <button onClick={incrementCount}>Increment</button>
    </div>
  );
};

export default Home;
