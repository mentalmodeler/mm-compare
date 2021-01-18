export const isDevEnv = () => process.env.NODE_ENV === 'development';
export const getKeys = (o) => typeof o === 'object' && Object.keys(o) || [];
export const getLength = (o) => getKeys(o).length;
export const updateClipboard = (newClip) => {navigator.clipboard.writeText(newClip).then(function() {/* success */}, function() {/* error */});}
export const getMargin = (top, bottom) => ({
    ...(typeof top === 'number' && {marginTop: `${top}px`}),
    ...(typeof bottom === 'number' && {marginBottom: `${bottom}px`})
});
