import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
       ZOOM QUIZ APP 
      <header className="App-header">
        Load app <a href={process.env.REACT_APP_BACK_URI + '/install'}> here!</a>
      </header>
    </div>
  );
}

export default App;
