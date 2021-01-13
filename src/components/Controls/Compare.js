import {useContext} from 'react';
import {AppContext} from '../App/App';

function Compare() {
    const {state, dispatch} = useContext(AppContext);
    const {modelsJSON, canonicalId} = state;

    const runComparison = () => {
        const canonical = modelsJSON.find(model => model.id === canonicalId);
        const modelsToCompare = modelsJSON.filter(model => model.id !== canonicalId);
        let results = [];

        modelsToCompare.forEach(model => results.push(compare(model, canonical)));

        dispatch({
            action: {
                type: 'addResults',
                results
            }
        });
    };

    const compare = (model, canonical) => {
        const {author, modelName} = model.info;

        const normalize = name => name.toLowerCase().trim(); 
        const getNode = ({name, id}) => ({name: name, id: id}); 
        
        const difference = (a, b) => {
            const set = new Set(b.map(({name}) => normalize(name)));

            return a.filter(({name}) => !set.has(normalize(name)));
        };

        const intersection = (a, b) => {
            const set = new Set(b.map(({name}) => normalize(name)));
            
            return a.filter(({name}) => set.has(normalize(name)));
        };

        const canonicalNodes = canonical.concepts.map(getNode);
        const modelNodes = model.concepts.map(getNode);

        const extraNodes = difference(modelNodes, canonicalNodes);
        const missingNodes = difference(canonicalNodes, modelNodes);
        const presentNodes = intersection(modelNodes, canonicalNodes);

        const canonicalRelationships = [];
        const modelRelationships =  [];
        const extraRelationships = difference(modelRelationships, canonicalRelationships);
        const missingRelationships = difference(canonicalRelationships, modelRelationships);
        const correctlySignedRelationships = [];
        const incorrectlySignedRelationships = [];

        let score = 14;

        return {
            author: author || '[Author]',
            name: modelName || '[Name]',
            score: score,
            nodes: {
                extra: extraNodes,
                missing: missingNodes,
                present: presentNodes,
            },
            relationships: {
                extra: extraRelationships,
                missing: missingRelationships,
                correctlySigned: correctlySignedRelationships,
                incorrectlySigned: incorrectlySignedRelationships,
            },
        };
    };

    return(
        <input
            type="button"
            className="btn btn-ghost"
            onClick={runComparison}
            value="Run comparison"
        />
    );
}

export default Compare;
