import './App.css';
import React, {useState} from 'react';
import Controls from '../Controls/Controls';
import Models from '../Models/Models';
import Results from '../Results/Results';

function App() {
    const [modelsJSON, setModelsJSON] = useState([]);
    const [results, setResults] = useState({});

    return (
      <div className="MMCompare">
        <Controls modelsJSON={modelsJSON} setModelsJSON={setModelsJSON} />
        <Models modelsJSON={modelsJSON} setResults={setResults} />
        <Results results={results} />
      </div>
    );
}

export default App;
