import { useState, useEffect } from "react";

import './Home.css';

import DigitalClock from '../components/DigitalClock';

const Home = () => {
  const [fontSize, setFontSize] = useState('16rem');

  function handleDecrementFontSize() {
    console.log('decrement font size');
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat > 2.0 ? preFloat : 2.0;
      console.log('decrement to ', `${preFloat-1}rem}`);
      return `${preFloat-1}rem`
    })
  }
  function handleIncrementFontSize() {
    console.log('increment font size');
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat < 50.0 ? preFloat : 50.0;
      console.log('increment to ', `${preFloat+1}rem}`);
      return `${preFloat+1}rem`
    })
  }
  return (
    <div className="home">
      <div className="navbar">
        <div className="navbar-item" onClick={handleIncrementFontSize}> +++ </div>
        <div className="navbar-item" onClick={handleDecrementFontSize}> --- </div>
        <div className="navbar-item"> item3 </div>
        <div className="navbar-item"> item4 </div>
      </div>
      <div className="content">
        <DigitalClock fontSize={fontSize} />
      </div>
    </div>
  );
};

export default Home;
