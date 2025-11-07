import './Widgets.css';
import PhotoWidget from "./Widgets/PhotoWidget";
import QuoteWidget from "./Widgets/QuoteWidget";

const Widgets = ( {reloadTrigger, onTriggerReload} ) => {
  return (
    <div className="widgets">
      <PhotoWidget reloadTrigger={reloadTrigger} onTriggerReload={onTriggerReload}/>
      <QuoteWidget reloadTrigger={reloadTrigger} onTriggerReload={onTriggerReload}/>
    </div>
  );
};

export default Widgets;