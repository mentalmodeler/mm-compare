export const isDevEnv = () => process.env.NODE_ENV === 'development';
export const getKeys = (o) => typeof o === 'object' ? Object.keys(o) : [];
export const getLength = (o) => getKeys(o).length;
export const updateClipboard = (newClip) => {navigator.clipboard.writeText(newClip).then(function() {/* success */}, function() {/* error */});}
export const getMargin = (top, bottom) => ({
    ...(typeof top === 'number' && {marginTop: `${top}px`}),
    ...(typeof bottom === 'number' && {marginBottom: `${bottom}px`})
});
export const getDataId = (e) => e.target.dataset.id;
export const getConcept = (id, concepts) => {
    const concept = concepts.find((concept) => id === concept.id) || {};
    return {...concept};
};
export const initScenario = ({concepts = [], scenarios = []}) => {
    return {
        concepts: concepts.map(({name, id, preferredState}) => (
            {
                name,
                id,
                selected: true,
                influence: 0,
                preferredState,
                points: 0,
            }
        )),
    };
}
