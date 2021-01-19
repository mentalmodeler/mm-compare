import {initScenario} from './utils';
import {makeId, compareModels} from 'mm-modules';

const appReducer = (oldState, newState) => {
    const {action} = newState;
    let updatedState = {...oldState, ...newState};
    delete updatedState.action;
    
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
        } else if (action.type === 'compare') {
            const results = compareModels({
                modelsJSON: updatedState.modelsJSON,
                canonicalId: updatedState.canonicalId
            });
            updatedState = {
                ...updatedState,
                results,
            };    
        } else if (action.type === 'updateScenario') {
            const {id, concept: updatedConcept} = action;
            updatedState = {
                ...updatedState,
                scenario: {
                    ...updatedState.scenario.map,
                    concepts: updatedState.scenario.concepts.map((concept) => (
                        id === concept.id ? updatedConcept : concept
                    )),
                }
            };
        }
    }
    // if we are setting the canonicalId, set up the scenario data
    if (newState.hasOwnProperty('canonicalId') && updatedState.canonicalId !== oldState.canonicalId) {
        const canonicalModel = updatedState.modelsJSON.find((model) => model.id = updatedState.canonicalId);
        updatedState = {
            ...updatedState,
            scenario: initScenario(canonicalModel || {concepts: []}),
        };
    }

    return updatedState;
};

export default appReducer
