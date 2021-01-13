import React, {useReducer} from 'react';
import classnames from 'classnames';

import Compare from '../Controls/Compare';
import FileControls from '../Controls/FileControls';
import Models from '../Models/Models';
import Results from '../Results/Results';

import './App.css';

export const AppContext = React.createContext({
    modelsJSON: [],
    results: {},
    canonical: null,
});

const makeId = () => `id-${Math.random().toString(16).slice(2)}`;

function App() {
    const [state, setState] = useReducer((oldState, newState) => {
        let updatedState = {...oldState, ...newState};
        const {action} = newState;

        if (action && action.type) {
            if (action.type === 'addJSON') {
                updatedState = {
                    ...updatedState,
                    modelsJSON: [
                        ...updatedState.modelsJSON,
                        {
                            ...action.json,
                            ...(!action.json.id && {id: makeId()})
                        }
                    ]
                }
            } else if (action.type === 'removeModel') {
                updatedState = {
                    ...updatedState,
                    modelsJSON: updatedState.modelsJSON.filter((model) => model.id !== action.id),
                    ...(updatedState.canonical === action.id && {canonicalId: null})
                };
            } 
            else if (action.type === 'addResults') {
                updatedState = {
                    ...updatedState,
                    results: action.results,
                };
            }
        }

        return updatedState;
    }, {
        modelsJSON: [],
        results: {},
        canonicalId: null,
        mode: 'files',
    });

    const {mode} = state;

    return (
        <AppContext.Provider value={{state, setState, dispatch: setState}}>
            <div className="MMCompare">
                <header className="header">
                    <div className="header__primary">
                        <div className={"logo"}>
                            <span>{'MentalModeler'}</span>
                            <span>{'COMPARE'}</span>
                        </div>
                        <div className="header__mode-select">
                            <div
                                className={classnames('header__mode-select-mode', {
                                    'header__mode-select-mode--selected': mode === 'files'
                                })}
                                onClick={() => setState({mode: 'files'})}
                            >
                                <span>{'Files'}</span>
                            </div>
                            <div
                                className={classnames('header__mode-select-mode', {
                                    'header__mode-select-mode--selected': mode === 'compare'
                                })}
                                onClick={() => setState({mode: 'compare'})}
                            >
                                <span>{'Compare'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header__secondary">
                        {mode === 'files' && (<FileControls />)}
                        {mode === 'compare' && (<Compare /> )}
                    </div>
                </header>
                <main className="main">
                    {mode === 'files' && (<Models />)}
                    {mode === 'compare' && (<Results />)}
                </main>
            </div>
        </AppContext.Provider>
    );
}

export default App;
