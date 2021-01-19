import {useContext, useRef} from 'react';
import {loadAndParse, loadAndParseURL} from 'mm-modules';
import {isDevEnv, updateClipboard} from '../../utils';
import {AppContext} from '../App/App';
import './Controls.css';

function Controls() {
    const inputFile = useRef(null);
    const inputURL = useRef('');
    const {state, setState, dispatch} = useContext(AppContext);
    const handleLoadLocal = () => inputFile.current.click();

    const handleLoadURL = async () => {
        const json = await loadAndParseURL(inputURL.current.value);
        dispatch({
            action: {
                type: 'addJSON',
                json
            }
        });
    };

    const loadAndParseLocalModels = evt => {
        const fileList = evt.target.files;
        return fileList && fileList.length > 0 && Array.from(fileList).forEach(async f => {
            const json = await loadAndParse(f);
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
            <input
                type="button"
                onClick={() => setState({action: {type: 'scenario'}})}
                value="Configure scenario"
                className="btn btn-ghost"
                disabled={!state.canonicalId}
            />
            <input
                type="button"
                onClick={() => setState({action: {type: 'compare'}})}
                value="Compare"
                className="btn btn-ghost"
                disabled={!state.canonicalId}
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
