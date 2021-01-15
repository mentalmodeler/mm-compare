import {makeId, compare} from './utils';

const appReducer = (oldState, newState) => {
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
        } else if (action.type === 'compare') {
            const results = compare({
                modelsJSON: updatedState.modelsJSON,
                canonicalId: updatedState.canonicalId
            });
            updatedState = {
                ...updatedState,
                results,
            };    
        }
    }

    return updatedState;
};

export default appReducer