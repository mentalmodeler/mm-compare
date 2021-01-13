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

        const getRelationships = ({name: fromName, id: fromId, relationships}) => (
            relationships && relationships.map(({name, id, influence}) => ({
                fromNode: {
                    id: fromId,
                    name: fromName
                },

                toNode: {
                    id: id,
                    name: name
                },

                relationship: {
                    id: id,
                    name: name,
                    influence: influence,
                    fromNodeId: fromId
                }
            }))
        );
        
        const differenceNodes = (a, b) => {
            const names = b.map(({name}) => normalize(name));

            return a.filter(({name}) => !names.includes(normalize(name)));
        };

        const intersectionNodes = (a, b) => {
            const names = b.map(({name}) => normalize(name));
            
            return a.filter(({name}) => names.includes(normalize(name)));
        };

        const differenceRelationships = (a, b) => {
            const names = b.map(({fromNode, toNode}) => normalize(fromNode.name + toNode.name));
            
            return a.filter(({fromNode, toNode}) => !names.includes(normalize(fromNode.name + toNode.name)));
        };

        const intersectionRelationships = (a, b) => {
            const names = b.map(({fromNode, toNode}) => normalize(fromNode.name + toNode.name));
            
            return a.filter(({fromNode, toNode}) => names.includes(normalize(fromNode.name + toNode.name)));
        };

        const correctlySigned = (relationships, cRelationships) => {
            const isCorrect = (x, y) => (x > 0 && y > 0) || (x < 0 && y < 0) || (x === 0 && y === 0);

            return relationships.filter(({fromNode, relationship}) => {
                const name = normalize(fromNode.name + relationship.name);
                return cRelationships.find(({fromNode: cFromNode, relationship: cRelationship}) => {
                    return name === normalize(cFromNode.name + relationship.name) && isCorrect(relationship.influence, cRelationship.influence);
                });
            });
        };

        const canonicalNodes = canonical.concepts.map(getNode);
        const modelNodes = model.concepts.map(getNode);
        const canonicalRelationships = canonical.concepts.flatMap(getRelationships);
        const modelRelationships = model.concepts.flatMap(getRelationships);
        const extraNodes = differenceNodes(modelNodes, canonicalNodes);
        const missingNodes = differenceNodes(canonicalNodes, modelNodes);
        const presentNodes = intersectionNodes(modelNodes, canonicalNodes);
        const extraRelationships = differenceRelationships(modelRelationships, canonicalRelationships);
        const missingRelationships = differenceRelationships(canonicalRelationships, modelRelationships);
        const correctlyLinkedRelationships = intersectionRelationships(modelRelationships, canonicalRelationships);
        const correctlySignedRelationships = correctlySigned(correctlyLinkedRelationships, canonicalRelationships);
        const incorrectlySignedRelationships = differenceRelationships(correctlyLinkedRelationships, correctlySignedRelationships);
        const score = correctlySignedRelationships.length - (extraRelationships.length + missingRelationships.length);

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
