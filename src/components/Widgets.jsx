import './Widgets.css';
import PhotoWidget from "./Widgets/PhotoWidget";
import QuoteWidget from "./Widgets/QuoteWidget";

const Widgets = ( {onToggleUpdate, updateTrigger} ) => {
  return (
    <div className="widgets">
      <PhotoWidget onToggleUpdate={onToggleUpdate} updateTrigger={updateTrigger}/>
      <QuoteWidget onToggleUpdate={onToggleUpdate} updateTrigger={updateTrigger}/>
    </div>
  );
};

export default Widgets;