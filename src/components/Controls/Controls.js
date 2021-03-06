import {useContext, useRef} from 'react';
import {loadAndParse} from 'mm-modules';
import {isDevEnv, updateClipboard} from '../../utils';
import {AppContext} from '../App/App';

import './Controls.css';

function Controls() {
    const inputFile = useRef(null);
    const {state, setState, dispatch} = useContext(AppContext);
    const handleLoadLocal = () => inputFile.current.click();

    const loadAndParseLocalModels = evt => {
        const fileList = evt.target.files;
        return fileList && fileList.length > 0 && Array.from(fileList).forEach(async f => {
            const json = {
                filename: f.name.split('.')[0],
                ...await loadAndParse(f)
            };
            
            dispatch({action: {type: 'addJSON', json}});
        });
    };

    return (
        <div className="controls">
            {isDevEnv() && (
                <input
                    style={{alignSelf: 'center'}}
                    type="button"
                    onClick={() => updateClipboard(JSON.stringify(state, null, 4))}
                    value="Copy state JSON"
                    className="btn btn-ghost"
                />
            )}
            <div className="controls__load-local">
                <input 
                    type="button"
                    onClick={handleLoadLocal}
                    value="Load"
                    className="btn btn-ghost"
                />
                <input 
                    type="file" 
                    multiple={true}
                    ref={inputFile}
                    style={{display:"none"}}
                    onChange={loadAndParseLocalModels}
                    value=""
                />
            </div>
            {/* <input
                type="button"
                onClick={() => setState({mode: 'scenario'})}
                value="Configure scenario"
                className="btn btn-ghost"
                disabled={!state.canonicalId}
            /> */}
            <input
                type="button"
                onClick={() => setState({action: {type: 'compare'}})}
                value="Compare"
                className="btn btn-ghost"
                disabled={!state.canonicalId || state.modelsJSON.length < 2}
            />
            <input
                type="button"
                onClick={() => setState({mode: 'results'})}
                value="All results"
                className="btn btn-ghost"
                disabled={!state.results || Object.keys(state.results).length < 1}
            />
            {/* <div className="controls__load-url">
                <input 
                    type="text" 
                    ref={inputURL}
                    className="input"
                    placeholder="Enter URL here"
                    disabled
                />
                <input 
                    type="button" 
                    onClick={handleLoadURL}
                    value="Load from URL" 
                    className="btn btn-ghost"
                    disabled
                />
            </div> */}
        </div>
    );
}

export default Controls;
