import React, {useEffect, useReducer} from 'react';
import classnames from 'classnames';

import Controls from '../Controls/Controls';
import Models from '../Models/Models';
import Result from '../Result/Result';
import appReducer from '../../appReducer';
import json from '../../json/andrew_state.json';
// import json from '../../json/steven_state.json';
// import json from '../../json/steven_state_results.json';
import {getKeys, isDevEnv} from '../../utils';

import './App.css';

const loadState = json;


export const AppContext = React.createContext({
    modelsJSON: [],
    results: {},
    canonical: null,
    mode: 'files',
});

function App() {
    const [state, setState] = useReducer(appReducer, {
        modelsJSON: [],
        results: {},
        canonicalId: null,
        viewResultId: null,
        mode: 'files',
    });
    const {mode, results, modelsJSON, showInternalTools} = state;

    // load state if indicated
    useEffect(() => {
        if (isDevEnv() && loadState) {
            const resultsKeys = getKeys(loadState.results);
            setState({
                ...loadState,
                ...(resultsKeys.length > 0 && {viewResultId: resultsKeys[0], mode: 'result'})
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
                </main>
            </div>
        </AppContext.Provider>
    );
}

export default App;
