import React, {useEffect, useReducer} from 'react';

import Controls from '../Controls/Controls';
import Models from '../Models/Models';
import Result from '../Result/Result';
import ResultsAll from '../ResultsAll/ResultsAll';
import Scenario from '../Scenario/Scenario';
import appReducer from '../../appReducer';
// import json from '../../json/andrew_state.json';
// import json from '../../json/steven_state.json';
import json from '../../json/steven_state_results.json';
// import json from '../../json/fish_wetland_state.json';
import {isDevEnv} from '../../utils';
// import {getKeys} from '../../utils';
 
import './App.css';

const loadState = json;


export const AppContext = React.createContext({
    modelsJSON: [],
    results: {},
    canonical: null,
    mode: 'scenario',
});

function App() {
    const [state, setState] = useReducer(appReducer, {
        modelsJSON: [],
        results: {},
        canonicalId: null,
        viewResultId: null,
        mode: 'files',
    });
    const {mode} = state;

    // load state if indicated
    useEffect(() => {
        if (isDevEnv() && loadState) {
            // const resultsKeys = getKeys(loadState.results);
            setState({
                ...loadState,
                // this would trigger it to start with the results all view shown
                // ...(resultsKeys.length > 0 && {mode: 'results'}),
                // this would trigger it to start with the individual results view shown
                // ...(resultsKeys.length > 0 && {viewResultId: resultsKeys[0], mode: 'result'}),
                // this would trigger it to start with the scenario config view shown
                // ...(resultsKeys.length < 1 && {mode: 'scenario'})
            });
        }
    }, []);

    return (
        <AppContext.Provider value={{state, setState, dispatch: setState}}>
            <div className="MMCompare">
                <header className="header">
                    <div className="header__primary">
                        <div className={"logo"}>
                            <div className="logo-inner">
                                <span>{'MentalModeler'}</span><span>{'COMPARE'}</span>
                            </div>
                        </div>
                        <Controls />
                    </div>
                </header>
                <main className="main">
                    <Models />
                    {mode === 'result' && (<Result />)}
                    {mode === 'scenario' && (<Scenario />)}
                    {mode === 'results' && (<ResultsAll />)}
                </main>
            </div>
        </AppContext.Provider>
    );
}

export default App;
