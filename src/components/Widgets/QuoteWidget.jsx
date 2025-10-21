import './QuoteWidget.css';

import { useEffect, useState } from "react";

import Quotes from '../../assets/resource/Quotes-Favorites.json';

function QuoteWidget() {
  const [quote, setQuote] = useState({ text: '', authors: '' });

  useEffect(() => {
    getRandomQuote();
  }, []);

  function getRandomQuote() {
    const idx = Math.floor(Math.random() * Quotes.length);
    const q = Quotes[idx];
    setQuote(q);
  }

  return (
    <div className="widgets-quote">
      <h2 className='quote-title'> </h2>
      <p className='quote-content'>{quote.text}</p>
      <span className='quote-authors'>- {quote.authors}</span>
      <div className='notes'>
        <span className='spacer'></span>
        <p className='notes-text'>write some notes here</p>
      </div>
    </div>
  );
}

export default QuoteWidget;