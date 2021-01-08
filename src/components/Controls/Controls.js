import './Controls.css';
import {useRef} from 'react';
import {loadAndParse, loadAndParseURL} from 'mm-modules';

function Controls({modelsJSON, setModelsJSON}) {
    const inputFile = useRef();
    const inputURL = useRef();
    const handleLoadLocal = () => inputFile.current.click();

    const handleLoadURL = async () => {
        const json = await loadAndParseURL(inputURL.current.value);

        setModelsJSON([...modelsJSON, json]);
    };

    const loadAndParseLocalModels = evt => {
        const fileList = evt.target.files;

        if(fileList && fileList.length > 0) {
            const files = Array.from(fileList);

            files.forEach(async f => {
                const json = await loadAndParse(f);

                setModelsJSON([...modelsJSON, json]);
            });

        }
    };

    const handleCompare = () => console.log("compare models...");

    return (
        <div className="controls">
            <div className="controls__load">
                <span className="controls__load-local">
                    <input 
                        type="button"
                        onClick={handleLoadLocal}
                        value="Load from Local"
                    />
                    <input 
                        type="file" 
                        multiple={true}
                        ref={inputFile}
                        style={{display:"none"}}
                        onChange={loadAndParseLocalModels}
                        value=""
                    />
                </span>
                <span className="controls__load-url">
                    <input 
                        type="button" 
                        onClick={handleLoadURL}
                        value="Load from URL" 
                    />
                    <input 
                        type="text" 
                        ref={inputURL}
                    />
                </span>
            </div>
            <input
                type="button"
                className="controls__compare"
                onClick={handleCompare}
                value="Compare"
            />
        </div>
    );
}

export default Controls;
