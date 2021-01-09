import './App.css';
import React, {useReducer} from 'react';
import Controls from '../Controls/Controls';
import Models from '../Models/Models';
import Results from '../Results/Results';

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
            // if needed, we can use this
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
                    modelsJSON: updatedState.modelsJSON.filter((model) => model.id !== action.id)
                };
            } 
        }
        return updatedState;
    }, {
        modelsJSON: [],
        results: {},
        canonical: null,
        mode: 'load',
    });
    console.log('state:', state);
    const {modelsJSON, mode, results} = state;
    return (
        <AppContext.Provider value={{state, setState, dispatch: setState}}>
            <div className="MMCompare">
                {mode === 'load' && (
                    <>
                        <Controls />
                        <Models />
                    </>
                )}
                {mode === 'result' && (
                    <Results results={results} />
                )}
            </div>
        </AppContext.Provider>
    );
}

export default App;
