import './FileControls.css';
import {useContext, useRef} from 'react';
import {loadAndParse, loadAndParseURL} from 'mm-modules';

import {AppContext} from '../App/App';

function FileControls() {
    const inputFile = useRef(null);
    const inputURL = useRef('');
    const {dispatch} = useContext(AppContext);
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
        if (fileList && fileList.length > 0) {
            const files = Array.from(fileList);
            files.forEach(async f => {
                const json = await loadAndParse(f);
                dispatch({
                    action: {
                        type: 'addJSON',
                        json
                    }
                });
            });
        }
    };

    return (
        <div className="controls">
            <div className="controls__load-local">
                <input 
                    type="button"
                    onClick={handleLoadLocal}
                    value="Load from Local"
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
            <div className="controls__load-url">
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
            </div>
        </div>
    );
}

export default FileControls;
