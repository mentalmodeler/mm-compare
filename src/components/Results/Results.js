import {useContext} from 'react';
import {AppContext} from '../App/App';

import './Results.css';

function Results() {
    const {state} = useContext(AppContext);
    const {results} = state;

    // console.log("render these results:\n", results);

    return (
        <div className="results">
            <h1>Results</h1>
        </div>
    );
}

export default Results;
