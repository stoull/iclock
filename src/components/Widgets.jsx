import './Widgets.css';
import PhotoWidget from "./Widgets/PhotoWidget";
import QuoteWidget from "./Widgets/QuoteWidget";

const Widgets = () => {
  return (
    <div className="widgets">
      <PhotoWidget />
      <QuoteWidget />
    </div>
  );
};

export default Widgets;