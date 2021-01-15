import React, {useReducer} from 'react';
import classnames from 'classnames';

import Compare from '../Controls/Compare';
import FileControls from '../Controls/FileControls';
import Models from '../Models/Models';
import Result from '../Result/Result';
import appReducer from '../../appReducer';

import './App.css';

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
    const {mode} = state;

    return (
        <AppContext.Provider value={{state, setState, dispatch: setState}}>
            <div className="MMCompare">
                <header className="header">
                    <div className="header__primary">
                        <div className={"logo"}>
                            <span>{'MentalModeler'}</span><span>{'COMPARE'}</span>
                        </div>
                        <div className="header__mode-select">
                            <div
                                className={classnames('header__mode-select-mode', {'header__mode-select-mode--selected': mode === 'files'})}
                                onClick={() => setState({mode: 'files'})}
                            >
                                <span>{'Files'}</span>
                            </div>
                            <div
                                className={classnames('header__mode-select-mode', {'header__mode-select-mode--selected': mode === 'compare'})}
                                onClick={() => setState({mode: 'compare'})}
                            >
                                <span>{'Compare'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header__secondary">
                        {mode === 'files' && (<FileControls />)}
                        {mode === 'compare' && (<Compare /> )}
                        <input
                            style={{marginLeft: '16px'}}
                            type="button"
                            onClick={() => setState({action: {type: 'compare'}})}
                            value="Compare"
                            className="btn btn-ghost"
                            disabled={!state.canonicalId}
                        />
                        <input
                            style={{marginLeft: '16px'}}
                            type="button"
                            onClick={() => setState({mode: 'result'})}
                            value="View result"
                            className="btn btn-ghost"
                        />
                    </div>
                </header>
                <main className="main">
                    {mode === 'files' && (<Models />)}
                    {mode === 'compare' && (null)}
                    {mode === 'result' && (<Result />)}
                </main>
            </div>
        </AppContext.Provider>
    );
}

export default App;
