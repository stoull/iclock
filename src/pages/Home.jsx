import { useState, useEffect } from "react";

import { BasicInterpolationExample } from '../examples/InterpolationExamples';

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

        {/* 插值示例 */}
        <h2>插值示例</h2>
        <BasicInterpolationExample />
    </div>
  );
};

export default Home;
